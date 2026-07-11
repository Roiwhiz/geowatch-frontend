import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/toaster";
import { ServerWakeUp } from "@/components/ServerWakeUp";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata = {
  metadataBase: new URL("https://geowatch-frontend.vercel.app/"),
  title: {
    default: "GeoWatch — Geopolitical Intelligence Workstation",
    template: "%s | GeoWatch",
  },
  description:
    "GeoWatch is an autonomous AI agent that produces structured geopolitical intelligence reports. Powered by real-time web search, conflict data, and international relations frameworks.",
  keywords: [
    "geopolitics",
    "intelligence",
    "international relations",
    "AI agent",
    "conflict analysis",
    "foreign policy",
  ],
  authors: [{ name: "Toheeb", url: "https://github.com/Roiwhiz" }],
  creator: "Toheeb",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://geowatch-frontend.vercel.app/",
    siteName: "GeoWatch",
    title: "GeoWatch — Geopolitical Intelligence Workstation",
    description:
      "An autonomous AI agent that produces structured geopolitical intelligence reports using real-time data, conflict databases, and IR frameworks.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GeoWatch — Geopolitical Intelligence Workstation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GeoWatch — Geopolitical Intelligence Workstation",
    description:
      "An autonomous AI agent that produces structured geopolitical intelligence reports using real-time data, conflict databases, and IR frameworks.",
    images: ["/og-image.png"],
    creator: "https://x.com/StackAndStat",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const locale = headersList.get("x-next-intl-locale") ?? "en";
  const isRTL = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={geist.className}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ServerWakeUp>{children}</ServerWakeUp>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
