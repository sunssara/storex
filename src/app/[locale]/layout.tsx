import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/sections';
import { copy, isLocale, locales, siteUrl } from '@/lib/content';
import '../globals.css';
import '@fontsource-variable/manrope';

export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export const dynamicParams = false;
export const metadata: Metadata = { metadataBase: new URL(siteUrl), title: { default: 'STOREX', template: '%s | STOREX' }, icons: { icon: '/icon.svg' } };
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale}><body id="top"><a className="skip-link" href="#main">{copy.skip[locale]}</a><Header locale={locale}/><main id="main">{children}</main><Footer locale={locale}/></body></html>;
}
