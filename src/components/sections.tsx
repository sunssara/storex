import partners from '@/lib/partners.json';
import { tildaCopy } from '@/lib/tilda-content';
import Link from 'next/link';
import Image from 'next/image';
import { BrandLogo } from './brand-logo';
import { ArrowDown, ArrowUpRight, AudioLines, Cloud, Headset, ScanLine, Server, ShieldCheck, Plus } from 'lucide-react';
import { copy, services, projects, type Locale, type Service } from '@/lib/content';
import { Architecture } from './architecture';
import { ContactForm } from './contact-form';
import { ProjectCard } from './project-card';
const icons = { audit: ScanLine, server: Server, shield: ShieldCheck, cloud: Cloud, av: AudioLines, support: Headset };
export function ServiceIcon({ kind, size = 28 }: { kind: Service['icon']; size?: number }) { const Icon = icons[kind]; return <Icon size={size} strokeWidth={1.4} />; }
export function Eyebrow({ children }: { children: React.ReactNode }) { return <div className="eyebrow"><span />{children}</div>; }
export function Button({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) { return <Link href={href} className={`button ${secondary ? 'secondary' : 'primary'}`}>{children}<ArrowUpRight size={18} /></Link>; }
export function Hero({ locale }: { locale: Locale }) {
  return <section className="hero container"><div className="hero-main"><div className="hero-copy"><Eyebrow>{copy.heroLabel[locale]}</Eyebrow><h1>{copy.heroTitle[locale].map((line, i) => <span key={line} className={i === 2 ? 'accent' : ''}>{line}</span>)}</h1><p className="hero-description">{copy.heroText[locale]}</p><div className="hero-buttons"><Button href={`/${locale}/contacts`}>{copy.discuss[locale]}</Button><Button href={`/${locale}/projects`} secondary>{copy.ourProjects[locale]}</Button></div></div><Architecture locale={locale} /></div><div className="hero-bottom"><span>{copy.lifecycle[locale]}</span><a href="#expertise">{copy.scroll[locale]}<ArrowDown size={14} /></a></div></section>;
}
export function Stats({ locale }: { locale: Locale }) {
  return <div className="stats-wrap container"><div className="stats">{[copy.since[locale], '20+', '50+', '24/7'].map((n, i) => <div key={i}><strong className={i === 0 ? 'since' : ''}>{n}</strong><span>{copy.stats[locale][i]}</span><Plus size={12} aria-hidden="true" /></div>)}</div></div>;
}
export function ServiceCards({ locale }: { locale: Locale }) {
  return <div className="services-grid">{services.map((s, i) => <Link className={`service-card ${i === 4 ? 'featured-service' : ''}`} key={s.slug} href={`/${locale}/solutions/${s.slug}`}><div className="service-top"><ServiceIcon kind={s.icon}/><span>0{i + 1}</span></div><h3>{s.title[locale]}</h3><p>{s.description[locale]}</p><span className="service-bottom">{copy.detail[locale]}<ArrowUpRight size={20}/></span></Link>)}</div>;
}
export function ServicesSection({ locale }: { locale: Locale }) {
  return <section className="section container" id="expertise"><Eyebrow>{copy.solutionsLabel[locale]}</Eyebrow><div className="section-heading"><h2>{copy.solutionsTitle[locale]}</h2><p>{copy.solutionsIntro[locale]}</p></div><ServiceCards locale={locale} /></section>;
}
export function ProjectsSection({ locale }: { locale: Locale }) {
  return <section className="section projects-section"><div className="container"><Eyebrow>{copy.projectsLabel[locale]}</Eyebrow><div className="section-heading"><h2>{copy.projectsTitle[locale]}</h2><Link className="text-link" href={`/${locale}/projects`}>{copy.allProjects[locale]}<ArrowUpRight size={19}/></Link></div><div className="project-grid">{projects.slice(0, 2).map(p => <ProjectCard project={p} locale={locale} key={p.slug}/>)}</div></div></section>;
}
export function Process({ locale }: { locale: Locale }) {
  return <section className="section container"><Eyebrow>{copy.processLabel[locale]}</Eyebrow><h2>{copy.processTitle[locale]}</h2><div className="process-grid">{copy.process[locale].map((s, i) => <div className="process-step" key={s}><div className="step-number">0{i+1}<span /><ArrowUpRight size={17} /></div><h3>{s}</h3><p>{copy.processText[locale][i]}</p></div>)}</div></section>;
}
export function Partners({ locale }: { locale: Locale }) { return <section className="partners container" id="partners"><Eyebrow>{copy.partnersLabel[locale]}</Eyebrow><h2>{tildaCopy.partnersTitle[locale]}</h2><div className="partner-grid">{partners.map(p=><div className="partner-logo" key={p.name}><Image src={p.image} width={200} height={80} alt={p.name}/></div>)}</div></section>; }
export function Expertise({ locale }: { locale: Locale }) { return <section className="section container expertise"><Eyebrow>SOFTWARE. HARDWARE. SERVICES.</Eyebrow><div className="section-heading"><h2>{tildaCopy.title[locale]}</h2><p>{tildaCopy.intro[locale]}</p></div><div className="expertise-grid">{tildaCopy.services[locale].map((item,i)=><article key={item.title}><span className="step-number">0{i+1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div><div className="space-types">{tildaCopy.spaces[locale].map(x=><span key={x}>{x}</span>)}</div></section>; }
export function Values({ locale }: { locale: Locale }) { return <section className="section container"><Eyebrow>{tildaCopy.valuesLabel[locale]}</Eyebrow><div className="values-grid">{tildaCopy.values[locale].map(v=><article key={v.title}><h3>{v.title}</h3><p>{v.text}</p></article>)}</div></section>; }
export function ContactSection({ locale }: { locale: Locale }) {
  return <section className="contact-section" id="contact"><div className="container contact-layout"><div><Eyebrow>{copy.contactLabel[locale]}</Eyebrow><h2>{copy.contactTitle[locale]}</h2><p className="contact-intro">{copy.contactText[locale]}</p><a className="big-email" href="mailto:info@storex.kz">info@storex.kz<ArrowUpRight size={23}/></a><a className="contact-phone" href="tel:+77172972086">+7 (7172) 97-20-86</a><p className="contact-address">{copy.country[locale]}<br/>{copy.address[locale]}</p><div className="support-contact"><h3>{tildaCopy.supportTitle[locale]}</h3><p>{tildaCopy.supportText[locale]}</p><a href="mailto:sd@storex.kz">sd@storex.kz ↗</a></div></div><ContactForm locale={locale}/></div></section>;
}
export function Footer({ locale }: { locale: Locale }) { return <footer className="container"><div className="footer-top"><Link href={`/${locale}`} aria-label="Storex"><BrandLogo/></Link><span>{copy.footerLine[locale]}</span><a href="#top" aria-label={copy.home[locale]}><ArrowUpRight size={22}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} STOREX. {copy.rights[locale]}</span><Link href={`/${locale}/privacy`}>{copy.privacy[locale]}</Link><span>{copy.country[locale]} / ASTANA</span></div></footer>; }
export function Breadcrumbs({ locale, items }: { locale: Locale; items: { label: string; href?: string }[] }) { return <nav className="breadcrumbs" aria-label={copy.home[locale]}><Link href={`/${locale}`}>{copy.home[locale]}</Link>{items.map((item, i) => <span key={i}><span aria-hidden="true">/</span>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>; }
export function PageIntro({ locale, title, label, description, pageName }: { locale: Locale; title: string; label: string; description?: string; pageName: string }) { return <div className="container page-intro"><Breadcrumbs locale={locale} items={[{label: pageName}]}/><Eyebrow>{label}</Eyebrow><h1>{title}</h1>{description && <p>{description}</p>}</div>; }
