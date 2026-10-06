import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { type Locale, type Project, copy } from '@/lib/content';
export function ProjectCard({ project: p, locale }: { project: Project; locale: Locale }) {
  return <Link className="project-card" href={`/${locale}/projects/${p.slug}`}>
    <div className="project-photo"><Image src={`/images/${p.images[0]}`} fill sizes="(max-width: 700px) 100vw, 50vw" alt={`${p.client[locale]} — ${p.location[locale]}`} /><span className="photo-category">{copy.categories[locale][p.category]}</span><span className="project-arrow"><ArrowUpRight size={23}/></span></div>
    <div className="project-meta"><span>{p.client[locale]}</span><span>↗</span></div><h3>{p.title[locale]}</h3><p>{p.metric[locale]}</p>
  </Link>;
}
