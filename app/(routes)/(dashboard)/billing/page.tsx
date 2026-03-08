"use client";
import React from "react";
import Header from "../_common/header";
import PricingSection from "./_common/pricing-section";
import FAQSection from "./_common/faq-section";
import { UsageDashboard } from "@/components/usage/usage-dashboard";
import { useTranslation } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/hono/hono-rpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderIcon } from "lucide-react";
import {
  useCancelSubscription,
  useCreatePortalSession,
  useReactivateSubscription,
  useUpgradeSubscription,
} from "@/features/use-subscription";
import { PLAN_ENUM } from "@/lib/constant";
import { toast } from "sonner";

const Billing = () => {
  const t = useTranslation();
  const { mutate: upgrade, isPending: isUpgrading } = useUpgradeSubscription();
  const { mutate: createPortalSession, isPending: isCreatingPortalSession } =
    useCreatePortalSession();
  const { mutate: cancelSubscription, isPending: isCancelingSubscription } =
    useCancelSubscription();
  const {
    mutate: reactivateSubscription,
    isPending: isReactivatingSubscription,
  } = useReactivateSubscription();

  const { data: subscriptionStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      const response = await api.subscription.status.$get();
      if (!response.ok) {
        throw new Error(t("billing.failedToFetchStatus"));
      }
      const result = await response.json();
      return result.data;
    },
  });
  const hasPaidSubscription =
    subscriptionStatus?.plan === PLAN_ENUM.ALL_IN_ONE &&
    !!subscriptionStatus?.stripeSubscriptionId;

  const handleUpgrade = () => {
    upgrade({
      plan: PLAN_ENUM.ALL_IN_ONE,
      callbackUrl: `${window.location.origin}/billing`,
    });
  };

  const handleSyncSubscription = async () => {
    try {
      const response = await api.subscription.sync.$post();
      
      let result;
      try {
        result = await response.json();
      } catch {
        // If response is not valid JSON, show a generic error
        throw new Error(t("billing.failedToSyncSubscription"));
      }
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || t("billing.failedToSyncSubscription"));
      }
      
      toast.success(result.message || t("billing.subscriptionSynced"));
      // Refetch usage and status
      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("billing.failedToSyncSubscription")
      );
    }
  };

  const handleManageSubscription = () => {
    createPortalSession({
      callbackUrl: `${window.location.origin}/billing`,
    });
  };

  const handleCancelSubscription = () => {
    cancelSubscription();
  };

  const handleReactivateSubscription = () => {
    reactivateSubscription();
  };

  return (
    <>
      <Header title={t("sidebar.billing")} />
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-8">
        <div className="w-full space-y-6">
          {/* Usage Dashboard */}
          <UsageDashboard />

          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t("billing.subscriptionStatus")}</CardTitle>
              <CardDescription>{t("billing.currentPlan")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStatus ? (
                <div className="flex items-center justify-center py-4">
                  <LoaderIcon className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : subscriptionStatus ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t("billing.plan")}:</span>
                    <span className="text-sm capitalize">
                      {subscriptionStatus.plan === "all_in_one"
                        ? t("billing.allInOnePlan")
                        : subscriptionStatus.plan}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t("billing.status")}:</span>
                    <span className="text-sm capitalize">
                      {subscriptionStatus.status}
                    </span>
                  </div>
                  {subscriptionStatus.periodEnd && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t("billing.nextBillingDate")}:
                      </span>
                      <span className="text-sm">
                        {new Date(
                          subscriptionStatus.periodEnd
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {subscriptionStatus.cancelAtPeriodEnd && (
                    <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-3">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {t("billing.subscriptionWillCancel")}
                      </p>
                    </div>
                  )}
                  <div className="pt-4 border-t space-y-3">
                    {hasPaidSubscription && (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleManageSubscription}
                          disabled={isCreatingPortalSession}
                        >
                          {isCreatingPortalSession
                            ? t("common.loading")
                            : t("billing.manageSubscription")}
                        </Button>
                        {subscriptionStatus.cancelAtPeriodEnd ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReactivateSubscription}
                            disabled={isReactivatingSubscription}
                          >
                            {isReactivatingSubscription
                              ? t("common.loading")
                              : t("billing.reactivateSubscription")}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelSubscription}
                            disabled={isCancelingSubscription}
                          >
                            {isCancelingSubscription
                              ? t("common.loading")
                              : t("billing.cancelSubscription")}
                          </Button>
                        )}
                      </div>
                    )}
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSyncSubscription}
                      >
                        {t("billing.syncSubscription")}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        {t("billing.syncSubscriptionDescription")}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t("billing.noActiveSubscription")}
                  </p>
                  <Button onClick={handleUpgrade} disabled={isUpgrading}>
                    {isUpgrading ? (
                      <>
                        <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                        {t("common.loading")}
                      </>
                    ) : (
                      t("billing.upgrade")
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Section */}
          <PricingSection />

          {/* FAQ Section */}
          <FAQSection />
        </div>
      </div>
    </>
  );
};

export default Billing;
