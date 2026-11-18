// Every public page: its canonical path (always with a trailing slash), title, meta description, social image
// and breadcrumb label. Read by the pages (document.title) and by the build, which writes each page's own
// index.html head, the sitemap and the structured data from it (vite.config.js). Plain data only.

export const DEFAULT_OG_IMAGE = '/images/gallery/palms-1280.webp';

export const ROUTES = [
  {
    path: '/',
    title: 'SABSN – Sri Ayyappa Bala Sai Nursery | Kadiyam & Visakhapatnam',
    description: 'Plant nurseries in Kadiyam near Rajahmundry and Madhurawada, Visakhapatnam: indoor, outdoor, flowering and fruit plants, landscaping, bulk orders and delivery.',
    ogImage: '/images/gallery/palms-1280.webp',
    priority: '1.0',
  },
  {
    path: '/plant-nursery-rajahmundry/',
    title: 'Plant Nursery Near Rajahmundry | SABSN Kadiyam',
    description: 'Explore indoor, outdoor, flowering, ornamental and fruit plants at SABSN Nursery in Kadiyam near Rajahmundry. Visit our nursery for plant sales, bulk orders, delivery and landscaping services.',
    ogImage: '/images/about/rajahmundry-nursery.webp',
    breadcrumb: 'Plant Nursery Near Rajahmundry',
    location: 'kadiyam',
    priority: '0.9',
  },
  {
    path: '/plant-nursery-visakhapatnam/',
    title: 'Plant Nursery in Visakhapatnam | SABSN',
    description: 'Discover indoor, outdoor, flowering, ornamental and fruit plants at SABSN Plant Nursery in Madhurawada, Visakhapatnam. Explore plant sales, landscaping, bulk orders and delivery.',
    ogImage: '/images/about/visakhapatnam-nursery.webp',
    breadcrumb: 'Plant Nursery in Visakhapatnam',
    location: 'visakhapatnam',
    priority: '0.9',
  },
  {
    path: '/plants/',
    title: 'Plant Catalogue | SABSN – Sri Ayyappa Bala Sai Nursery',
    description: 'Browse the SABSN plant catalogue: indoor, outdoor, flowering and topiary plants, avenue trees, fruit plants and ground cover. Ask about availability on WhatsApp.',
    ogImage: '/images/gallery/palms-1280.webp',
    breadcrumb: 'Plants',
    priority: '0.8',
  },
  {
    path: '/services/',
    title: 'Landscaping & Plant Services | SABSN – Sri Ayyappa Bala Sai Nursery',
    description: 'Landscaping, plant supply and installation, garden establishment and maintenance from SABSN for residential, commercial and institutional spaces.',
    ogImage: '/images/gallery/airport-1280.webp',
    breadcrumb: 'Services',
    priority: '0.8',
  },
  {
    path: '/pots/',
    title: 'Pots & Planters | SABSN – Sri Ayyappa Bala Sai Nursery',
    description: 'Terracotta, ceramic, cement, fibre and designer pots and planters from SABSN. Find a planter for every plant and enquire about sizes and finishes.',
    ogImage: '/images/gallery/palms-1280.webp',
    breadcrumb: 'Pots & Planters',
    priority: '0.6',
  },
  {
    path: '/gallery/',
    title: 'Gallery | SABSN – Sri Ayyappa Bala Sai Nursery',
    description: 'Photographs of landscapes SABSN plants and maintains, stock from the nursery beds, and the clients and partners the nursery works with.',
    ogImage: '/images/gallery/visit-airport-1280.webp',
    breadcrumb: 'Gallery',
    priority: '0.6',
  },
  {
    path: '/about/',
    title: 'About Us | SABSN – Sri Ayyappa Bala Sai Nursery',
    description: 'Sri Ayyappa Bala Sai Nursery (SABSN) is a plant nursery and landscape partner with nurseries in Kadiyam near Rajahmundry and Madhurawada, Visakhapatnam.',
    ogImage: '/images/gallery/palms-1280.webp',
    breadcrumb: 'About',
    priority: '0.7',
  },
  {
    path: '/contact/',
    title: 'Contact | SABSN – Sri Ayyappa Bala Sai Nursery',
    description: 'Call, WhatsApp, email or visit SABSN in Kadiyam near Rajahmundry or Madhurawada, Visakhapatnam, for plants, bulk orders, delivery and landscaping.',
    ogImage: '/images/gallery/palms-1280.webp',
    breadcrumb: 'Contact',
    priority: '0.7',
  },
];

export const ROUTE_BY_PATH = Object.fromEntries(ROUTES.map((r) => [r.path, r]));

/** The route entry for a pathname, with or without its trailing slash */
export function routeFor(pathname) {
  const p = pathname.replace(/\/+$/, '') + '/';
  return ROUTE_BY_PATH[p === '//' ? '/' : p] || null;
}
