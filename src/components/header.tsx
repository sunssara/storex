'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { copy, locales, type Locale } from '@/lib/content';

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    function escape(event: KeyboardEvent) { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } }
    if (open) document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open]);
  const links = ['solutions', 'projects', 'about', 'contacts'];
  return <header className="site-header">
    <div className="container header-inner">
      <Link href={`/${locale}`} className="logo" aria-label="Storex"><Image src="/images/storex-logo.png" width={164} height={23} alt="STOREX" priority /></Link>
      <nav className="desktop-nav" aria-label={copy.menu[locale]}>{links.map((url, i) => <Link key={url} href={`/${locale}/${url}`} aria-current={pathname.includes(`/${url}`) ? 'page' : undefined}>{copy.nav[locale][i]}</Link>)}</nav>
      <div className="header-actions">
        <nav className="languages" aria-label={{ru:'Язык',kk:'Тіл',en:'Language'}[locale]}>{locales.map(l => <Link key={l} href={pathname.replace(/^\/(ru|kk|en)(?=\/|$)/, `/${l}`)} lang={l} hrefLang={l} aria-current={l === locale ? 'true' : undefined}>{l === 'kk' ? 'ҚАЗ' : l.toUpperCase()}</Link>)}</nav>
        <Link href={`/${locale}/contacts`} className="header-cta">{copy.discuss[locale]} <ArrowUpRight size={15} /></Link>
        <button className="menu-toggle" ref={toggle} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? copy.close[locale] : copy.menu[locale]} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
    </div>
    <nav id="mobile-nav" className="mobile-nav" hidden={!open} aria-label={copy.menu[locale]}>{links.map((url, i) => <Link key={url} href={`/${locale}/${url}`}>{copy.nav[locale][i]}<ArrowUpRight size={18} /></Link>)}<a href="tel:+77172972086">+7 (7172) 97-20-86</a></nav>
  </header>;
}
