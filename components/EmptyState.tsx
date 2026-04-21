"use client";

import { useTranslations } from "next-intl";

interface EmptyStateProps {
  type: "noSession" | "newSession";
}

function EmptyState({ type }: EmptyStateProps) {
  const u = useTranslations("nav");
  const t = useTranslations("empty");

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold text-foreground">{u("title")}</h1>
        <p className="text-muted-foreground max-w-md">
          {type === "noSession"
            ? "Select a conversation from the sidebar or create a new one."
            : t("noConversations")}
        </p>
      </div>
    </div>
  );
}

export default EmptyState;
