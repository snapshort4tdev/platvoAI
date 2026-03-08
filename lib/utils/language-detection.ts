/**
 * Language detection utility for detecting Arabic text
 */

// Arabic Unicode range: U+0600 to U+06FF
const ARABIC_REGEX = /[\u0600-\u06FF]/;

/**
 * Detects the primary language of the given text
 * @param text - The text to analyze
 * @returns 'ar' if Arabic is detected, 'en' if only English/Latin, 'mixed' if both
 */
export function detectLanguage(text: string): 'ar' | 'en' | 'mixed' {
  if (!text || text.trim().length === 0) {
    return 'en';
  }

  const hasArabic = ARABIC_REGEX.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);

  if (hasArabic && hasLatin) {
    return 'mixed';
  }
  
  if (hasArabic) {
    return 'ar';
  }

  return 'en';
}

/**
 * Checks if text contains Arabic characters
 * @param text - The text to check
 * @returns true if Arabic is detected
 */
export function isArabic(text: string): boolean {
  return detectLanguage(text) === 'ar' || detectLanguage(text) === 'mixed';
}

/**
 * Gets the text direction based on language detection
 * @param text - The text to analyze
 * @returns 'rtl' for Arabic/mixed, 'ltr' for English
 */
export function getTextDirection(text: string): 'rtl' | 'ltr' {
  const lang = detectLanguage(text);
  return lang === 'ar' || lang === 'mixed' ? 'rtl' : 'ltr';
}
