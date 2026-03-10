"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

function Navbar() {
  const { language, updateLanguage } = useLanguage();
  const t = useTranslation();

  return (
    <header>
      <nav
        className={cn(
          "mx-auto mt-px relative flex items-center justify-between gap-2 sm:gap-3",
          "rounded-full border bg-white/70 px-2 sm:px-4 py-1.5 sm:py-2 shadow-sm backdrop-blur-md",
          "dark:bg-black/30"
        )}
        aria-label="Primary"
      >
        <Logo url="/" />
        <ul className="hidden items-center gap-6 text-sm xl:text-base font-normal md:flex absolute left-1/2 transform -translate-x-1/2">
          <li>
            <Link
              href="/pricing"
              className="transition-colors hover:text-foreground"
            >
              {t("landing.pricing")}
            </Link>
          </li>
          <li>
            <Link
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              {t("landing.features")}
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
  );
}

export default Navbar;
