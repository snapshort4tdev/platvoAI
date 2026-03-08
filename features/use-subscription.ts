import { api } from "@/lib/hono/hono-rpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlanEnumType, PLAN_ENUM, PaidPlanEnumType } from "@/lib/constant";

type RequestUpgradeSubscriptionType = {
  plan: PaidPlanEnumType;
  callbackUrl: string;
};

type RequestPortalSessionType = {
  callbackUrl: string;
};

type GenericSubscriptionResponse = {
  success: boolean;
  url?: string | null;
  message?: string;
};

async function parseSubscriptionResponse(
  response: Response,
  defaultMessage: string
): Promise<GenericSubscriptionResponse> {
  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    url?: string | null;
    message?: string;
  };

  if (!response.ok || !data.success) {
    throw new Error(data.message || defaultMessage);
  }

  return {
    success: data.success ?? true,
    url: data.url ?? undefined,
    message: data.message,
  };
}

export const useUpgradeSubscription = () => {
  return useMutation<
    GenericSubscriptionResponse,
    Error,
    RequestUpgradeSubscriptionType
  >({
    mutationFn: async (json) => {
      const response = await api.subscription.upgrade.$post({ json });
      return parseSubscriptionResponse(
        response,
        "Failed to create checkout session"
      );
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else if (data.message) {
        toast.info(data.message);
      }
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to create checkout session");
    },
  });
};

export const useCreatePortalSession = () => {
  return useMutation<
    GenericSubscriptionResponse,
    Error,
    RequestPortalSessionType
  >({
    mutationFn: async (json) => {
      const response = await api.subscription.portal.$post({ json });
      return parseSubscriptionResponse(response, "Failed to open billing portal");
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else if (data.message) {
        toast.info(data.message);
      }
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to open billing portal");
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<GenericSubscriptionResponse, Error>({
    mutationFn: async () => {
      const response = await api.subscription.cancel.$post();
      return parseSubscriptionResponse(response, "Failed to cancel subscription");
    },
    onSuccess: (data) => {
      toast.success(data.message || "Subscription canceled successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
      queryClient.invalidateQueries({ queryKey: ["generations"] });
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to cancel subscription");
    },
  });
};

export const useReactivateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<GenericSubscriptionResponse, Error>({
    mutationFn: async () => {
      const response = await api.subscription.reactivate.$post();
      return parseSubscriptionResponse(
        response,
        "Failed to reactivate subscription"
      );
    },
    onSuccess: (data) => {
      toast.success(data.message || "Subscription reactivated successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
      queryClient.invalidateQueries({ queryKey: ["generations"] });
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to reactivate subscription");
    },
  });
};

export const useCheckGenerations = () => {
  return useQuery<{
    isAllowed: boolean;
    hasPaidSubscription: boolean;
    plan: PlanEnumType;
    generationsUsed: number;
    generationsLimit: number | null;
    remainingGenerations: string | number;
  }>({
    queryKey: ["generations"],
    queryFn: async () => {
      const response = await api.subscription.generations.$get();
      if (!response.ok) {
        // Return default unlimited values if subscription endpoint fails
        return {
          isAllowed: true,
          hasPaidSubscription: false,
          plan: PLAN_ENUM.FREE,
          generationsUsed: 0,
          generationsLimit: null,
          remainingGenerations: "Unlimited",
        };
      }
      const { data } = await response.json();
      // Ensure plan is properly typed
      return {
        ...data,
        plan: data.plan as PlanEnumType,
      };
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: false, // Don't retry on failure, just use default values
  });
};
