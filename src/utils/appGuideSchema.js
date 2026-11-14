import { APP_GUIDES_BASE, getAppGuideDescription, getAppGuideTitle } from '../data/appInstallationGuides.js';

export function appGuideSchemas(guide, siteUrl) {
  const base = siteUrl.replace(/\/$/, '');
  const path = guide ? `${APP_GUIDES_BASE}/${guide.slug}/` : `${APP_GUIDES_BASE}/`;
  const url = `${base}${path}`;
  const crumbs = [
    { name: 'Ana Sayfa', url: `${base}/` },
    { name: 'Kurulum', url: `${base}/kurulum/` },
    { name: 'Uygulama Rehberleri', url: `${base}${APP_GUIDES_BASE}/` },
    ...(guide ? [{ name: guide.name, url }] : []),
  ];
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })) };
  if (!guide) return [breadcrumb, { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'IPTV Uygulama Kurulum Rehberleri', url }];
  return [breadcrumb,
    { '@context': 'https://schema.org', '@type': 'Article', headline: getAppGuideTitle(guide), description: getAppGuideDescription(guide), mainEntityOfPage: url, author: { '@type': 'Organization', name: 'QruzeTV' }, publisher: { '@type': 'Organization', name: 'QruzeTV' }, inLanguage: 'tr' },
    { '@context': 'https://schema.org', '@type': 'HowTo', name: `${guide.name} nasıl kurulur?`, description: guide.intro, step: guide.steps.map(([name, text], index) => ({ '@type': 'HowToStep', position: index + 1, name, text })) },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: guide.faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) },
  ];
}
