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
      // First, check localStorage so we skip the API call for unauthenticated users
      const stored = typeof window !== "undefined" ? localStorage.getItem("language") : null;
      if (stored === "en" || stored === "ar") {
        return stored as Language;
      }

      // Only hit the server if no local preference exists (i.e., returning authenticated user)
      try {
        const response = await fetch("/api/user/language");
        if (!response.ok) {
          return "en" as Language;
        }
        const data = await response.json();
        return data.language as Language;
      } catch {
        return "en" as Language;
      }
    },
    staleTime: Infinity,
    retry: 0, // Don't retry auth errors
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
