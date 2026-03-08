"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 12,
  color = "hsl(var(--primary))",
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, value));
  const remainingPercentage = 100 - percentage;
  const dashOffset = circumference * (1 - remainingPercentage / 100);

  const isCSSVariable = color.includes("var(");
  
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className={cn("transform -rotate-90", isCSSVariable && "text-primary")}
        style={isCSSVariable ? undefined : { color }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity={0.1}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className={cn("text-2xl font-bold", isCSSVariable && "text-primary")}
          style={isCSSVariable ? undefined : { color }}
        >
          {Math.round(remainingPercentage)}%
        </span>
        <span className="text-xs text-muted-foreground mt-1">
          {/* This will be translated in the parent component */}
        </span>
      </div>
    </div>
  );
}
