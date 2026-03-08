"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/hono/hono-rpc";
import { Badge } from "@/components/ui/badge";
import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

export function UsageBadge() {
  const { data, isLoading } = useQuery<UsageStats>({
    queryKey: ["usage"],
    queryFn: async () => {
      const response = await api.subscription.usage.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch usage");
      }
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading || !data) {
    return (
      <Badge variant="outline" className="gap-1">
        <LoaderIcon className="h-3 w-3 animate-spin" />
        <span className="text-xs">Loading...</span>
      </Badge>
    );
  }

  const creditsRemaining = data.credits.remaining;
  const isLow = creditsRemaining < 100;

  return (
    <Badge
      variant={isLow ? "destructive" : "outline"}
      className={cn("gap-1", isLow && "animate-pulse")}
    >
      <span className="text-xs">
        {creditsRemaining} {creditsRemaining === 1 ? "Credit" : "Credits"}
      </span>
    </Badge>
  );
}
