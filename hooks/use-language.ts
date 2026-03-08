"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Language } from "@/lib/i18n/translations";

/**
 * Hook to manage user language preference
 * Fetches language from API and provides state management
 */
export function useLanguage() {
  const queryClient = useQueryClient();
  const [language, setLanguage] = useState<Language>("en");

  // Fetch user's language preference
  const { data: languageData, isLoading } = useQuery({
    queryKey: ["user-language"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/user/language");
        if (!response.ok) {
          // If not authenticated, use localStorage or default to "en"
          const stored = typeof window !== "undefined" ? localStorage.getItem("language") : null;
          return (stored as Language) || "en";
        }
        const data = await response.json();
        return data.language as Language;
      } catch (error) {
        // Fallback to localStorage or default
        const stored = typeof window !== "undefined" ? localStorage.getItem("language") : null;
        return (stored as Language) || "en";
      }
    },
    staleTime: Infinity, // Language doesn't change often
    retry: 1,
  });

  // Update language preference
  const updateLanguageMutation = useMutation({
    mutationFn: async (newLanguage: Language) => {
      try {
        const response = await fetch("/api/user/language", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ language: newLanguage }),
        });

        if (!response.ok) {
          // If 401 (Unauthorized), user is not authenticated - that's fine, use localStorage
          if (response.status === 401) {
            return newLanguage;
          }
          const error = await response.json();
          throw new Error(error.error || "Failed to update language");
        }

        const data = await response.json();
        return data.language as Language;
      } catch (error) {
        // If network error or other issue, still return the language for localStorage
        return newLanguage;
      }
    },
    onSuccess: (newLanguage) => {
      // Update local state
      setLanguage(newLanguage);
      // Invalidate and refetch
      queryClient.setQueryData(["user-language"], newLanguage);
    },
  });

  // Update local state when data is fetched
  useEffect(() => {
    if (languageData) {
      setLanguage(languageData);
      // Also store in localStorage for unauthenticated users
      if (typeof window !== "undefined") {
        localStorage.setItem("language", languageData);
      }
    }
  }, [languageData]);

  // Load from localStorage on mount for unauthenticated users
  useEffect(() => {
    if (typeof window !== "undefined" && !languageData && !isLoading) {
      const stored = localStorage.getItem("language");
      if (stored && (stored === "en" || stored === "ar")) {
        setLanguage(stored as Language);
      }
    }
  }, [languageData, isLoading]);

  const updateLanguage = (newLanguage: Language) => {
    // Store in localStorage immediately for unauthenticated users
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage);
    }
    setLanguage(newLanguage);
    // Try to update on server if authenticated
    updateLanguageMutation.mutate(newLanguage);
  };

  return {
    language,
    updateLanguage,
    isLoading: isLoading || updateLanguageMutation.isPending,
    isUpdating: updateLanguageMutation.isPending,
  };
}
