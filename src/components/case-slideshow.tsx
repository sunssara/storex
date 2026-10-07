'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Locale } from '@/lib/content';

const labels = {
  ru: { gallery: 'Фотографии проекта', previous: 'Предыдущая фотография', next: 'Следующая фотография', photo: 'Фотография' },
  kk: { gallery: 'Жоба фотосуреттері', previous: 'Алдыңғы фотосурет', next: 'Келесі фотосурет', photo: 'Фотосурет' },
  en: { gallery: 'Project photographs', previous: 'Previous photograph', next: 'Next photograph', photo: 'Photograph' },
};

export function CaseSlideshow({ images, alt, locale }: { images: string[]; alt: string; locale: Locale }) {
  const [active, setActive] = useState(0);
  const text = labels[locale];
  const change = (direction: number) => setActive(value => (value + direction + images.length) % images.length);
  return <section className="case-slideshow" aria-label={text.gallery} onKeyDown={event => {
    if (images.length < 2) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); change(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }}>
    <div className="case-slideshow-frame">
      {images.map((image, index) => <div className="case-slide" data-active={index === active} aria-hidden={index !== active} key={image}>
        <Image src={`/images/${image}`} fill priority={index === 0} sizes="(min-width: 1392px) 1280px, (max-width: 600px) calc(100vw - 40px), 90vw" alt={`${alt} — ${text.photo.toLowerCase()} ${index + 1}`}/>
      </div>)}
    </div>
    {images.length > 1 && <div className="case-slideshow-controls">
      <button type="button" onClick={() => change(-1)} aria-label={text.previous}><ChevronLeft size={20}/></button>
      <div className="case-slide-dots">{images.map((image, index) => <button key={image} type="button" aria-label={`${text.photo} ${index + 1}`} aria-pressed={index === active} onClick={() => setActive(index)}><span/></button>)}</div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{text.photo} {active + 1} / {images.length}</span>
      <button type="button" onClick={() => change(1)} aria-label={text.next}><ChevronRight size={20}/></button>
    </div>}
  </section>;
}
