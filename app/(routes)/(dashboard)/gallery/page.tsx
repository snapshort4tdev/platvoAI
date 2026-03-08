"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Download, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import Header from "../_common/header";

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  aspectRatio: string;
  createdAt: string;
}

const GalleryPage = () => {
  const t = useTranslation();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const { data, isLoading, error } = useQuery<{
    success: boolean;
    images: GeneratedImage[];
    error?: string;
    details?: string;
  }>({
    queryKey: ["gallery"],
    queryFn: async () => {
      const response = await fetch("/api/gallery");
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.details || data.error || "Failed to fetch gallery images");
      }
      return data;
    },
  });

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Create a safe filename from the prompt
      const safePrompt = prompt
        .slice(0, 50)
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      a.download = `generated-image-${safePrompt}-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    // Check if it's a database/table error
    const isTableError = errorMessage.toLowerCase().includes("does not exist") || 
                         errorMessage.toLowerCase().includes("model") ||
                         errorMessage.toLowerCase().includes("prisma") ||
                         errorMessage.toLowerCase().includes("generatedimage");
    
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <p className="text-destructive text-lg font-semibold mb-2">{t("common.error")}</p>
          <p className="text-sm text-muted-foreground mb-4">
            {errorMessage}
          </p>
          {isTableError && (
            <div className="text-xs text-muted-foreground mt-4 p-4 bg-muted rounded-lg text-left">
              <p className="font-semibold mb-2">Database migration required:</p>
              <p className="mb-2">The database table may not exist yet. Please run:</p>
              <code className="block bg-background p-2 rounded mb-2">npx prisma migrate dev --name add_generated_images</code>
              <code className="block bg-background p-2 rounded">npx prisma generate</code>
            </div>
          )}
        </div>
      </div>
    );
  }

  const images = data?.images || [];

  return (
    <>
      <Header title={t("gallery.title")} />
      <div className="h-full overflow-y-auto p-4 sm:p-6 pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto">
          <div className={cn("mb-6", isArabic && "text-right")}>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t("gallery.title")}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {images.length === 0
                ? t("gallery.noImages")
                : t("gallery.subtitle")
                    .replace("{count}", images.length.toString())
                    .replace("{plural}", images.length === 1 ? "" : "s")}
            </p>
          </div>

        {images.length === 0 ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <p className="text-lg text-muted-foreground mb-4">
                {t("gallery.emptyState")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("gallery.emptyStateDescription")}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative rounded-lg overflow-hidden border border-border bg-background hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video w-full bg-muted">
                  <Image
                    src={image.imageUrl}
                    alt={image.prompt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <p
                    className={cn(
                      "text-sm text-muted-foreground line-clamp-2 mb-3",
                      isArabic && "text-right"
                    )}
                    title={image.prompt}
                  >
                    {image.prompt}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => handleDownload(image.imageUrl, image.prompt)}
                  >
                    <Download className="h-4 w-4" />
                    <span>{t("common.download")}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default GalleryPage;
