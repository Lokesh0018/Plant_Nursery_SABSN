import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Leaf, MapPin, Phone, MessageCircle, Navigation, ArrowRight, ArrowUpRight, Mail, Send, Package, Truck, Trees, Store,
  Armchair, Sun, Flower2, Shrub, Apple, TreePine, Home, Building2, Sprout, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import WhatsAppButton from '../components/layout/WhatsAppButton';
import VineOrnament from '../components/shared/VineOrnament';
import VineDivider from '../components/shared/VineDivider';
import VisitBadge from '../components/shared/VisitBadge';
import Faq from '../components/home/Faq';
import useOffscreenPause from '../hooks/useOffscreenPause';
import CATALOGUE_INDEX from 'virtual:plant-index';
import { LOCATIONS, LOCATION_BY_KEY, formatAddress, directionsUrl, mapEmbedUrl } from '../data/locations';
import { LOCATION_CONTENT } from '../data/locationContent';
import { BUSINESS, waLink } from '../data/site';
import { routeFor } from '../data/routes';
import './LocationPage.css';

const Footer = lazy(() => import('../components/layout/Footer'));

const CATEGORY_ICONS = {
  'indoor-plants': Armchair,
  'outdoor-plants': Sun,
  'flowering-plants': Flower2,
  'ornamental-topiary-plants': Shrub,
  'avenue-shade-trees': Trees,
  'fruit-plants': Apple,
  'native-forest-trees': TreePine,
  'ground-cover-landscape-plants': Leaf,
};

// real landscapes SABSN plants and maintains (from the nursery's company profile)
const PROJECT_PHOTOS = [
  { src: '/images/gallery/airport-1280.webp', srcSet: '/images/gallery/airport-640.webp 640w, /images/gallery/airport-1280.webp 1280w', width: 1280, height: 960,
    alt: 'Rajahmundry airport forecourt planted with rounded shrubs, flowering hedges and palms by SABSN', caption: 'Airport forecourt landscaping' },
  { src: '/images/gallery/avenue-640.webp', srcSet: '/images/gallery/avenue-640.webp 640w, /images/gallery/avenue.webp 960w', width: 640, height: 853,
    alt: 'A long road lined with tall royal palms and shade trees over lawns maintained by SABSN', caption: 'Palm avenue upkeep' },
];
// photographs of the nursery's own stock, used on a page whose branch has no photographs yet (not captioned as that branch)
const STOCK_PHOTO = { src: '/images/gallery/palms-1280.webp', srcSet: '/images/gallery/palms-640.webp 640w, /images/gallery/palms-1280.webp 1280w', width: 1280, height: 720,
  alt: 'Young potted palms lined up along a path in the SABSN nursery stock' };

/*
 * The two branch pages: /plant-nursery-rajahmundry/ (Kadiyam) and /plant-nursery-visakhapatnam/ (Madhurawada).
 * Everything comes from src/data (locations.js for the facts, locationContent.js for the copy), in the same forest
 * header + ivory body design as the other pages. The build writes each page's own head, structured data and a
 * plain-HTML copy of the key content (vite.config.js), so crawlers read the same facts the page shows.
 */
