'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { copy, services, type Locale } from '@/lib/content';

export function SolutionsMenu({ locale, pathname, mobile = false }: { locale: Locale; pathname: string; mobile?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = `solutions-menu-${mobile ? 'mobile' : 'desktop'}`;

  useEffect(() => {
    if (!expanded) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setExpanded(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [expanded]);

  return <div ref={root} className={`solutions-menu${mobile ? ' solutions-menu-mobile' : ''}`} data-open={expanded}
    onPointerEnter={event => { if (!mobile && event.pointerType === 'mouse') setExpanded(true); }}
    onPointerLeave={event => { if (!mobile && event.pointerType === 'mouse' && !root.current?.contains(document.activeElement)) setExpanded(false); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false); }}
    onKeyDown={event => {
      if (event.key === 'Escape' && expanded) { event.preventDefault(); event.stopPropagation(); setExpanded(false); trigger.current?.focus(); }
      if (event.key === 'ArrowDown' && !panel.current?.contains(event.target as Node)) {
        event.preventDefault(); setExpanded(true);
        requestAnimationFrame(() => panel.current?.querySelector('a')?.focus());
      }
    }}>
    <div className="solutions-menu-trigger">
      <Link href={`/${locale}/solutions`} aria-current={pathname.includes('/solutions') ? 'page' : undefined}>{copy.nav[locale][0]}</Link>
      <button ref={trigger} type="button" aria-label={copy.nav[locale][0]} aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(value => !value)}><ChevronDown size={13}/></button>
    </div>
    <div ref={panel} id={id} className="solutions-dropdown" inert={!expanded} aria-hidden={!expanded}>
      <ul>{services.map(service => <li key={service.slug}><Link href={`/${locale}/solutions/${service.slug}`} aria-current={pathname.replace(/\/$/, '') === `/${locale}/solutions/${service.slug}` ? 'page' : undefined} onClick={() => setExpanded(false)}>{service.title[locale]}</Link></li>)}</ul>
    </div>
  </div>;
}
