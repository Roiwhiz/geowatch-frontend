"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

const locales = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const currentLocale =
    typeof params.locale === "string" ? params.locale : "en";

  const switchLocale = (nextLocale: string) => {
    startTransition(() => {
      // Replace first segment of URL
      const segments = pathname.split("/");
      segments[1] = nextLocale;

      const newPath = segments.join("/");
      router.push(newPath);
    });
  };

  return (
    <select
      value={currentLocale}
      onChange={(e) => switchLocale(e.target.value)}
      className="border rounded px-2 py-1 bg-background"
      disabled={isPending}
    >
      {locales.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
