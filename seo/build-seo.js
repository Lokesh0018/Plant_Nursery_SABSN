/*
 * Build-time SEO for the static pages (used by vite.config.js). For every route in src/data/routes.js it builds
 * the <head> block (title, description, canonical, robots, Open Graph, Twitter) and the JSON-LD, and for the
 * location pages a plain-HTML copy of the page's key content that the app replaces once it starts. It also
 * builds sitemap.xml. Everything comes from the data files, and nothing missing from them is invented: fields
 * the owner has not supplied (branch phone, hours, Kadiyam coordinates) are simply left out.
 */
import { ROUTES, DEFAULT_OG_IMAGE } from '../src/data/routes.js';
import { LOCATION_BY_KEY, formatAddress, mapsSearchUrl } from '../src/data/locations.js';
import { LOCATION_CONTENT } from '../src/data/locationContent.js';
import { FAQS } from '../src/data/faqs.js';
import { SITE_URL, BUSINESS } from '../src/data/site.js';

const abs = (p) => SITE_URL + p;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// JSON inside <script> must not be able to close the tag
const jsonScript = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const businessId = (loc) => `${abs(loc.path)}#business`;

function faqPage(faqs, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

function breadcrumbs(route) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${abs(route.path)}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
      { '@type': 'ListItem', position: 2, name: route.breadcrumb, item: abs(route.path) },
    ],
  };
}

function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: BUSINESS.name,
    alternateName: BUSINESS.shortName,
    url: abs('/'),
    logo: abs(BUSINESS.logo),
    email: BUSINESS.email,
    telephone: BUSINESS.phones[0].tel,
    contactPoint: BUSINESS.phones.map((p) => ({ '@type': 'ContactPoint', telephone: p.tel, contactType: 'customer service', areaServed: 'IN' })),
    // each physical nursery is its own LocalBusiness entity on its location page
    subOrganization: Object.values(LOCATION_BY_KEY).map((l) => ({ '@id': businessId(l) })),
  };
}

function website() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: abs('/'),
    name: BUSINESS.fullName,
    inLanguage: 'en-IN',
    publisher: { '@id': ORG_ID },
  };
}

export function localBusiness(loc) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'GardenStore', // schema.org's type for a store selling plants and garden supplies
    '@id': businessId(loc),
    name: loc.name,
    url: abs(loc.path),
    parentOrganization: { '@id': ORG_ID },
    image: loc.photos.length ? loc.photos.map((p) => abs(p.src)) : [abs(BUSINESS.logo)],
    logo: abs(BUSINESS.logo),
    address: {
      '@type': 'PostalAddress',
      ...(loc.streetAddress && { streetAddress: loc.streetAddress }),
      addressLocality: loc.locality,
      ...(loc.district !== loc.locality && { addressSubregion: loc.district }),
      addressRegion: loc.state,
      postalCode: loc.postalCode,
      addressCountry: loc.country,
    },
    areaServed: { '@type': 'City', name: loc.market },
    hasMap: mapsSearchUrl(loc),
  };
  if (loc.coordinates) data.geo = { '@type': 'GeoCoordinates', latitude: loc.coordinates.lat, longitude: loc.coordinates.lng };
  if (loc.telephone) data.telephone = loc.telephone;
  if (loc.openingHours) data.openingHoursSpecification = loc.openingHours;
  return data;
}

/** JSON-LD objects for one route */
export function structuredData(route) {
  const url = abs(route.path);
  if (route.path === '/') return [organization(), website(), faqPage(FAQS, url)];
  if (route.location) {
    const loc = LOCATION_BY_KEY[route.location];
    return [localBusiness(loc), breadcrumbs(route), faqPage(LOCATION_CONTENT[route.location].faqs, url)];
  }
  return [breadcrumbs(route)];
}

/** The <head> block for one route (between the seo markers in index.html) */
export function headBlock(route, { noindex = false } = {}) {
  const url = abs(route.path);
  const image = abs(route.ogImage || DEFAULT_OG_IMAGE);
  const tags = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    noindex ? '<meta name="robots" content="noindex, follow" />' : '<meta name="robots" content="index, follow, max-image-preview:large" />',
    ...(noindex ? [] : [`<link rel="canonical" href="${url}" />`]),
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${esc(BUSINESS.fullName)}" />`,
    '<meta property="og:locale" content="en_IN" />',
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    ...(noindex ? [] : [`<meta property="og:url" content="${url}" />`]),
    `<meta property="og:image" content="${image}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(route.title)}" />`,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ...(noindex ? [] : structuredData(route).map(jsonScript)),
  ];
  return tags.map((t) => `    ${t}`).join('\n');
}

/**
 * A plain-HTML copy of a location page's key content, placed inside #root so crawlers that do not run
 * JavaScript read the same H1, address and answers the page shows. React replaces it when the app starts.
 */
export function locationShell(route) {
  const loc = LOCATION_BY_KEY[route.location];
  const c = LOCATION_CONTENT[route.location];
  const faqs = c.faqs.map(({ q, a }) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('');
  return `<div class="seo-shell">`
    + `<nav aria-label="Breadcrumb"><a href="/">Home</a> › <span>${esc(route.breadcrumb)}</span></nav>`
    + `<h1>${esc(c.h1)}</h1>${c.hero.map((p) => `<p>${esc(p)}</p>`).join('')}`
    + `<h2>${esc(c.visitTitle)}</h2><address>${esc(loc.name)}<br />${esc(formatAddress(loc))}</address>`
    + `<p><a href="tel:${BUSINESS.phones[0].tel}">${esc(BUSINESS.phones[0].label)}</a> · <a href="/contact/">Contact</a> · <a href="/plants/">Plant catalogue</a></p>`
    + `<h2>Frequently Asked Questions</h2>${faqs}`
    + `</div>`;
}

/** Minimal styling for the shell, so the moment before the app starts reads as the forest header, not raw text */
export const SHELL_STYLE = '<style>.seo-shell{min-height:100vh;padding:120px 6vw 4rem;background:#0f2d1b;color:#f4ecd9;font:16px/1.7 system-ui,sans-serif}.seo-shell a{color:#c9d98a}.seo-shell h1{font:400 2.4rem/1.1 Georgia,serif;margin:.6rem 0 1rem}.seo-shell h2{font:400 1.5rem Georgia,serif;margin:2rem 0 .6rem}.seo-shell h3{font-size:1rem;margin:1.2rem 0 .2rem}.seo-shell address{font-style:normal}</style>';

export function sitemapXml(date) {
  const urls = ROUTES.map((r) => `  <url>\n    <loc>${abs(r.path)}</loc>\n    <lastmod>${date}</lastmod>\n    <priority>${r.priority}</priority>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export { ROUTES };
