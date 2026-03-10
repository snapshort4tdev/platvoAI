"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Shield,
  Crown,
  ChevronDown,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "@/lib/i18n";
import { PLANS, PLAN_ENUM, UPGRADEABLE_PLANS, PaidPlanEnumType } from "@/lib/constant";
import { getPlanFeatures } from "@/lib/plan-features";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import Footer from "../(web)/_common/footer";

export default function PricingPage() {
  const { language, updateLanguage } = useLanguage();
  const t = useTranslation();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [openFaqItems, setOpenFaqItems] = useState<Set<number>>(new Set());
  const isArabic = language === "ar";

  const freePlan = PLANS.find((p) => p.name === PLAN_ENUM.FREE);
  const proPlan = PLANS.find((p) => p.name === PLAN_ENUM.ALL_IN_ONE);

  // Get translated features from the same source as the dashboard
  const freeFeatures = freePlan ? getPlanFeatures(freePlan.name, language) : [];
  const proFeatures = proPlan ? getPlanFeatures(proPlan.name, language) : [];

  // Icons for features
  const featureIcons = [Zap, Sparkles, Check, Crown, Crown, Crown, Check, Check, Check, Shield];
  const freeFeatureIcons = [Zap, Sparkles, Check, Shield, Check, Check];

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const response = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "all_in_one",
          callbackUrl: `${window.location.origin}/pricing`,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        // Not authenticated — redirect to sign-in
        window.location.href = "/auth/sign-in";
        return;
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.message) {
        alert(data.message);
      }
    } catch {
      // If API fails (not logged in), redirect to sign-in
      window.location.href = "/auth/sign-in";
    } finally {
      setIsUpgrading(false);
    }
  };

  const toggleFaqItem = (index: number) => {
    const newItems = new Set(openFaqItems);
    if (newItems.has(index)) {
      newItems.delete(index);
    } else {
      newItems.add(index);
    }
    setOpenFaqItems(newItems);
  };

  const faqs = [
    {
      question: "billing.faq.whatAreCredits",
      answer: "billing.faq.creditsAnswer",
    },
    {
      question: "billing.faq.doImagesConsumeCredits",
      answer: "billing.faq.imagesAnswer",
    },
    {
      question: "billing.faq.howDoHDImagesWork",
      answer: "billing.faq.hdImagesAnswer",
    },
    {
      question: "billing.faq.whatHappensIfRunOutOfCredits",
      answer: "billing.faq.runOutOfCreditsAnswer",
    },
    {
      question: "billing.faq.whatHappensIfRunOutOfImages",
      answer: "billing.faq.runOutOfImagesAnswer",
    },
    {
      question: "billing.faq.doUnusedRollOver",
      answer: "billing.faq.rollOverAnswer",
    },
    {
      question: "billing.faq.canIShareAccount",
      answer: "billing.faq.shareAccountAnswer",
    },
    {
      question: "billing.faq.isThereUsageLimit",
      answer: "billing.faq.usageLimitAnswer",
    },
    {
      question: "billing.faq.howDoesBillingWork",
      answer: "billing.faq.billingAnswer",
    },
  ];

  return (
    <main className={cn("min-h-dvh w-full relative", isArabic && "rtl")}>
      {/* Background */}
      <div
        className="
          absolute inset-0 z-0
          bg-[radial-gradient(125%_125%_at_50%_10%,#ffffff_40%,#10b981_100%)]
          dark:bg-[radial-gradient(125%_125%_at_50%_10%,#0f172a_40%,#10b981_100%)]
        "
      >
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(226,232,240,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(226,232,240,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 30%, rgba(0,0,0,0.9) 70%, transparent 100%)",
            maskImage:
              "radial-gradient(circle at 50% 30%, rgba(0,0,0,0.9) 70%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(51,65,85,0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(51,65,85,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 30%, rgba(0,0,0,0.85) 65%, transparent 100%)",
            maskImage:
              "radial-gradient(circle at 50% 30%, rgba(0,0,0,0.85) 65%, transparent 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
          {/* Navbar */}
          <header>
            <nav
              className="mx-auto mt-px relative flex items-center justify-between gap-2 sm:gap-3
                rounded-full border bg-white/70 px-2 sm:px-4 py-1.5 sm:py-2 shadow-sm backdrop-blur-md
                dark:bg-black/30"
              aria-label="Primary"
            >
              <Logo url="/" />
              <ul className="hidden items-center gap-6 text-sm xl:text-base font-normal md:flex absolute left-1/2 transform -translate-x-1/2">
                <li>
                  <Link href="/" className="transition-colors hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="transition-colors text-foreground font-medium">
                    {t("landing.pricing")}
                  </Link>
                </li>
              </ul>
              <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateLanguage(language === "ar" ? "en" : "ar")}
                  className="text-xs sm:text-sm inline-flex px-2 sm:px-3"
                >
                  {language === "ar" ? "EN" : "عربي"}
                </Button>
                <Link
                  href="/auth/sign-in"
                  className="hidden text-sm transition-colors hover:text-foreground md:inline"
                >
                  {t("landing.signIn")}
                </Link>
                <Link href="/auth/sign-up" aria-label={t("landing.tryForFree")}>
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm">{t("landing.tryForFree")}</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </HoverBorderGradient>
                </Link>
              </div>
            </nav>
          </header>

          {/* Hero */}
          <div className="text-center mt-16 sm:mt-20 md:mt-24 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {t("landing.pricing")}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
              {isArabic ? (
                <>
                  اختر{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    خطتك
                  </span>
                </>
              ) : (
                <>
                  Choose your{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    plan
                  </span>
                </>
              )}
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {isArabic
                ? "وصول إلى GPT و Claude و Gemini وأكثر من 100 نموذج ذكاء اصطناعي من مساحة عمل واحدة قوية. بدون إدارة اشتراكات متعددة."
                : "Access GPT, Claude, Gemini, and 100+ AI models from one powerful workspace. No juggling subscriptions."}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-16">
            {/* Free Plan */}
            <div
              className="relative rounded-2xl border border-gray-200 dark:border-gray-700/50
                bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl
                p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300
                flex flex-col"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {isArabic ? "مجاني" : "Free"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isArabic
                    ? "ابدأ مع أساسيات الذكاء الاصطناعي"
                    : "Get started with AI essentials"}
                </p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                    $0
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    /{isArabic ? "شهرياً" : "month"}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {freeFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {React.createElement(freeFeatureIcons[i] || Check, {
                        className: "w-3 h-3 text-gray-500 dark:text-gray-400",
                      })}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                variant="outline"
                className="w-full rounded-xl py-6 text-base font-medium
                  border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800
                  transition-all duration-200"
              >
                <Link href="/auth/sign-up">
                  {isArabic ? "ابدأ مجاناً" : "Get Started Free"}
                  <ArrowRight className={cn("h-4 w-4", isArabic ? "mr-2 rotate-180" : "ml-2")} />
                </Link>
              </Button>
            </div>

            {/* PRO Plan */}
            <div
              className="relative rounded-2xl
                bg-gradient-to-b from-white to-emerald-50/50 dark:from-gray-900 dark:to-emerald-950/30
                backdrop-blur-xl
                p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300
                flex flex-col
                border-2 border-emerald-500/40 dark:border-emerald-500/30"
            >
              {/* Popular badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <div
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full
                  bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold
                  shadow-lg shadow-emerald-500/30"
                >
                  <Crown className="h-3 w-3" />
                  {isArabic ? "الأكثر شعبية" : "Most Popular"}
                </div>
              </div>

              <div className="mb-6 mt-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {t("billing.allInOnePlan")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isArabic
                    ? "كل ما تحتاجه، اشتراك واحد"
                    : "Everything you need, one subscription"}
                </p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                    ${proPlan?.price ?? "14.99"}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    /{isArabic ? "شهرياً" : "month"}
                  </span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  {isArabic
                    ? "وفر حتى 90% مقارنة بالاشتراكات المنفصلة"
                    : "Save up to 90% vs separate subscriptions"}
                </p>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {proFeatures.map((feature, i) => {
                  const isHighlight = i < 2 || i === proFeatures.length - 1;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          isHighlight
                            ? "bg-emerald-500/15 dark:bg-emerald-500/20"
                            : "bg-emerald-500/10 dark:bg-emerald-500/10"
                        }`}
                      >
                        {React.createElement(featureIcons[i] || Check, {
                          className: `w-3 h-3 ${
                            isHighlight
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-emerald-500/80 dark:text-emerald-500/60"
                          }`,
                        })}
                      </div>
                      <span
                        className={`text-sm ${
                          isHighlight
                            ? "text-gray-900 dark:text-white font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {feature}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="w-full rounded-xl py-6 text-base font-semibold
                  bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600
                  text-white shadow-lg shadow-emerald-500/30
                  hover:shadow-xl hover:shadow-emerald-500/40
                  transition-all duration-300 hover:scale-[1.02]
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isUpgrading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    {isArabic ? "يتم التحويل إلى Stripe..." : "Redirecting to Stripe..."}
                  </span>
                ) : (
                  <>
                    <CreditCard className={cn("h-4 w-4", isArabic ? "ml-2" : "mr-2")} />
                    {isArabic ? "ترقية إلى PRO" : "Upgrade to PRO"}
                    <ArrowRight className={cn("h-4 w-4", isArabic ? "mr-2 rotate-180" : "ml-2")} />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              {isArabic ? "مقارنة مفصلة" : "Detailed Comparison"}
            </h2>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-3 border-b border-gray-200 dark:border-gray-700/50">
                <div className="p-4 sm:p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {isArabic ? "الميزة" : "Feature"}
                  </h4>
                </div>
                <div className="p-4 sm:p-6 text-center border-l border-gray-200 dark:border-gray-700/50">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {isArabic ? "مجاني" : "Free"}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">$0/{isArabic ? "شهر" : "mo"}</p>
                </div>
                <div className="p-4 sm:p-6 text-center border-l border-emerald-200 dark:border-emerald-700/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">
                    PRO
                  </h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1">
                    ${proPlan?.price ?? "14.99"}/{isArabic ? "شهر" : "mo"}
                  </p>
                </div>
              </div>

              {/* Comparison rows */}
              {[
                {
                  feature: isArabic ? "رصيد الذكاء الاصطناعي" : "AI Credits",
                  free: isArabic ? "30 / شهر" : "30 / month",
                  pro: isArabic ? "3,500 / شهر" : "3,500 / month",
                },
                {
                  feature: isArabic ? "صور الذكاء الاصطناعي" : "AI Images",
                  free: isArabic ? "10 / شهر" : "10 / month",
                  pro: isArabic ? "120 / شهر" : "120 / month",
                },
                {
                  feature: isArabic ? "الملاحظات" : "Notes",
                  free: isArabic ? "غير محدود" : "Unlimited",
                  pro: isArabic ? "غير محدود" : "Unlimited",
                },
                {
                  feature: isArabic ? "نماذج AI متقدمة" : "Premium AI Models",
                  free: "—",
                  pro: "✓",
                },
                {
                  feature: isArabic ? "البحث المتقدم بالذكاء الاصطناعي" : "AI Advanced Search",
                  free: "—",
                  pro: "✓",
                },
                {
                  feature: isArabic ? "أحدث إصدارات النماذج" : "Latest Model Versions",
                  free: "—",
                  pro: "✓",
                },
                {
                  feature: isArabic ? "Claude, GPT, Gemini" : "Claude, GPT, Gemini",
                  free: isArabic ? "أساسي" : "Basic",
                  pro: isArabic ? "كامل" : "Full Access",
                },
                {
                  feature: isArabic ? "الدعم" : "Support",
                  free: isArabic ? "أساسي" : "Basic",
                  pro: isArabic ? "أولوية" : "Priority",
                },
                {
                  feature: isArabic ? "مجتمع" : "Community",
                  free: "✓",
                  pro: "✓",
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className={cn(
                    "grid grid-cols-3 border-b border-gray-100 dark:border-gray-800/50 last:border-b-0",
                    i % 2 === 0 ? "bg-transparent" : "bg-gray-50/30 dark:bg-gray-800/10"
                  )}
                >
                  <div className="p-4 sm:px-6 sm:py-3.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {row.feature}
                  </div>
                  <div className="p-4 sm:px-6 sm:py-3.5 text-sm text-center text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700/50">
                    {row.free}
                  </div>
                  <div className="p-4 sm:px-6 sm:py-3.5 text-sm text-center font-medium text-emerald-700 dark:text-emerald-400 border-l border-emerald-200 dark:border-emerald-700/50 bg-emerald-50/30 dark:bg-emerald-950/10">
                    {row.pro}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust section */}
          <div className="text-center mb-16">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>{isArabic ? "مدفوعات آمنة عبر Stripe" : "Secure payments via Stripe"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>{isArabic ? "إلغاء في أي وقت" : "Cancel anytime"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>{isArabic ? "وصول فوري بعد الدفع" : "Instant access after payment"}</span>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <HelpCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  FAQ
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {t("billing.faq.title")}
              </h2>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl overflow-hidden">
              {faqs.map((faq, index) => {
                const isOpen = openFaqItems.has(index);
                return (
                  <Collapsible
                    key={index}
                    open={isOpen}
                    onOpenChange={() => toggleFaqItem(index)}
                  >
                    <CollapsibleTrigger
                      className={cn(
                        "w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors",
                        "border-b border-gray-100 dark:border-gray-800/50 last:border-b-0",
                        isArabic && "flex-row-reverse"
                      )}
                    >
                      <span
                        className={cn(
                          "font-medium text-gray-900 dark:text-white",
                          isArabic ? "text-right" : "text-left"
                        )}
                      >
                        {t(faq.question)}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                      <p
                        className={cn(
                          "leading-relaxed pt-2 text-sm",
                          isArabic && "text-right"
                        )}
                      >
                        {t(faq.answer)}
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </div>

          {/* CTA section */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-b from-white to-emerald-50/50 dark:from-gray-900 dark:to-emerald-950/30 backdrop-blur-xl p-8 sm:p-12 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {isArabic ? "هل أنت مستعد للبدء؟" : "Ready to get started?"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                {isArabic
                  ? "انضم إلى آلاف المستخدمين الذين يستخدمون Platvo للوصول إلى أفضل نماذج الذكاء الاصطناعي بسعر واحد."
                  : "Join thousands of users who use Platvo to access the best AI models at one price."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="rounded-xl px-8 py-6 text-base font-semibold
                    bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600
                    text-white shadow-lg shadow-emerald-500/30
                    hover:shadow-xl hover:shadow-emerald-500/40
                    transition-all duration-300 hover:scale-[1.02]
                    disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isUpgrading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {isArabic ? "جاري التحويل..." : "Redirecting..."}
                    </span>
                  ) : (
                    <>
                      {isArabic ? "ترقية إلى PRO" : "Upgrade to PRO"}
                      <ArrowRight className={cn("h-4 w-4", isArabic ? "mr-2 rotate-180" : "ml-2")} />
                    </>
                  )}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl px-8 py-6 text-base font-medium
                    border-gray-300 dark:border-gray-600"
                >
                  <Link href="/auth/sign-up">
                    {isArabic ? "ابدأ مجاناً" : "Start Free"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
