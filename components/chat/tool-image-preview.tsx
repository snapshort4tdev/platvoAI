"use client";

import React from "react";
import Image from "next/image";
import { Download, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useLanguage } from "@/hooks/use-language";

interface ImagePreviewProps {
  imageUrl: string;
  prompt?: string;
  isLoading?: boolean;
  error?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  prompt,
  isLoading = false,
  error,
}) => {
  const t = useTranslation();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  if (error) {
    return (
      <div className="w-full p-4 rounded-md bg-destructive/10 border border-destructive/20">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full p-4 rounded-md bg-background/50 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <LoaderIcon className="h-4 w-4 animate-spin" />
          <span className="font-light text-sm">
            {t("tools.generatingImage")}
          </span>
        </div>
        <div className="w-full h-1 bg-background/30 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-progressBar"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {prompt && (
        <div className={cn("text-sm text-muted-foreground", isArabic && "text-right")}>
          <span className="font-medium">{t("tools.prompt")}:</span> {prompt}
        </div>
      )}
      <div className="relative w-full rounded-lg overflow-hidden border border-border bg-background">
        <div className="relative aspect-video w-full">
          <Image
            src={imageUrl}
            alt={prompt || "Generated image"}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
        <div className={cn(
          "absolute top-2 right-2",
          isArabic && "left-2 right-auto"
        )}>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleDownload}
            className="gap-2 shadow-md"
          >
            <Download className="h-4 w-4" />
            <span>{t("common.download")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
