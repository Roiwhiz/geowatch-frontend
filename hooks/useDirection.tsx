"use client";

import { useParams } from "next/navigation";

export function useDirection() {
  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "en";
  const isRTL = locale === "ar";

  return {
    locale,
    isRTL,
    dir: isRTL ? ("rtl" as const) : ("ltr" as const),
  };
}
