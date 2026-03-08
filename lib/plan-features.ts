import { PLAN_ENUM } from "./constant";
import type { Language } from "./i18n/translations";
import { translations } from "./i18n/translations";

/**
 * Get translated plan features based on plan name and language
 */
export function getPlanFeatures(planName: string, language: Language = "en"): string[] {
  const t = translations[language].billing.planFeatures;

  if (planName === PLAN_ENUM.ALL_IN_ONE) {
    return [
      t.credits1500,
      t.images100,
      t.fullAccess,
      t.latestModelVersions,
      t.latestModels,
      t.premiumModels,
      t.advancedSearch,
      t.unlimitedNotes,
      t.communityAccess,
      t.prioritySupport,
    ];
  }

  if (planName === PLAN_ENUM.FREE) {
    return [
      t.credits30,
      t.images10,
      t.unlimitedNotes,
      t.basicSupport,
      t.coreFeatures,
      t.communityAccess,
    ];
  }

  // Default/Unknown plan
  return [];
}
