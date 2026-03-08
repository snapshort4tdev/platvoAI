"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const FAQSection = () => {
  const t = useTranslation();
  const { language } = useLanguage();
  const isArabic = language === "ar";

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

  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className={cn("w-full mt-16", isArabic && "rtl")}>
      <div className="w-full pl-3 mb-6">
        <h2 className="text-lg lg:text-xl font-medium">{t("billing.faq.title")}</h2>
      </div>

      <div className="rounded-lg border bg-card">
        {faqs.map((faq, index) => {
          const isOpen = openItems.has(index);
          return (
            <Collapsible
              key={index}
              open={isOpen}
              onOpenChange={() => toggleItem(index)}
            >
              <CollapsibleTrigger
                className={cn(
                  "w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors",
                  "border-b last:border-b-0",
                  index === 0 && "border-t-0",
                  isArabic && "flex-row-reverse"
                )}
              >
                <span className={cn("font-medium text-left", isArabic && "text-right")}>
                  {t(faq.question)}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-4 text-muted-foreground">
                <p className={cn("leading-relaxed pt-2", isArabic && "text-right")}>
                  {t(faq.answer)}
                </p>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

export default FAQSection;
