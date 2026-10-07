'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (!preference.matches) animations.push(entry.target.animate(
          [{ opacity: 0.35, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 580, easing: 'cubic-bezier(.2,.7,.3,1)' },
        ));
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('main .section, main .partners, main .contact-section, main .catalog, main .case-content section, main .solution-content').forEach(element => {
      if (element.getBoundingClientRect().top >= innerHeight) observer.observe(element);
    });
    const stop = () => { if (preference.matches) animations.forEach(animation => animation.cancel()); };
    preference.addEventListener('change', stop);
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); preference.removeEventListener('change', stop); };
  }, [pathname]);
  return null;
}
