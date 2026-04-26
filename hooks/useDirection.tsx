"use client";

import { useLocale } from "next-intl";

export function useDirection() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return {
    locale,
    isRTL,
    dir: isRTL ? ("rtl" as const) : ("ltr" as const),
  };
}