export default function LocationPage({ locationKey }) {
  const loc = LOCATION_BY_KEY[locationKey];
  const c = LOCATION_CONTENT[locationKey];
  const route = routeFor(loc.path);
  const other = LOCATIONS.find((l) => l.key !== locationKey);
  const address = formatAddress(loc);
  const heroRef = useRef(null);
  useOffscreenPause(heroRef);
  useEffect(() => { document.title = route.title; }, [route.title]);

  const enquire = (topic) => waLink(`Hello SABSN (${loc.shortName}), ${topic}`);
  const heroPhoto = loc.photos[0];
  const aboutPhoto = loc.photos[1] || STOCK_PHOTO;
  const [lede, ...rest] = c.hero;

  return (
    <div className="location-page">
      <Navbar page={locationKey} />

      <header ref={heroRef} className="lp-hero">
        <img className="lp-corner" src="/images/home/hero/foliage-tr.webp" alt="" width="372" height="420" aria-hidden="true" decoding="async" />
        <Leaf className="lp-watermark" strokeWidth={0.6} aria-hidden="true" />
        <div className="lp-hero-copy">
          <nav className="lp-crumbs" aria-label="Breadcrumb">
            <ol>
              <li><a href="/">Home</a><ChevronRight size={13} aria-hidden="true" /></li>
              <li aria-current="page">{route.breadcrumb}</li>
            </ol>
          </nav>
          <VisitBadge place={`${loc.locality}, ${loc.market === loc.locality ? loc.district : loc.market}`} />
          <p className="lp-eyebrow">{c.eyebrow}</p>
          <h1 className="lp-title">
            {c.h1.split(' – ')[0]}
            <span className="lp-title-sub"> – {c.h1.split(' – ')[1]}</span>
          </h1>
          <VineOrnament />
          <p className="lp-lede">{lede}</p>
          {rest.map((p) => <p key={p} className="lp-text">{p}</p>)}
          <div className="lp-actions">
            <a className="lp-btn" href={directionsUrl(loc)} target="_blank" rel="noopener noreferrer">
              <Navigation size={16} strokeWidth={2.2} aria-hidden="true" /> Get directions
            </a>
            <a className="lp-btn lp-btn--ghost" href={enquire('I would like to know about available plants.')} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" /> WhatsApp
            </a>
            <a className="lp-btn lp-btn--ghost" href={`tel:${BUSINESS.phones[0].tel}`}>
              <Phone size={16} strokeWidth={2.2} aria-hidden="true" /> Call
            </a>
          </div>
        </div>

        {/* the branch card: a real photo of this nursery when there is one, then the address and the ways in */}
        <aside className="lp-branch" aria-label={`${loc.name}: address and contact`}>
          {heroPhoto ? (
            <div className="lp-branch-photo">
              <img src={heroPhoto.src} srcSet={heroPhoto.srcSet} sizes="(max-width: 900px) 92vw, 440px" alt={heroPhoto.alt} width={heroPhoto.width} height={heroPhoto.height} fetchPriority="high" decoding="async" />
            </div>
          ) : (
            <div className="lp-branch-photo lp-branch-photo--plain" aria-hidden="true">
              <MapPin size={34} strokeWidth={1.6} />
            </div>
          )}
          <div className="lp-branch-body">
            <p className="lp-branch-kicker"><Store size={14} aria-hidden="true" />{loc.shortName}{loc.headquarters && ' · Headquarters'}</p>
            <address className="lp-branch-address">{loc.name}<br />{address}</address>
            <ul className="lp-branch-facts">
              <li><Sprout size={15} aria-hidden="true" />Plant sales &amp; nursery visits</li>
              <li><Package size={15} aria-hidden="true" />Bulk orders accepted</li>
              <li><Truck size={15} aria-hidden="true" />Plant delivery available</li>
              <li><Trees size={15} aria-hidden="true" />Residential &amp; commercial landscaping</li>
            </ul>
            <a className="lp-branch-link" href={directionsUrl(loc)} target="_blank" rel="noopener noreferrer">
              Directions on Google Maps <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </aside>
      </header>

      <VineDivider variant="ramp" id={`loc-${locationKey}-top`} from="#163624" to="#F7F3EA" />

      <main>
      <div className="lp-main">
        {/* 1. about this nursery */}
        <section className="lp-section lp-about" aria-labelledby="lp-about-title">
          <div>
            <p className="lp-kicker">About this nursery</p>
            <h2 id="lp-about-title">{c.about.title}</h2>
            {c.about.body.map((p) => <p key={p}>{p}</p>)}
            <ul className="lp-checks">
              <li><Store size={16} aria-hidden="true" /><span><strong>Visit the nursery</strong> to see the plants in person</span></li>
              <li><Package size={16} aria-hidden="true" /><span><strong>Bulk orders</strong> for projects and plantations</span></li>
              <li><Truck size={16} aria-hidden="true" /><span><strong>Plant delivery</strong>, arranged with you</span></li>
              <li><Trees size={16} aria-hidden="true" /><span><strong>Landscaping</strong> for homes and businesses</span></li>
            </ul>
          </div>
          <figure className="lp-about-photo">
            <img src={aboutPhoto.src} srcSet={aboutPhoto.srcSet} sizes="(max-width: 900px) 92vw, 46vw" alt={aboutPhoto.alt} width={aboutPhoto.width} height={aboutPhoto.height} loading="lazy" decoding="async" />
            <figcaption>{loc.photos[1] ? `At ${loc.shortName}` : 'From the SABSN nursery stock'}</figcaption>
          </figure>
        </section>

        {/* 2. the plant collection, each linked to its filter on the catalogue */}
        <section className="lp-section" aria-labelledby="lp-plants-title">
          <div className="lp-head">
            <p className="lp-kicker">Plant collection</p>
            <h2 id="lp-plants-title">Explore Our Plant Collection</h2>
            <p>Every category in the SABSN catalogue. Ask the nursery about current availability and sizes.</p>
          </div>
          <ul className="lp-cats">
            {c.categories.map((slug) => {
              const cat = CATALOGUE_INDEX.find((g) => g.slug === slug);
              if (!cat) return null;
              const Icon = CATEGORY_ICONS[slug] || Leaf;
              return (
                <li key={slug}>
                  <a className="lp-cat" href={`/plants/?category=${slug}`}>
                    <span className="lp-cat-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.9} /></span>
                    <span className="lp-cat-name">{cat.title}</span>
                    <span className="lp-cat-count">{cat.count} plants</span>
                    <ArrowRight className="lp-cat-go" size={16} aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
          <a className="lp-textlink" href="/plants/">Browse the full plant catalogue <ArrowRight size={16} aria-hidden="true" /></a>
        </section>
      </div>

      {/* 3. landscaping, on a forest band with real project photographs */}
      <section className="lp-band" aria-labelledby="lp-land-title">
        <div className="lp-band-inner">
          <div className="lp-band-copy">
            <p className="lp-kicker lp-kicker--light">Landscaping</p>
            <h2 id="lp-land-title">{c.landscapingTitle}</h2>
            <p>
              SABSN plans, plants and maintains green spaces for homes and businesses: residential gardens,
              commercial properties, outdoor spaces and larger green development projects, with plants supplied
              from the nursery.
            </p>
            <ul className="lp-band-list">
              <li><Home size={16} aria-hidden="true" />Residential gardens</li>
              <li><Building2 size={16} aria-hidden="true" />Commercial properties</li>
              <li><Trees size={16} aria-hidden="true" />Outdoor spaces &amp; avenues</li>
              <li><Sprout size={16} aria-hidden="true" />Green development projects</li>
            </ul>
            <div className="lp-actions">
              <a className="lp-btn" href={enquire('I would like to discuss a landscaping requirement.')} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" /> Enquire about landscaping
              </a>
              <a className="lp-btn lp-btn--ghost" href="/services/">Our services <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="lp-band-photos">
            {PROJECT_PHOTOS.map((p) => (
              <figure key={p.src}>
                <img src={p.src} srcSet={p.srcSet} sizes="(max-width: 900px) 46vw, 300px" alt={p.alt} width={p.width} height={p.height} loading="lazy" decoding="async" />
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <div className="lp-main lp-main--after">
        {/* 4 + 6. bulk orders (with an enquiry form) beside plant delivery */}
        <div className="lp-pair">
          <BulkEnquiry loc={loc} />
          <section className="lp-card lp-delivery" aria-labelledby="lp-delivery-title">
            <span className="lp-card-icon" aria-hidden="true"><Truck size={22} strokeWidth={1.9} /></span>
            <h2 id="lp-delivery-title">Plant Delivery</h2>
            <p>
              SABSN offers plant delivery. Contact the nursery to confirm delivery availability for your location, the
              distance, transportation arrangements and the charges before you order.
            </p>
            <a className="lp-btn lp-btn--forest" href={enquire('I would like to ask about plant delivery.')} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" /> Ask about delivery
            </a>
          </section>
        </div>

        {/* 5. visit: the address, directions, the map and the ways to get in touch */}
        <section className="lp-section lp-visit" aria-labelledby="lp-visit-title">
          <div className="lp-visit-card">
            <p className="lp-kicker lp-kicker--light">{loc.headquarters ? 'SABSN Headquarters' : 'Visit'}</p>
            <h2 id="lp-visit-title">{c.visitTitle}</h2>
            <address className="lp-visit-address">
              <MapPin size={18} aria-hidden="true" />
              <span><strong>{loc.name}</strong>{address}</span>
            </address>
            <p className="lp-visit-note">{BUSINESS.hoursText}. Call ahead and the team can have plants ready for you to see.</p>
            <div className="lp-visit-actions">
              <a className="lp-btn" href={directionsUrl(loc)} target="_blank" rel="noopener noreferrer">
                <Navigation size={16} strokeWidth={2.2} aria-hidden="true" /> Get directions
              </a>
              <a className="lp-btn lp-btn--ghost" href={`tel:${BUSINESS.phones[0].tel}`}>
                <Phone size={16} strokeWidth={2.2} aria-hidden="true" /> {BUSINESS.phones[0].label}
              </a>
              <a className="lp-btn lp-btn--ghost" href={`mailto:${BUSINESS.email}`}>
                <Mail size={16} strokeWidth={2.2} aria-hidden="true" /> Email
              </a>
            </div>
            {loc.referenceMapUrl && (
              <a className="lp-visit-ref" href={loc.referenceMapUrl} target="_blank" rel="noopener noreferrer">
                See the exact spot in Google Maps Street View <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            )}
          </div>
          <div className="lp-map">
            <iframe title={`Map: ${loc.name}, ${address}`} src={mapEmbedUrl(loc)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </section>

        {loc.photos.length > 2 && (
          <div className="lp-gallery">
            {loc.photos.slice(2).map((p) => (
              <img key={p.src} src={p.src} srcSet={p.srcSet} sizes="(max-width: 900px) 46vw, 300px" alt={p.alt} width={p.width} height={p.height} loading="lazy" decoding="async" />
            ))}
          </div>
        )}

        {/* the other nursery */}
        <a className="lp-other" href={other.path}>
          <span className="lp-other-icon" aria-hidden="true"><MapPin size={20} /></span>
          <span className="lp-other-text"><small>Also visit</small><strong>{other.cardTitle}</strong>{formatAddress(other, { country: false })}</span>
          <span className="lp-other-go">Explore <ArrowRight size={16} aria-hidden="true" /></span>
        </a>
      </div>

      {/* 7. the questions for this nursery, in the same accordion as the home page */}
      <VineDivider variant="ramp" id={`loc-${locationKey}-faq`} from="#F7F3EA" to="#eef3e4" />
      <Faq
        id={`faq-${locationKey}`}
        items={c.faqs}
        title={<>Frequently Asked <em>Questions</em></>}
        lede={`Quick answers about ${loc.shortName}: where it is, the plants, landscaping, bulk orders, delivery and visits.`}
      />
      </main>

      <Suspense fallback={<div style={{ minHeight: 460, background: '#0f2d1b' }} aria-hidden="true" />}>
        <Footer />
      </Suspense>
      <WhatsAppButton />
    </div>
  );
}

/* Section 4: what a bulk enquiry needs, composed into a WhatsApp message or an email (the site has no form backend) */
function BulkEnquiry({ loc }) {
  const [f, setF] = useState({ plant: '', quantity: '', size: '', place: '', name: '', phone: '' });
  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const message = [
    `Hello SABSN (${loc.shortName}), I would like to enquire about a bulk plant order.`,
    `Plant: ${f.plant.trim()}`,
    `Quantity: ${f.quantity.trim()}`,
    f.size.trim() && `Preferred size: ${f.size.trim()}`,
    f.place.trim() && `Project location: ${f.place.trim()}`,
    `Name: ${f.name.trim()}`,
    f.phone.trim() && `Phone: ${f.phone.trim()}`,
  ].filter(Boolean).join('\n');
  const ready = f.plant.trim() && f.quantity.trim() && f.name.trim();
  const send = (e) => {
    e.preventDefault();
    window.open(waLink(message), '_blank', 'noopener,noreferrer');
  };
  const mail = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(`Bulk plant enquiry – ${loc.shortName}`)}&body=${encodeURIComponent(message)}`;

  return (
    <section className="lp-card lp-bulk" aria-labelledby="lp-bulk-title">
      <span className="lp-card-icon" aria-hidden="true"><Package size={22} strokeWidth={1.9} /></span>
      <h2 id="lp-bulk-title">Bulk Plant Orders</h2>
      <p>SABSN accepts bulk plant orders for landscaping projects, commercial properties, residential developments and plantations. Tell us what you need and the nursery will confirm availability and pricing.</p>
      <form className="lp-form" onSubmit={send}>
        <label className="lp-field"><span>Plant name <b aria-hidden="true">*</b></span>
          <input type="text" required value={f.plant} onChange={set('plant')} placeholder="e.g. Areca palm" /></label>
        <label className="lp-field"><span>Required quantity <b aria-hidden="true">*</b></span>
          <input type="text" required inputMode="numeric" value={f.quantity} onChange={set('quantity')} placeholder="e.g. 200" /></label>
        <label className="lp-field"><span>Preferred plant size <i>(optional)</i></span>
          <input type="text" value={f.size} onChange={set('size')} placeholder="e.g. 3–4 ft, 12-inch pot" /></label>
        <label className="lp-field"><span>Project location <i>(optional)</i></span>
          <input type="text" autoComplete="address-level2" value={f.place} onChange={set('place')} placeholder="Town or site" /></label>
        <label className="lp-field"><span>Your name <b aria-hidden="true">*</b></span>
          <input type="text" required autoComplete="name" value={f.name} onChange={set('name')} /></label>
        <label className="lp-field"><span>Phone <i>(optional)</i></span>
          <input type="tel" autoComplete="tel" inputMode="tel" value={f.phone} onChange={set('phone')} placeholder="+91" /></label>
        <div className="lp-form-actions">
          <button type="submit" className="lp-btn lp-btn--forest"><Send size={16} strokeWidth={2.2} aria-hidden="true" /> Send on WhatsApp</button>
          <a className={`lp-btn lp-btn--outline${ready ? '' : ' is-disabled'}`} href={ready ? mail : undefined} aria-disabled={!ready}>
            <Mail size={16} strokeWidth={2.2} aria-hidden="true" /> Send by email
          </a>
        </div>
        <p className="lp-form-note">Your enquiry opens in WhatsApp or your email app, ready to send. Nothing is stored on this site.</p>
      </form>
    </section>
  );
}
