'use client';
import { useState, useRef, useEffect, type CSSProperties } from 'react';
import Image from 'next/image';
import partners from '@/lib/partners.json';
export function PartnerMarquee() {
  // Each group includes its trailing spacing, so -50% is an exact seamless loop.
  const group = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(160);
  useEffect(() => {
    if (!group.current) return;
    const measure = () => setDuration(group.current!.getBoundingClientRect().width / 35);
    const observer = new ResizeObserver(measure);
    observer.observe(group.current);
    measure();
    return () => observer.disconnect();
  }, []);
  const durations = { '--marquee-duration': `${duration}s` } as CSSProperties;
  return <div className="partner-marquee" style={durations}>
    <div className="partner-viewport">
      <div className="partner-track">
        {[0, 1].map(copy => <div className="partner-group" ref={copy === 0 ? group : undefined} key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {partners.map(p => <div className="partner-item" key={p.name}><Image src={p.image.replace('/partners/', '/partners/ribbon/')} width={180} height={48} alt={copy === 0 ? p.name : ''} loading="eager" draggable={false}/></div>)}
        </div>)}
      </div>
    </div>
  </div>;
}
