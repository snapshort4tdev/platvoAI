"use client";

import { translations, type Language, type Translations } from "./translations";
import { useLanguage } from "@/hooks/use-language";

/**
 * Translation hook to get translated strings
 * @param key - Translation key in dot notation (e.g., "sidebar.home")
 * @returns Translated string
 */
export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: string): string => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Return the key if translation not found
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === "string" ? value : key;
  };
  
  return t;
}

/**
 * Get translation for a specific language (for server components)
 * @param language - Language code
 * @param key - Translation key in dot notation
 * @returns Translated string
 */
export function getTranslation(language: Language, key: string): string {
  const keys = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return typeof value === "string" ? value : key;
}

/**
 * Get all translations for a specific language
 * @param language - Language code
 * @returns All translations for that language
 */
export function getTranslations(language: Language): Translations {
  return translations[language];
}
