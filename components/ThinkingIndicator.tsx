"use client";

import { useTranslations } from "next-intl";

export function ThinkingIndicator() {
  const t = useTranslations("chat");

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
      <div className="flex gap-1">
        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
      </div>
      <span>{t("thinking") || "Thinking"}...</span>
    </div>
  );
}
