"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo, useMemo } from "react";
import { Streamdown } from "streamdown";
import { getTextDirection } from "@/lib/utils/language-detection";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, children, ...props }: ResponseProps) => {
    // Extract text from children to detect language
    const textContent = useMemo(() => {
      if (typeof children === "string") {
        return children;
      }
      if (Array.isArray(children)) {
        return (children as unknown[])
          .map((child) => {
            if (typeof child === "string") return child;
            if (typeof child === "object" && child !== null && "props" in child) {
              return (child as { props?: { children?: string } }).props?.children || "";
            }
            return "";
          })
          .join(" ");
      }
      if (typeof children === "object" && children !== null && "props" in children) {
        return (children as { props?: { children?: string } }).props?.children || "";
      }
      return "";
    }, [children]);

    const textDirection = getTextDirection(textContent);

    return (
      <div dir={textDirection}>
        <Streamdown
          className={cn(
            "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
            textDirection === "rtl" ? "text-right" : "text-left",
            className
          )}
          {...props}
        >
          {children}
        </Streamdown>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
