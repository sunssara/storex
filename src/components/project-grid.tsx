'use client';
import { useState } from 'react';
import { copy, projects, type Locale } from '@/lib/content';
import { ProjectCard } from './project-card';
export function ProjectGrid({ locale }: { locale: Locale }) {
  const [category, setCategory] = useState(-1);
  const filtered = projects.filter(p => category === -1 || p.category === category);
  return <><div className="filters" aria-label={copy.nav[locale][1]}>{[copy.all[locale], ...copy.categories[locale]].map((label, i) => <button key={label} onClick={() => setCategory(i - 1)} aria-pressed={category === i - 1}>{label}<span>{String(i === 0 ? projects.length : projects.filter(p => p.category === i - 1).length).padStart(2, '0')}</span></button>)}</div><div className="project-grid" aria-live="polite">{filtered.map(p => <ProjectCard key={p.slug} project={p} locale={locale} />)}</div></>;
}
