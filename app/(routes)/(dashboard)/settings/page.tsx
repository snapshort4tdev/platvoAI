"use client";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "../_common/header";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "@/lib/i18n";
import { RiPaletteFill, RiTranslate2 } from "@remixicon/react";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { language, updateLanguage } = useLanguage();
  const t = useTranslation();

  return (
    <>
      <Header title={t("settings.settings")} />
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
        <div className="w-full space-y-6 pt-20 pb-8">
          {/* Appearance Settings Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <RiPaletteFill className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {t("settings.appearance")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("settings.chooseTheme")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
          <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground">
                    {t("settings.theme")}
                  </label>
            </div>
            <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                        {t("settings.light")}
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-gray-800"></span>
                        {t("settings.dark")}
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-gray-800"></span>
                        {t("settings.system")}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <RiTranslate2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {t("settings.language")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("settings.chooseLanguage")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground">
                    {t("settings.language")}
                  </label>
                </div>
                <Select value={language} onValueChange={updateLanguage}>
                  <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🇬🇧</span>
                        {t("settings.english")}
                      </div>
                    </SelectItem>
                    <SelectItem value="ar">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🇸🇦</span>
                        {t("settings.arabic")}
                      </div>
                    </SelectItem>
              </SelectContent>
            </Select>
          </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Settings;
