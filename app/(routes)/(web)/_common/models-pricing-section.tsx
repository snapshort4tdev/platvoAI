"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RiExternalLinkLine } from "@remixicon/react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";

const ModelsPricingSection = () => {
  const t = useTranslation();

  return (
    <section className="relative mt-20 mb-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side - AI Models Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl border-2 border-emerald-400/40 overflow-hidden shadow-2xl shadow-emerald-900/20">
              {/* Device Frame Effect */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-transparent blur-sm pointer-events-none" />
              
              {/* Models Image */}
              <div className="relative w-full h-auto">
                <Image
                  src="/llm-models.jpeg"
                  alt="AI Models"
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Pricing Info */}
          <div className="space-y-6 order-1 lg:order-2">
            <div>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {t("landing.modelsTitle")}{" "}
                <span className="text-emerald-600 dark:text-emerald-400">{t("landing.pricingNew")}</span>
              </h2>
              <p className="text-base lg:text-lg text-gray-700 dark:text-white/80 leading-relaxed">
                {t("landing.modelsDescription")}
              </p>
            </div>

            {/* Pricing Box */}
            <div className="bg-gray-100 dark:bg-black/60 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-6 lg:p-8 shadow-xl">
              <div className="space-y-3">
                <div className="text-lg lg:text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                  {t("landing.savePercent")}
                </div>
                <div className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">
                  {t("landing.pricingNew")}
                </div>
                <div className="text-sm lg:text-base text-gray-700 dark:text-gray-300">
                  {t("landing.pricingOld")}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              asChild
              className="w-full lg:w-auto rounded-full px-8 py-6 text-base lg:text-lg font-semibold
                bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/50
                transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/60"
            >
              <Link href="/auth/sign-in">
                {t("landing.getStartedNow")}
                <RiExternalLinkLine className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModelsPricingSection;
