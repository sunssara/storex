import type { MetadataRoute } from 'next';
import { locales, projects, services, siteUrl } from '@/lib/content';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/solutions', '/projects', '/about', '/contacts', '/privacy', ...services.map(s=>`/solutions/${s.slug}`), ...projects.map(p=>`/projects/${p.slug}`)];
  return paths.flatMap(path=>locales.map(locale=>({url:`${siteUrl}/${locale}${path}`,alternates:{languages:Object.fromEntries(locales.map(l=>[l,`${siteUrl}/${l}${path}`]))}})));
}
