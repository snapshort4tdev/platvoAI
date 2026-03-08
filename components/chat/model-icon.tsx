"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ModelIconProps {
  iconUrl?: string;
  className?: string;
  size?: number;
  alt?: string;
}

export const ModelIcon: React.FC<ModelIconProps> = ({
  iconUrl,
  className,
  size = 16,
  alt = "Model icon",
}) => {
  const [imageError, setImageError] = useState(false);

  if (!iconUrl || imageError) {
    // Fallback to a generic icon if no URL or image fails
    return (
      <Sparkles
        size={size}
        className={cn("text-muted-foreground", className)}
      />
    );
  }

  return (
    <img
      src={iconUrl}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-sm", className)}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};

