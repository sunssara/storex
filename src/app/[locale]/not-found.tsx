'use client';
import { usePathname } from 'next/navigation';
import { copy, isLocale } from '@/lib/content';
import Link from 'next/link';
export default function NotFound() {
  const raw = usePathname().split('/')[1]; const locale = isLocale(raw) ? raw : 'ru';
  return <div className="container not-found"><div className="error-number">404</div><h1>{copy.notFound[locale]}</h1><p>{copy.notFoundText[locale]}</p><Link className="button primary" href={`/${locale}`}>{copy.backHome[locale]} ↗</Link></div>;
}
