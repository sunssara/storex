import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { awards, copy, isLocale, locales, services, projects, siteUrl, type Locale } from '@/lib/content';
import { Expertise, Values, Breadcrumbs, Button, ContactSection, Eyebrow, Hero, PageIntro, Partners, Process, ProjectsSection, ServiceCards, ServiceIcon, ServicesSection, Stats } from '@/components/sections';
import { ProjectCard } from '@/components/project-card';
import { ProjectGrid } from '@/components/project-grid';
type Params = { locale: string; path?: string[] };
const paths = ['', 'solutions', 'projects', 'about', 'contacts', 'privacy', ...services.map(s => `solutions/${s.slug}`), ...projects.map(p => `projects/${p.slug}`)];
export function generateStaticParams() { return paths.map(p => ({ path: p ? p.split('/') : [] })); }
export const dynamicParams = false;
function resolveTitle(locale: Locale, path: string) {
  if (!path) return copy.heroTitle[locale].join(' ');
  const service = services.find(s => path === `solutions/${s.slug}`);
  const project = projects.find(p => path === `projects/${p.slug}`);
  if (service) return service.title[locale];
  if (project) return `${project.title[locale]} — ${project.client[locale]}`;
  if (path === 'privacy') return copy.privacy[locale];
  return copy.nav[locale][['solutions', 'projects', 'about', 'contacts'].indexOf(path)] || copy.notFound[locale];
}
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: raw, path = [] } = await params;
  const locale = isLocale(raw) ? raw : 'ru';
  const slug = path.join('/');
  const title = resolveTitle(locale, slug);
  const description = services.find(s => slug === `solutions/${s.slug}`)?.description[locale] || projects.find(p => slug === `projects/${p.slug}`)?.task[locale] || (slug === 'projects' ? copy.projectsIntro[locale] : slug === 'contacts' ? copy.contactText[locale] : copy.heroText[locale]);
  const url = `/${locale}${slug ? `/${slug}` : ''}`;
  return { title, description, alternates: { canonical: url, languages: Object.fromEntries(locales.map(l => [l, `/${l}${slug ? `/${slug}` : ''}`])) }, openGraph: { title: `${title} | STOREX`, description, url, type: 'website', siteName: 'STOREX', locale: { ru: 'ru_KZ', kk: 'kk_KZ', en: 'en_US' }[locale], images: [{ url: '/images/ktz-1.webp', width: 1201, height: 763, alt: 'STOREX' }] }, robots: paths.includes(slug) ? undefined : { index: false, follow: true } };
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale: raw, path = [] } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const route = path.join('/');
  if (!paths.includes(route)) notFound();
  if (!route) return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'STOREX', url: siteUrl, email: 'info@storex.kz', telephone: '+77172972086', address: { '@type': 'PostalAddress', addressLocality: 'Astana', streetAddress: '12 Bigeldinov Street, office 506', addressCountry: 'KZ' } }).replace(/</g, '\\u003c') }}/><Hero locale={locale}/><Stats locale={locale}/><ServicesSection locale={locale}/><Expertise locale={locale}/><ProjectsSection locale={locale}/><Process locale={locale}/><Partners locale={locale}/><ContactSection locale={locale}/></>;
  if (route === 'solutions') return <><PageIntro locale={locale} pageName={copy.nav[locale][0]} title={copy.solutionsTitle[locale]} label={copy.solutionsLabel[locale]} description={copy.solutionsIntro[locale]}/><section className="container catalog"><ServiceCards locale={locale}/></section><Expertise locale={locale}/><Process locale={locale}/><ContactSection locale={locale}/></>;
  if (route === 'projects') return <><PageIntro locale={locale} pageName={copy.nav[locale][1]} title={copy.projectsTitle[locale]} label={copy.projectsLabel[locale]} description={copy.projectsIntro[locale]}/><section className="container catalog"><ProjectGrid locale={locale}/></section><ContactSection locale={locale}/></>;
  if (route === 'contacts') return <><PageIntro locale={locale} pageName={copy.nav[locale][3]} title={copy.discuss[locale]} label="STOREX / CONTACT" description={copy.contactText[locale]}/><ContactSection locale={locale}/></>;
  if (route === 'privacy') return <><PageIntro locale={locale} pageName={copy.privacy[locale]} title={copy.privacy[locale]} label="STOREX"/><div className="container"><div className="privacy-body">{copy.privacyText[locale].map(p => <p key={p}>{p}</p>)}<a className="text-link" href="mailto:info@storex.kz">info@storex.kz ↗</a></div></div></>;
  if (route === 'about') return <><PageIntro locale={locale} pageName={copy.nav[locale][2]} title={copy.aboutTitle[locale]} label={copy.aboutLabel[locale]}/><section className="container about-statement"><h2>{copy.footerLine[locale]}</h2><p>{copy.aboutText[locale]}</p></section><Stats locale={locale}/><Values locale={locale}/><section className="section container industries"><h2>{copy.industriesTitle[locale]}</h2><div>{copy.industries[locale].map((s, i) => <div className="industry-row" key={s}><span>0{i+1}</span><div><h3>{s}</h3><p>{copy.industryText[locale][i]}</p></div></div>)}</div></section><Process locale={locale}/><section className="section container"><Eyebrow>STOREX / RECOGNITION</Eyebrow><h2>{copy.awards[locale]}</h2><div className="awards-grid">{awards.map(a => <div className="award" key={a.name+a.year}><span>{a.year} ↗</span><h3>{a.brand}</h3><p>{a.name}</p></div>)}</div><p className="source-note">{copy.statsSource[locale]}</p></section><Partners locale={locale}/><ContactSection locale={locale}/></>;
  const service = services.find(s => route === `solutions/${s.slug}`);
  if (service) return <><section className="container detail-intro"><Breadcrumbs locale={locale} items={[{label:copy.nav[locale][0],href:`/${locale}/solutions`},{label:service.title[locale]}]}/><div className="solution-top"><div><Eyebrow>{copy.solutionsLabel[locale]}</Eyebrow><h1>{service.title[locale]}</h1></div><div className="solution-illustration"><ServiceIcon kind={service.icon} size={70}/></div></div><p>{service.description[locale]}</p><div className="solution-content"><div><h2>{copy.benefits[locale]}</h2><p>{service.need[locale]}</p><div style={{marginTop:28}}><Button href={`/${locale}/contacts`}>{copy.discuss[locale]}</Button></div></div><div><h2>{copy.included[locale]}</h2><ol className="deliverables">{service.items[locale].map((item,i)=><li key={item}><span>0{i+1}</span>{item}</li>)}</ol></div></div></section>{service.projects.length>0&&<section className="container related-section"><h2>{copy.related[locale]}</h2><div className="project-grid">{projects.filter(p=>service.projects.includes(p.slug)).map(p=><ProjectCard project={p} locale={locale} key={p.slug}/>)}</div></section>}<ContactSection locale={locale}/></>;
  const project = projects.find(p => route === `projects/${p.slug}`);
  if (project) return <><article className="container detail-intro"><Breadcrumbs locale={locale} items={[{label:copy.nav[locale][1],href:`/${locale}/projects`},{label:project.client[locale]}]}/><Eyebrow>{project.client[locale]}</Eyebrow><h1>{project.title[locale]}</h1><p>{project.location[locale]}</p><div className="detail-hero"><Image src={`/images/${project.images[0]}`} fill priority sizes="(max-width: 700px) 100vw, 90vw" alt={`${project.client[locale]} — ${project.location[locale]}`}/><span className="detail-metric">{project.metric[locale]}</span></div><div className="case-body"><aside className="case-sidebar"><p>{copy.equipment[locale]}</p><div className="equipment-tags">{project.equipment.map(x=><span key={x}>{x}</span>)}</div></aside><div className="case-content">{(['task','solution','result'] as const).map(key=><section key={key}><h2>{copy[key][locale]}</h2><p>{project[key][locale]}</p></section>)}{project.deployments&&<section><h2>{copy.ourProjects[locale]}</h2><ul className="deployment-list">{project.deployments[locale].map(name=><li key={name}>{name}</li>)}</ul></section>}{project.images.slice(1).map(img=><Image key={img} src={`/images/${img}`} width={1100} height={700} className="case-extra-image" sizes="(max-width: 700px) 100vw, 65vw" alt={project.location[locale]}/>)}</div></div></article><section className="container related-section"><h2>{copy.related[locale]}</h2><div className="project-grid">{projects.filter(p=>p.slug!==project.slug).slice(0,2).map(p=><ProjectCard project={p} locale={locale} key={p.slug}/>)}</div></section><ContactSection locale={locale}/></>;
  return <Link href={`/${locale}`}>{copy.backHome[locale]}</Link>;
}
