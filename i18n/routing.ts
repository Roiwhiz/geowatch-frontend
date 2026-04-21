import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ar", "es", "fr", "de", "zh"],
  // Used when no locale matches
  defaultLocale: "en",
  // Determines when to prefix the locale in the URL. "always" is recommended for SEO and best user experience
  localePrefix: "always",
});
