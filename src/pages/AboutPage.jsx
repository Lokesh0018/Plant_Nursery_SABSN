import React, { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, Sprout, Shovel, Scissors, Building2, Plane, Factory, Landmark, BadgeCheck,
  Phone, Mail, MapPin, MessageCircle, Leaf, Trees, Apple, TreePine, Flower2, IndianRupee, LandPlot, Users, Quote,
  Layers, Recycle, Amphora, BrickWall, LayoutGrid, Workflow, Info,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import VineOrnament from '../components/VineOrnament';
import AboutHero from '../components/AboutHero';
import './AboutPage.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = lazy(() => import('../components/Footer'));

// Everything on this page comes from the nursery's company profile (Sri_Ayyappa_Bala_Sai_Nursery_CompanyProfile.pdf).
const STATS = [
  { icon: IndianRupee, value: '₹3.9 Cr', label: 'Annual turnover' },
  { icon: LandPlot, value: '20 Acres', label: 'Combined nursery footprint' },
  { icon: Users, value: '50+', label: 'Full-time team' },
];

const MOTTO = ['Green Plants', 'Healthy Life', 'Happy Life'];

const PILLARS = [
  // `atlas` picks a panel of the illustrative service atlas (public/services/service-atlas-six.webp)
  { icon: Sprout, atlas: 'planting', title: 'Plant supply', text: 'Indoor, outdoor and ornamental plant selections for projects and customers.' },
  { icon: Shovel, atlas: 'landscape', title: 'Landscaping', text: 'Garden establishment, planting, lawn design and landscape development.' },
  { icon: Scissors, atlas: 'lawn', title: 'Maintenance', text: 'Ongoing gardening, plant care and landscape maintenance support.' },
];

const STRENGTHS = [
  'Reliable supply planning for landscaping and garden projects.',
  'Plant selection across bedding plants, shrubs, perennials and specimen trees.',
  'Growing and packaging practices refined through customer feedback and market trends.',
  'Nursery supply that can be combined with planting, establishment and maintenance.',
];

// `atlas` = [sheet, column, row] of a panel in the illustrative service atlases (public/services)
const SUPPLY = [
  { icon: Layers, atlas: ['four', 0, 0], title: 'Cocopeat / Coco-fibre', text: 'Growing media for potting, nursery propagation and soil-mix preparation.' },
  { icon: Recycle, atlas: ['six', 0, 2], title: 'Vermi Compost', text: 'Organic matter for planting beds, potting mixes and landscape soil improvement.' },
  { icon: Amphora, atlas: ['six', 1, 2], title: 'Plant Pots', text: 'Different types, sizes and finishes for nursery, indoor, outdoor and project planting.' },
  { icon: BrickWall, atlas: ['four', 0, 1], title: 'Civil Works', text: 'Garden edging, planter construction, pathways, paving and site preparation.' },
  { icon: LayoutGrid, atlas: ['four', 1, 0], title: 'Vertical Gardens', text: 'Planning, installation and planting for suitable walls and structures.' },
];
const INTEGRATED = {
  title: 'Integrated Delivery', text: 'Plants, media, pots, civil work, planting and maintenance, coordinated as one.',
  parts: ['Plants', 'Media', 'Pots', 'Civil work', 'Planting', 'Maintenance'],
};
const ATLAS_SRC = { four: '/services/service-atlas.webp', six: '/services/service-atlas-six.webp' };

const STEPS = [
  'Site visit and requirement collection',
  'Plant palette and material selection',
  'Quantity estimate and quotation',
  'Site preparation and civil works, where required',
  'Supply and installation',
  'Irrigation, establishment and maintenance plan',
  'Handover with care instructions',
];

const CLIENTS = [
  { icon: Building2, name: 'Renaatus', work: 'Plant supply, gardening and maintenance' },
  { icon: Plane, name: 'Airports Authority of India', work: 'Visakhapatnam airport landscape support' },
  { icon: Factory, name: 'Sri Sarvaraya Sugars Ltd.', work: 'Gopalapuram: plant and garden requirements' },
  { icon: Factory, name: 'Grasim Industries Ltd.', work: 'Chemical Division, Caustic Plant, Baladrapuram' },
];

const PALETTE = [
  { icon: Trees, title: 'Avenue & Shade Trees', plants: ['Neem', 'Gulmohar', 'Rain Tree', 'Copperpod', 'Arjun', 'Kadamba', 'Golden Shower', 'Pongamia'] },
  { icon: Apple, title: 'Fruit & Useful Trees', plants: ['Mango', 'Guava', 'Jackfruit', 'Amla', 'Tamarind', 'Jamun', 'Sapota', 'Coconut', 'Cashew', 'Moringa'] },
  { icon: TreePine, title: 'Native & Forest Trees', plants: ['Banyan', 'Peepal', 'Cluster Fig', 'Pongamia', 'Teak', 'Palmyra', 'Bamboo'] },
  { icon: Flower2, title: 'Flowering & Beautification', plants: ['Bougainvillea', 'Hibiscus', 'Plumeria', 'Ixora', 'Parijatham', 'Allamanda', 'Crape Myrtle', 'Croton'] },
  { icon: Leaf, title: 'Palms, Screens & Groundcovers', plants: ['Areca Palm', 'Royal Palm', 'Foxtail Palm', 'Traveller Palm', 'Red Wax Palm', 'Triangular Palm', 'Ashoka', 'Snake Plant'] },
];

const WA_LINK = `https://wa.me/919849936169?text=${encodeURIComponent('Hello SABSN, I would like to discuss a plant supply or landscaping requirement.')}`;

export default function AboutPage() {
  const introRef = useRef(null);

  // "Who we are": the heading block reveals line by line, the photo opens up as it scrolls into view
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.ap-intro-text > *', { opacity: 0, y: 24, duration: 1, ease: 'power2.out', stagger: 0.12, delay: 0.5 });
      gsap.fromTo('.ap-intro-media',
        { opacity: 0, clipPath: 'inset(10% 8% 10% 8% round 28px)' },
        { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.3, ease: 'power3.out',
          scrollTrigger: { trigger: '.ap-intro-media', start: 'top 88%', once: true } });
      gsap.from('.ap-stats > li, .ap-motto', { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: '.ap-glance', start: 'top 90%', once: true } });
    }, introRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="about-page">
      <Navbar page="about" />

      <AboutHero />

      <main className="ap-main">
        {/* Opening: who we are */}
        <section ref={introRef} className="ap-section ap-intro" aria-labelledby="ap-who">
          <div className="ap-intro-text">
            <p className="ap-kicker ap-kicker--rule">01 · Who we are</p>
            <h1 id="ap-who" className="ap-h1">Built around plants. <em>Delivered with care.</em></h1>
            <VineOrnament />
            <p className="ap-lead">
              Sri Ayyappa Bala Sai Nursery is a complete nursery and landscape partner in Kadiyam, East Godavari. We supply
              indoor, outdoor and ornamental plants, and handle landscaping, garden establishment, planting and ongoing
              maintenance for corporate, public-sector and private clients.
            </p>
            <blockquote className="ap-mission">
              <span className="ap-mission-label"><Quote size={14} strokeWidth={2.4} aria-hidden="true" />Our mission</span>
              <p>To support customers with suitable plant choices and coordinated service from supply through establishment and maintenance.</p>
            </blockquote>
          </div>
          <figure className="ap-intro-media">
            <img src="/nursery.webp" srcSet="/nursery-800.webp 800w, /nursery.webp 1200w" sizes="(max-width: 900px) 92vw, 44vw"
              width="1200" height="673" loading="lazy" decoding="async"
              alt="Rows of nursery plants growing at Sri Ayyappa Bala Sai Nursery in Kadiyam" />
            <figcaption className="ap-intro-badge">
              <span className="ap-intro-badge-icon"><MapPin size={16} aria-hidden="true" /></span>
              <span><strong>Kadiyam, East Godavari</strong>Jakkampudi Nagar, Andhra Pradesh</span>
            </figcaption>
          </figure>
          <div className="ap-glance">
            <ul className="ap-stats" aria-label="Nursery at a glance">
              {STATS.map(({ icon: Icon, value, label }) => (
                <li key={label}>
                  <span className="ap-stat-icon"><Icon size={18} strokeWidth={1.9} aria-hidden="true" /></span>
                  <span className="ap-stat-text"><strong>{value}</strong><span>{label}</span></span>
                </li>
              ))}
            </ul>
            <p className="ap-motto">
              <Leaf size={16} strokeWidth={2} aria-hidden="true" />
              {MOTTO.map((w, i) => <React.Fragment key={w}>{i > 0 && <span className="ap-motto-dot" aria-hidden="true">·</span>}<span>{w}</span></React.Fragment>)}
            </p>
          </div>
        </section>

        {/* What we do */}
        <section className="ap-section ap-bg ap-bg--sage" aria-labelledby="ap-do">
          <header className="ap-head">
            <p className="ap-kicker">02 · What we do</p>
            <h2 id="ap-do" className="ap-h2 ap-h2--split">From the nursery bed <em>to a finished landscape.</em></h2>
          </header>
          <ol className="ap-pillars">
            {PILLARS.map(({ icon: Icon, atlas, title, text }, i) => (
              <li key={title}>
                <div className="ap-pillar-media" aria-hidden="true">
                  <img className={`ap-pillar-atlas ap-pillar-atlas--${atlas}`} src="/services/service-atlas-six.webp"
                    width="1254" height="1254" loading="lazy" decoding="async" alt="" draggable="false" />
                  <span className="ap-pillar-num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="ap-pillar-body">
                  <span className="ap-icon"><Icon size={22} strokeWidth={1.9} aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  {i < PILLARS.length - 1 && <span className="ap-pillar-next" aria-hidden="true"><ArrowRight size={16} strokeWidth={2} /></span>}
                </div>
              </li>
            ))}
          </ol>
          <div className="ap-strengths">
            <div className="ap-strengths-media">
              <img src="/gallery/palms.webp" width="1672" height="941" loading="lazy" decoding="async"
                alt="Rows of young potted palms lined up along a nursery path" />
              <h3 className="ap-strengths-head">What our capacity <em>enables</em></h3>
            </div>
            <ul>{STRENGTHS.map((t, i) => (
              <li key={t}>
                <span className="ap-strength-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span>{t}</span>
              </li>
            ))}</ul>
          </div>
        </section>

        {/* Supply & services */}
        <section className="ap-section ap-band ap-bg ap-bg--cream" aria-labelledby="ap-supply">
          <header className="ap-head">
            <p className="ap-kicker">03 · Expanded services & supply</p>
            <h2 id="ap-supply" className="ap-h2">Everything a planting project needs, <em>in one place.</em></h2>
          </header>
          <ol className="ap-supply">
            {SUPPLY.map(({ icon: Icon, atlas: [sheet, col, row], title, text }, i) => (
              <li key={title}>
                <div className="ap-supply-media" aria-hidden="true">
                  <img className="ap-atlas" src={ATLAS_SRC[sheet]} alt="" loading="lazy" decoding="async" draggable="false"
                    style={{ '--col': col, '--row': row, '--rows': sheet === 'six' ? 3 : 2 }} />
                </div>
                <div className="ap-supply-body">
                  <div className="ap-supply-meta">
                    <span className="ap-supply-icon"><Icon size={18} strokeWidth={1.9} aria-hidden="true" /></span>
                    <span className="ap-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
            <li className="ap-supply-all">
              <span className="ap-supply-icon"><Workflow size={20} strokeWidth={1.9} aria-hidden="true" /></span>
              <span className="ap-num" aria-hidden="true">06</span>
              <h3>{INTEGRATED.title}</h3>
              <p>{INTEGRATED.text}</p>
              <ul className="ap-supply-stack" aria-label="Combined in one delivery">
                {INTEGRATED.parts.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </li>
          </ol>
          <p className="ap-note"><Info size={16} strokeWidth={2} aria-hidden="true" />Exact product specifications, stock and civil-work scope are confirmed before quotation.</p>
        </section>

        {/* Workflow */}
        <section className="ap-section ap-flow ap-bg ap-bg--forest" aria-labelledby="ap-flow">
          <header className="ap-head">
            <p className="ap-kicker">04 · How a project runs</p>
            <h2 id="ap-flow" className="ap-h2">Seven clear steps, <em>site visit to handover.</em></h2>
          </header>
          <ol className="ap-steps">
            {STEPS.map((s, i) => <li key={s}><span className="ap-step-num" aria-hidden="true">{i + 1}</span><span>{s}</span></li>)}
          </ol>
        </section>

        {/* Track record */}
        <section className="ap-section ap-record ap-bg ap-bg--sand" aria-labelledby="ap-record">
          <div className="ap-record-text">
            <p className="ap-kicker">05 · Track record</p>
            <h2 id="ap-record" className="ap-h2">Trusted by <em>organisations we serve.</em></h2>
            <ul className="ap-clients">
              {CLIENTS.map(({ icon: Icon, name, work }) => (
                <li key={name}>
                  <span className="ap-icon ap-icon--sm"><Icon size={18} strokeWidth={1.9} aria-hidden="true" /></span>
                  <span><strong>{name}</strong><small>{work}</small></span>
                </li>
              ))}
            </ul>
            <p className="ap-registration">
              <BadgeCheck size={20} strokeWidth={2} aria-hidden="true" />
              <span><strong>Public-sector registration</strong>Registered as a Class V Contractor in the Public Health Division, Rajamahendravaram.</span>
            </p>
          </div>
          <figure className="ap-record-media">
            <img src="/gallery/airport.webp" width="1360" height="1020" loading="lazy" decoding="async"
              alt="An airport terminal forecourt planted with rounded shrubs, flowering hedges and palms." />
            <figcaption><Landmark size={14} aria-hidden="true" />Airport forecourt landscaping</figcaption>
          </figure>
        </section>

        {/* Plant palette */}
        <section className="ap-section ap-bg ap-bg--sage" aria-labelledby="ap-palette">
          <header className="ap-head">
            <p className="ap-kicker">06 · Landscape plant palette</p>
            <h2 id="ap-palette" className="ap-h2">Rooted in <em>Indian & Andhra landscapes.</em></h2>
            <p className="ap-head-text">A planning palette for landscape work. Final selection follows soil, water, sunlight, space, local suitability and availability.</p>
          </header>
          <ul className="ap-palette">
            {PALETTE.map(({ icon: Icon, title, plants }) => (
              <li key={title}>
                <h3><Icon size={18} strokeWidth={2} aria-hidden="true" />{title}</h3>
                <ul className="ap-chips">{plants.map((p) => <li key={p}>{p}</li>)}</ul>
              </li>
            ))}
          </ul>
        </section>

        {/* Leadership & contact */}
        <section className="ap-section ap-contact" aria-labelledby="ap-contact">
          <img className="ap-contact-photo" src="/sabsn-founder.webp" width="800" height="1073" loading="lazy" decoding="async"
            alt="Uppada Kumara Swamy, Managing Partner of Sri Ayyappa Bala Sai Nursery, holding a jasmine sapling" />
          <div className="ap-contact-body">
            <p className="ap-kicker ap-kicker--light">Let’s grow something great</p>
            <h2 id="ap-contact" className="ap-h2">Talk to <em>Uppada Kumara Swamy</em></h2>
            <p className="ap-role">Managing Partner</p>
            <ul className="ap-contact-list">
              <li><MapPin size={18} aria-hidden="true" /><span>Jakkampudi Nagar, Kadiyam, East Godavari, Andhra Pradesh</span></li>
              <li><Phone size={18} aria-hidden="true" /><span><a href="tel:+919849936169">98499 36169</a> / <a href="tel:+919490378689">94903 78689</a></span></li>
              <li><Mail size={18} aria-hidden="true" /><a href="mailto:uppadakumaraswamy@gmail.com">uppadakumaraswamy@gmail.com</a></li>
            </ul>
            <div className="ap-actions">
              <a className="ap-btn ap-btn--light" href={WA_LINK} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" />Enquire on WhatsApp</a>
              <a className="ap-btn ap-btn--outline" href="/gallery">See our work <ArrowRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      </main>

      <Suspense fallback={<div style={{ minHeight: 460, background: '#0f2d1b' }} aria-hidden="true" />}>
        <Footer />
      </Suspense>
      <WhatsAppButton />
    </div>
  );
}
