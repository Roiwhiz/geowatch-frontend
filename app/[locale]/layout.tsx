import { NextIntlClientProvider, hasLocale } from "next-intl";
import { QueryProvider } from "@/providers/ReactQueryProvider";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import AppLayout from "@/components/AppLayout";
type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages({ locale });
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>
        <AppLayout>{children}</AppLayout>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
