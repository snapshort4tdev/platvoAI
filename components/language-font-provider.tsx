"use client";

import { useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";

/**
 * Component that applies language-specific font classes to the document
 */
export function LanguageFontProvider() {
  const { language } = useLanguage();

  useEffect(() => {
    // Apply language class to body
    if (language === "ar") {
      document.documentElement.classList.add("lang-ar");
      document.body.classList.add("font-arabic");
    } else {
      document.documentElement.classList.remove("lang-ar");
      document.body.classList.remove("font-arabic");
    }
  }, [language]);

  return null;
}
