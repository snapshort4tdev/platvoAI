"use client";

import React from "react";
import { RiArrowDownLine } from "@remixicon/react";
import { useTranslation } from "@/lib/i18n";

const ProblemSection = () => {
  const t = useTranslation();

  const PROBLEMS = [
    t("landing.problem1"),
    t("landing.problem2"),
    t("landing.problem3"),
    t("landing.problem4"),
    t("landing.problem5"),
    t("landing.problem6"),
    t("landing.problem7"),
    t("landing.problem8"),
  ];

  return (
    <section className="relative mt-20 mb-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t("landing.problemTitle")}
          </h2>
          <p className="text-lg lg:text-xl text-gray-700 dark:text-white/80 leading-relaxed max-w-3xl mx-auto">
            {t("landing.problemDescription")}
          </p>
        </div>

        {/* Problems Box */}
        <div className="relative bg-gray-100 dark:bg-emerald-900/20 rounded-3xl border-2 border-emerald-500/30 p-8 lg:p-12 shadow-2xl mb-8">
          <div className="space-y-4">
            {PROBLEMS.map((problem, index) => (
              <div
                key={index}
                className="text-base lg:text-lg text-gray-900 dark:text-white"
              >
                {problem}
              </div>
            ))}
            <div className="pt-4 border-t border-emerald-500/30">
              <div className="text-base lg:text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                {t("landing.problem9")}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t("landing.betterWay")}
          </p>
          <RiArrowDownLine className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
