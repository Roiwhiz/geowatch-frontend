"use client";

import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/useDirection";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface EmptyStateProps {
  type: "noSession" | "newSession" | "notFound";
}

function EmptyState({ type }: EmptyStateProps) {
  const u = useTranslations("nav");
  const t = useTranslations("empty");
  const router = useRouter();
  const { locale } = useDirection();

  if (type === "notFound") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            {t("notFound")}
          </h2>
          <p className="text-muted-foreground max-w-md">
            {t("notFoundDescription")}
          </p>
          <Button variant="outline" onClick={() => router.push(`/${locale}`)}>
            {t("homepage")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold text-foreground">{u("title")}</h1>
        <p className="text-muted-foreground max-w-md">
          {type === "noSession" ? t("newConversation") : t("noConversations")}
        </p>
      </div>
    </div>
  );
}

export default EmptyState;
