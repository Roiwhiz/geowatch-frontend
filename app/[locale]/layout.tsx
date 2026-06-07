import { NextIntlClientProvider, hasLocale } from "next-intl";
import { QueryProvider } from "@/providers/ReactQueryProvider";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import AppLayout from "@/components/AppLayout";
import { UserInitializer } from "@/components/UserInitializer";
type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>
        <UserInitializer />
        <AppLayout>{children}</AppLayout>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
