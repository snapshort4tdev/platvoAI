import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PaidPlanEnumType,
  PLAN_ENUM,
  PlanEnumType,
  PLANS,
  UPGRADEABLE_PLANS,
} from "@/lib/constant";
import { cn } from "@/lib/utils";
import { Check, Loader } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface Props {
  plan: (typeof PLANS)[number];
  subscription?: {
    isAllowed: boolean;
    hasPaidSubscription: boolean;
    plan: PlanEnumType;
    generationsUsed: number;
    generationsLimit: number | null;
    remainingGenerations: string | number;
  };
  loading: boolean;
  error: string | null;
  isUpgrading: boolean;
  isManaging: boolean;
  onUpgrade: (plan: PaidPlanEnumType) => void;
  onManage: () => void;
}

const PlanCard = React.memo(
  ({
    plan,
    subscription,
    loading,
    error,
    isUpgrading,
    isManaging,
    onUpgrade,
    onManage,
  }: Props) => {
    const t = useTranslation();
    const isPopular =
      plan.name === PLAN_ENUM.ALL_IN_ONE && UPGRADEABLE_PLANS.length > 1;
    const isCurrent = subscription?.plan === plan.name;
    const action = subscription?.hasPaidSubscription
      ? t("billing.switchPlan")
      : t("billing.upgrade");
    const planLabel =
      plan.name === PLAN_ENUM.ALL_IN_ONE
        ? t("billing.allInOnePlan")
        : plan.name.replaceAll("_", " ");

    const generationsUsed = isCurrent ? subscription?.generationsUsed ?? 0 : 0;

    const generationsLimit = isCurrent ? subscription?.generationsLimit : null;

    const remainingGenerations = isCurrent
      ? subscription?.remainingGenerations
      : null;

    const percentUsed =
      generationsLimit && generationsLimit > 0
        ? Math.min((generationsUsed / generationsLimit) * 100, 100)
        : 0;

    return (
      <div className="flex flex-col p-4 sm:p-6 md:border-l border-b md:border-b-0 last:border-b-0">
        <div className="flex-1">
          <div className="flex items-center justify-start gap-2 mb-2">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold">
              {planLabel}
            </h3>

            {isPopular && !isCurrent && (
              <Badge className="bg-primary/10 text-primary text-xs">
                {t("billing.popular")}
              </Badge>
            )}

            {isCurrent && (
              <Badge className="bg-gray-200 text-gray-700 text-xs">
                {t("billing.current")}
              </Badge>
            )}
          </div>

          <div className="mb-4">
            <div className="text-sm sm:text-base font-normal">
              ${plan.price}
              <span className="text-xs sm:text-sm text-muted-foreground ml-1">
                {t("billing.perMonthBilled")}
              </span>
            </div>
          </div>

          {isCurrent && (
            <div className="mb-4 text-sm text-muted-foreground">
              {generationsLimit === null ? (
                t("billing.unlimitedGenerations")
              ) : (
                <>
                  {remainingGenerations} / {generationsLimit} {t("billing.generationsLeft")}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-2 bg-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${percentUsed}` }}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-4">
          {loading ? (
            <Skeleton className="h-10 w-full sm:w-28 rounded-md" />
          ) : error ? (
            <div className="text-sm text-destructive">{error}</div>
          ) : isCurrent && plan.name !== PLAN_ENUM.FREE ? (
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              disabled={isManaging}
              onClick={onManage}
            >
              {isManaging ? <Loader className="w-4 h-4 animate-spin" /> : t("billing.manage")}
            </Button>
          ) : plan.name === PLAN_ENUM.FREE && isCurrent ? (
            // Free plan - already current, no action needed
            null
          ) : UPGRADEABLE_PLANS.includes(plan.name as PaidPlanEnumType) ? (
            <Button
              variant={isPopular ? "default" : "outline"}
              className={cn(
                "cursor-pointer w-full sm:w-auto",
                isPopular && "bg-primary hover:opacity-80 text-white"
              )}
              disabled={isUpgrading}
              onClick={() => onUpgrade(plan.name as PaidPlanEnumType)}
            >
              {isUpgrading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>{action}</>
              )}
            </Button>
          ) : null}
        </div>
      </div>
    );
  }
);

PlanCard.displayName = "PlanCard";

export default PlanCard;

export const FeatureRow = React.memo(({ features }: { features: string[] }) => {
  return (
    <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
      {features?.map((feature, index) => (
        <div key={index} className="flex items-start gap-2 text-xs sm:text-sm">
          <Check className="w-4 h-4 flex-shrink-0 text-muted-foreground mt-0.5" />
          <span className="leading-relaxed">{feature}</span>
        </div>
      ))}
    </div>
  );
});

FeatureRow.displayName = "FeatureRow";
