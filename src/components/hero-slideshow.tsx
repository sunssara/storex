'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';
import { copy, type Locale } from '@/lib/content';
import { heroSlides, heroControls } from '@/lib/hero-slides';
import { Architecture } from './architecture';
import { HeroVisual } from './hero-visual';
export function HeroSlideshow({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches); sync(); media.addEventListener('change', sync);
    const page = () => setVisible(!document.hidden); document.addEventListener('visibilitychange', page);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden));
    if (root.current) observer.observe(root.current);
    return () => { media.removeEventListener('change', sync); document.removeEventListener('visibilitychange', page); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if (paused || reduced || !visible) return;
    const timer = setTimeout(() => setActive(i => (i + 1) % heroSlides.length), 6000);
    return () => clearTimeout(timer);
  }, [active, paused, reduced, visible]);
  return <section ref={root} className="hero container hero-slideshow" aria-roledescription="carousel" aria-label={heroControls.region[locale]}>
    <div className="hero-stage" onFocusCapture={() => setPaused(true)}>
      {heroSlides.map((slide, i) => {
        const Heading = i === 0 ? 'h1' : 'h2';
        return <div key={slide.id} className={`hero-main hero-slide ${active === i ? 'is-active' : ''}`} inert={active !== i} aria-hidden={active !== i} role="group" aria-roledescription={heroControls.slide[locale]} aria-label={`${i + 1} / ${heroSlides.length}`}>
          <div className="hero-copy"><div className="eyebrow"><span/>{slide.label[locale]}</div><Heading className="hero-title">{slide.title[locale].map((line,j)=><span key={line} className={j===2?'accent':''}>{line}</span>)}</Heading><p className="hero-description">{slide.text[locale]}</p><div className="hero-buttons"><Link className="button primary" href={`/${locale}/contacts`}>{copy.discuss[locale]}<ArrowUpRight size={18}/></Link><Link className="button secondary" href={`/${locale}/projects`}>{copy.ourProjects[locale]}<ArrowUpRight size={18}/></Link></div></div>
          {slide.id === 'infrastructure' ? <Architecture locale={locale}/> : <HeroVisual kind={slide.id} locale={locale}/>}
        </div>;
      })}
    </div>
    <div className="hero-bottom"><span>{copy.lifecycle[locale]}</span><div className="hero-controls">{heroSlides.map((slide,i)=><button key={slide.id} type="button" className="slide-dot" aria-label={`${heroControls.slide[locale]} ${i+1}: ${slide.label[locale]}`} aria-pressed={active===i} onClick={()=>{setActive(i);setPaused(true);}}><span/></button>)}{!reduced&&<button type="button" className="slide-play" aria-label={(paused?heroControls.play:heroControls.pause)[locale]} onClick={()=>setPaused(p=>!p)}>{paused?<Play size={14}/>:<Pause size={14}/>}</button>}</div><a href="#expertise">{copy.scroll[locale]}<ArrowDown size={14}/></a></div>
  </section>;
}
