"use client";
import React from "react";
import {
  useCheckGenerations,
  useCreatePortalSession,
  useUpgradeSubscription,
} from "@/features/use-subscription";
import { PaidPlanEnumType, PLAN_ENUM, PLANS, UPGRADEABLE_PLANS } from "@/lib/constant";
import PlanCard, { FeatureRow } from "./plan-card";
import { useTranslation } from "@/lib/i18n";
import { useLanguage } from "@/hooks/use-language";
import { getPlanFeatures } from "@/lib/plan-features";

const PricingSection = () => {
  const t = useTranslation();
  const { language } = useLanguage();
  const {
    data: subscription,
    isPending,
    isError,
    error,
  } = useCheckGenerations();
  const { mutate, isPending: isUpgrading } = useUpgradeSubscription();
  const { mutate: createPortalSession, isPending: isManaging } =
    useCreatePortalSession();
  const plansToShow = PLANS.filter((plan) =>
    UPGRADEABLE_PLANS.includes(plan.name as PaidPlanEnumType)
  );
  const desktopGridColumns = `minmax(0,1fr) repeat(${plansToShow.length}, minmax(0,1fr))`;
  const getPlanLabel = (planName: string) =>
    planName === PLAN_ENUM.ALL_IN_ONE
      ? t("billing.allInOnePlan")
      : planName.replaceAll("_", " ");

  const onUpgrade = (plan: PaidPlanEnumType) => {
    if (isUpgrading) return;
    mutate({
      plan: plan,
      callbackUrl: `${window.location.origin}/billing`,
    });
  };

  const onManage = () => {
    if (isManaging) return;
    createPortalSession({
      callbackUrl: `${window.location.origin}/billing`,
    });
  };
  return (
    <div>
      <div className="w-full px-3 sm:pl-3 mt-8 sm:mt-16 mb-4 sm:mb-1">
        <h2 className="text-base sm:text-lg lg:text-xl font-medium">{t("billing.allPlans")}</h2>
      </div>

      <div className="rounded-lg border overflow-hidden">
        {/* Header row - hidden on mobile, visible on desktop */}
        <div className="hidden md:grid border-b" style={{ gridTemplateColumns: desktopGridColumns }}>
          <div className="lg:p-6"></div>
          {plansToShow.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              subscription={subscription}
              loading={isPending}
              error={isError ? error?.message ?? t("billing.failedToLoad") : null}
              isUpgrading={isUpgrading}
              isManaging={isManaging}
              onUpgrade={onUpgrade}
              onManage={onManage}
            />
          ))}
        </div>

        {/* Mobile/Tablet: Stack plans vertically */}
        <div className="md:hidden">
          {plansToShow.map((plan) => (
            <div key={plan.id} className="border-b last:border-b-0">
              <PlanCard
                plan={plan}
                subscription={subscription}
                loading={isPending}
                error={isError ? error?.message ?? t("billing.failedToLoad") : null}
                isUpgrading={isUpgrading}
                isManaging={isManaging}
                onUpgrade={onUpgrade}
                onManage={onManage}
              />
            </div>
          ))}
        </div>

        {/* Features section */}
        <div className="bg-gray-50/80 dark:bg-secondary/40">
          {/* Desktop: Grid layout */}
          <div className="hidden md:grid min-h-56 pb-5" style={{ gridTemplateColumns: desktopGridColumns }}>
            <div className="p-4 lg:p-6">
              <h4 className="font-medium">{t("billing.highlights")}</h4>
            </div>
            {plansToShow.map((plan) => {
              const translatedFeatures = getPlanFeatures(plan.name, language);
              return <FeatureRow key={plan.name} features={translatedFeatures} />;
            })}
          </div>

          {/* Mobile/Tablet: Stack features */}
          <div className="md:hidden">
            {plansToShow.map((plan) => {
              const translatedFeatures = getPlanFeatures(plan.name, language);
              return (
                <div key={plan.name} className="border-b last:border-b-0 p-4">
                  <h4 className="font-medium mb-3">{getPlanLabel(plan.name)} {t("billing.planHighlights")}</h4>
                  <FeatureRow features={translatedFeatures} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
