"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/hono/hono-rpc";
import { Card, CardContent } from "@/components/ui/card";
import { LoaderIcon } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { CircularProgress } from "./circular-progress";
import { useLanguage } from "@/hooks/use-language";

interface UsageStats {
  credits: {
    used: number;
    limit: number;
    remaining: number;
    percentageUsed: number;
  };
  images: {
    used: number;
    limit: number;
    remaining: number;
    percentageUsed: number;
  };
  daysUntilReset: number | null;
  subscriptionStatus: string | null;
  plan: string | null;
  periodEnd?: string | null;
}

export function UsageDashboard() {
  const t = useTranslation();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const { data, isLoading, error } = useQuery<UsageStats>({
    queryKey: ["usage"],
    queryFn: async () => {
      const response = await api.subscription.usage.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch usage");
      }
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoaderIcon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">
            {t("common.error")}: {error instanceof Error ? error.message : "Failed to load usage"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const creditsRemainingPercentage = data.credits.limit > 0 
    ? ((data.credits.remaining / data.credits.limit) * 100) 
    : 0;
  const imagesRemainingPercentage = data.images.limit > 0 
    ? ((data.images.remaining / data.images.limit) * 100) 
    : 0;

  // Format next renewal date
  let renewalDateText = "";
  if (data.periodEnd) {
    const renewalDate = new Date(data.periodEnd);
    renewalDateText = renewalDate.toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } else if (data.daysUntilReset !== null) {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    renewalDateText = nextMonth.toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className={cn("w-full space-y-6", isArabic && "rtl")}>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credits Card */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className={cn("flex flex-col items-center space-y-4", isArabic && "text-right")}>
              {/* Title */}
              <h3 className="text-lg font-semibold text-foreground">
                {t("billing.credits")}
              </h3>

              {/* Circular Progress */}
              <CircularProgress
                value={data.credits.percentageUsed}
                size={140}
                strokeWidth={14}
                color="hsl(var(--primary))" // Brand primary color
              />

              {/* Main Usage Display */}
              <div className="text-center space-y-1">
                <div className="text-3xl font-bold text-foreground">
                  {data.credits.remaining.toLocaleString()} / {data.credits.limit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("billing.remainingPercentage")}
                </p>
              </div>

              {/* Details */}
              <div className={cn("w-full space-y-2 pt-2", isArabic && "text-right")}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("billing.remaining")}:</span>
                  <span className="font-medium">{data.credits.remaining.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("billing.used")}:</span>
                  <span className="font-medium">{data.credits.used.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("billing.monthlyLimit")}:</span>
                  <span className="font-medium">{data.credits.limit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images Card */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className={cn("flex flex-col items-center space-y-4", isArabic && "text-right")}>
              {/* Title */}
              <h3 className="text-lg font-semibold text-foreground">
                {t("billing.images")}
              </h3>

              {/* Circular Progress */}
              <CircularProgress
                value={data.images.percentageUsed}
                size={140}
                strokeWidth={14}
                color="hsl(var(--primary))" // Brand primary color
              />

              {/* Main Usage Display */}
              <div className="text-center space-y-1">
                <div className="text-3xl font-bold text-foreground">
                  {data.images.remaining.toLocaleString()} / {data.images.limit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("billing.remainingPercentage")}
                </p>
              </div>

              {/* Details */}
              <div className={cn("w-full space-y-2 pt-2", isArabic && "text-right")}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("billing.remaining")}:</span>
                  <span className="font-medium">{data.images.remaining.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("billing.used")}:</span>
                  <span className="font-medium">{data.images.used.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("billing.monthlyLimit")}:</span>
                  <span className="font-medium">{data.images.limit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Renewal Date */}
      {renewalDateText && (
        <div className={cn("text-sm text-muted-foreground", isArabic && "text-right")}>
          {t("billing.nextRenewal")}: {renewalDateText}
        </div>
      )}
    </div>
  );
}
