"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, Zap, Shield, Crown } from "lucide-react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "@/lib/i18n";
import { PLANS, PLAN_ENUM } from "@/lib/constant";
import Footer from "../(web)/_common/footer";

export default function PricingPage() {
    const { language, updateLanguage } = useLanguage();
    const t = useTranslation();
    const [isAnnual, setIsAnnual] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);

    const freePlan = PLANS.find((p) => p.name === PLAN_ENUM.FREE);
    const proPlan = PLANS.find((p) => p.name === PLAN_ENUM.ALL_IN_ONE);

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

    const freeFeatures = [
        { text: "30 AI Credits / month", icon: Zap },
        { text: "10 AI Images / month", icon: Sparkles },
        { text: "Unlimited Notes", icon: Check },
        { text: "Basic Support", icon: Shield },
        { text: "Access to core features", icon: Check },
        { text: "Community access", icon: Check },
    ];

    const proFeatures = [
        { text: "3,500 AI Credits / month", icon: Zap, highlight: true },
        { text: "120 AI Images / month", icon: Sparkles, highlight: true },
        { text: "Full access to all Platvo tools", icon: Check },
        { text: "Latest AI model versions", icon: Crown },
        { text: "Claude, GPT, Gemini & more", icon: Crown },
        { text: "Premium & advanced AI models", icon: Crown },
        { text: "AI Advanced Search", icon: Check },
        { text: "Unlimited Notes", icon: Check },
        { text: "Community access", icon: Check },
        { text: "Priority Support", icon: Shield, highlight: true },
    ];

    return (
        <main className="min-h-dvh w-full relative">
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
                                Simple, transparent pricing
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Choose your{" "}
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                                plan
                            </span>
                        </h1>
                        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Access GPT, Claude, Gemini, and 100+ AI models from one powerful workspace.
                            No juggling subscriptions.
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-20">
                        {/* Free Plan */}
                        <div
                            className="relative rounded-2xl border border-gray-200 dark:border-gray-700/50
                bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl
                p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300
                flex flex-col"
                        >
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Free</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Get started with AI essentials
                                </p>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">$0</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">/month</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8 flex-1">
                                {freeFeatures.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            <feature.icon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature.text}</span>
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
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4" />
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
                                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full
                  bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold
                  shadow-lg shadow-emerald-500/30">
                                    <Crown className="h-3 w-3" />
                                    Most Popular
                                </div>
                            </div>

                            <div className="mb-6 mt-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    PRO Plan
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Everything you need, one subscription
                                </p>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                                        ${proPlan?.price ?? "14.99"}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">/month</span>
                                </div>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                                    Save up to 90% vs separate subscriptions
                                </p>
                            </div>

                            <div className="space-y-3 mb-8 flex-1">
                                {proFeatures.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div
                                            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${feature.highlight
                                                    ? "bg-emerald-500/15 dark:bg-emerald-500/20"
                                                    : "bg-emerald-500/10 dark:bg-emerald-500/10"
                                                }`}
                                        >
                                            <feature.icon
                                                className={`w-3 h-3 ${feature.highlight
                                                        ? "text-emerald-600 dark:text-emerald-400"
                                                        : "text-emerald-500/80 dark:text-emerald-500/60"
                                                    }`}
                                            />
                                        </div>
                                        <span
                                            className={`text-sm ${feature.highlight
                                                    ? "text-gray-900 dark:text-white font-medium"
                                                    : "text-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
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
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Redirecting to Stripe...
                                    </span>
                                ) : (
                                    <>
                                        Upgrade to PRO
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Trust section */}
                    <div className="text-center mb-16">
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                <span>Secure payments via Stripe</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4" />
                                <span>Cancel anytime</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                <span>Instant access after payment</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </main>
    );
}
