import React, { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, Sprout, Shovel, Scissors, Building2, Plane, Factory, Landmark, BadgeCheck,
  Phone, Mail, MapPin, MessageCircle, Leaf, Trees, Apple, TreePine, Flower2, IndianRupee, LandPlot, Users, Quote,
  Layers, Recycle, Amphora, BrickWall, LayoutGrid, Workflow, Info,
  ClipboardList, Palette, Calculator, HardHat, Truck, Droplets, Handshake,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import VineOrnament from '../components/VineOrnament';
import VineDivider from '../components/VineDivider';
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

// the seven steps, grouped into the same Plan / Build / Care phases the home page uses
const PHASES = [
  { label: 'Plan', steps: [
    { icon: ClipboardList, text: 'Site visit and requirement collection' },
    { icon: Palette, text: 'Plant palette and material selection' },
    { icon: Calculator, text: 'Quantity estimate and quotation' },
  ] },
  { label: 'Build', steps: [
    { icon: HardHat, text: 'Site preparation and civil works, where required' },
    { icon: Truck, text: 'Supply and installation' },
  ] },
  { label: 'Care', steps: [
    { icon: Droplets, text: 'Irrigation, establishment and maintenance plan' },
    { icon: Handshake, text: 'Handover with care instructions' },
  ] },
];

const CLIENTS = [
  { icon: Building2, name: 'Renaatus', work: 'Plant supply, gardening and maintenance',
    photo: '/clients/renaatus.webp', size: [678, 900], focus: '50% 40%', alt: 'Renaatus office building with landscaped planting at its base' },
  { icon: Plane, name: 'Airports Authority of India', work: 'Rajahmundry airport landscape support',
    photo: '/gallery/airport.webp', size: [1360, 1020], focus: '60% 55%', alt: 'Rajahmundry airport terminal with landscaped lawns, palms and flowering shrubs' },
  { icon: Factory, name: 'Sri Sarvaraya Sugars Ltd.', work: 'Gopalapuram: plant and garden requirements',
    photo: '/clients/sri-sarvaraya.webp', size: [600, 376], focus: '50% 50%', alt: 'Sri Sarvaraya Sugars building with a planted hedge and garden in front' },
  { icon: Factory, name: 'Grasim Industries Ltd.', work: 'Chemical Division, Caustic Plant, Baladrapuram',
    photo: '/clients/grasim.webp', size: [488, 600], focus: '40% 72%', alt: 'Grasim Industries plant entrance with its sign, trees and factory chimneys' },
];

const PALETTE = [
  { icon: Trees, title: 'Avenue & Shade Trees', plants: ['Neem', 'Gulmohar', 'Rain Tree', 'Copperpod', 'Arjun', 'Kadamba', 'Golden Shower', 'Pongamia'] },
  { icon: Apple, title: 'Fruit & Useful Trees', plants: ['Mango', 'Guava', 'Jackfruit', 'Amla', 'Tamarind', 'Jamun', 'Sapota', 'Coconut', 'Cashew', 'Moringa'] },
  { icon: TreePine, title: 'Native & Forest Trees', plants: ['Banyan', 'Peepal', 'Cluster Fig', 'Pongamia', 'Teak', 'Palmyra', 'Bamboo'] },
  { icon: Flower2, title: 'Flowering & Beautification', plants: ['Bougainvillea', 'Hibiscus', 'Plumeria', 'Ixora', 'Parijatham', 'Allamanda', 'Crape Myrtle', 'Croton'] },
  { icon: Leaf, title: 'Palms, Screens & Groundcovers', plants: ['Areca Palm', 'Royal Palm', 'Foxtail Palm', 'Traveller Palm', 'Red Wax Palm', 'Triangular Palm', 'Ashoka', 'Snake Plant'] },
];

const CLIENT_ROTATE_MS = 4500; // how long each client's photo shows before the next one

const WA_LINK = `https://wa.me/919849936169?text=${encodeURIComponent('Hello SABSN, I would like to discuss a plant supply or landscaping requirement.')}`;

export default function AboutPage() {
  const introRef = useRef(null);
  const [client, setClient] = useState(1); // opens on the airport, as the section always has
  // the clients rotate on their own while the section is on screen; hover or keyboard focus holds them
  const recordRef = useRef(null);
  const [recordInView, setRecordInView] = useState(false);
  const [hoverHold, setHoverHold] = useState(false);
  const [focusHold, setFocusHold] = useState(false);
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const rotating = recordInView && !hoverHold && !focusHold && !reducedMotion;
  useEffect(() => {
    const el = recordRef.current;
    const io = new IntersectionObserver(([e]) => setRecordInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // restarts on every change of client, so a click gives the chosen client a full turn
  useEffect(() => {
    if (!rotating) return undefined;
    const t = setTimeout(() => setClient((c) => (c + 1) % CLIENTS.length), CLIENT_ROTATE_MS);
    return () => clearTimeout(t);
  }, [rotating, client]);
  // arrow keys move between client tabs (focus follows selection)
  const onClientKey = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? CLIENTS.length - 1 : step ? (client + step + CLIENTS.length) % CLIENTS.length : null;
    if (next === null) return;
    e.preventDefault();
    setClient(next);
    document.getElementById(`ap-client-${next}`)?.focus();
  };

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

        <VineDivider variant="ramp" id="about-1" from="#F7F4EA" to="#eef3e4" />

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

        <VineDivider variant="ramp" id="about-2" from="#edf2e3" to="#fbf8f1" />

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

        <VineDivider variant="ramp" id="about-3" from="#f7f3ea" to="#163624" />

        {/* Workflow */}
        <section className="ap-section ap-flow ap-bg ap-bg--forest" aria-labelledby="ap-flow">
          <header className="ap-head">
            <p className="ap-kicker">04 · How a project runs</p>
            <h2 id="ap-flow" className="ap-h2 ap-h2--split">Seven clear steps, <em>site visit to handover.</em></h2>
          </header>
          <div className="ap-phases">
            {PHASES.map(({ label, steps }, p) => {
              const first = PHASES.slice(0, p).reduce((n, ph) => n + ph.steps.length, 1);
              const last = first + steps.length - 1;
              return (
                <div key={label} className="ap-phase" style={{ '--n': steps.length }}>
                  <p className="ap-phase-label"><strong>{label}</strong><span>Steps {first}–{last}</span></p>
                  <ol className="ap-steps" start={first}>
                    {steps.map(({ icon: Icon, text }, i) => (
                      <li key={text}>
                        <div className="ap-step-top">
                          <span className="ap-step-num" aria-hidden="true">{String(first + i).padStart(2, '0')}</span>
                          <Icon className="ap-step-icon" size={20} strokeWidth={1.8} aria-hidden="true" />
                        </div>
                        <span className="ap-step-text">{text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </section>

        <VineDivider variant="ramp" id="about-4" from="#0f2d1b" to="#f6efe2" />

        {/* Track record */}
        <section className="ap-section ap-record ap-bg ap-bg--sand" aria-labelledby="ap-record">
          <header className="ap-head">
            <p className="ap-kicker">05 · Track record</p>
            <h2 id="ap-record" className="ap-h2 ap-h2--split">Trusted by <em>organisations we serve.</em></h2>
          </header>
          <div ref={recordRef} className={`ap-record-grid${rotating ? ' is-rotating' : ''}`} style={{ '--rotate-ms': `${CLIENT_ROTATE_MS}ms` }}
            onMouseEnter={() => setHoverHold(true)} onMouseLeave={() => setHoverHold(false)}
            // only keyboard focus holds the rotation; focus left behind by a mouse click must not stop it
            onFocus={(e) => setFocusHold(e.target.matches(':focus-visible'))}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocusHold(false); }}>
            <div className="ap-record-body">
              {/* client tabs: selecting one shows that client's site photo on the right */}
              <div className="ap-clients" role="tablist" aria-label="Clients" onKeyDown={onClientKey}>
                {CLIENTS.map(({ icon: Icon, name, work }, i) => (
                  <button key={name} type="button" role="tab" id={`ap-client-${i}`} aria-controls="ap-client-photo"
                    aria-selected={client === i} tabIndex={client === i ? 0 : -1} onClick={() => setClient(i)}>
                    <span className="ap-client-icon"><Icon size={19} strokeWidth={1.9} aria-hidden="true" /></span>
                    <strong>{name}</strong>
                    <small>{work}</small>
                    {client === i && <span key={`${client}-${rotating}`} className="ap-client-progress" aria-hidden="true" />}
                  </button>
                ))}
              </div>
              <div className="ap-registration">
                <span className="ap-registration-badge"><BadgeCheck size={24} strokeWidth={2} aria-hidden="true" /></span>
                <p>
                  <span className="ap-registration-label">Public-sector registration</span>
                  Registered as a <strong>Class V Contractor</strong> in the Public Health Division, Rajamahendravaram.
                </p>
              </div>
            </div>
            <figure className="ap-record-media" id="ap-client-photo" role="tabpanel" aria-labelledby={`ap-client-${client}`}>
              {/* all photos stay mounted and cross-fade, so switching is instant once loaded */}
              {CLIENTS.map(({ name, photo, size, focus, alt }, i) => (
                <img key={name} className={client === i ? 'is-active' : undefined} src={photo} width={size[0]} height={size[1]}
                  loading="lazy" decoding="async" alt={client === i ? alt : ''} aria-hidden={client !== i || undefined} style={{ objectPosition: focus }} />
              ))}
              <figcaption><Landmark size={15} aria-hidden="true" />{CLIENTS[client].name}</figcaption>
            </figure>
          </div>
        </section>

        <VineDivider variant="ramp" id="about-5" from="#f3ead9" to="#eef3e4" />

        {/* Plant palette */}
        <section className="ap-section ap-bg ap-bg--sage" aria-labelledby="ap-palette">
          <header className="ap-head ap-head--split">
            <div>
              <p className="ap-kicker">06 · Landscape plant palette</p>
              <h2 id="ap-palette" className="ap-h2 ap-h2--split">Rooted in <em>Indian & Andhra landscapes.</em></h2>
            </div>
            <p className="ap-palette-note">
              <Info size={18} strokeWidth={2} aria-hidden="true" />
              <span>A planning palette for landscape work. Final selection follows soil, water, sunlight, space, local suitability and availability.</span>
            </p>
          </header>
          <ul className="ap-palette">
            {PALETTE.map(({ icon: Icon, title, plants }) => (
              <li key={title}>
                <div className="ap-palette-head">
                  <span className="ap-palette-icon"><Icon size={20} strokeWidth={1.9} aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <span className="ap-palette-count">{plants.length} species</span>
                </div>
                <ul className="ap-chips">{plants.map((p) => <li key={p}>{p}</li>)}</ul>
              </li>
            ))}
          </ul>
        </section>

        <VineDivider variant="ramp" id="about-6" from="#edf2e3" to="#F7F4EA" />

        {/* Leadership & contact */}
        <section className="ap-section ap-contact" aria-labelledby="ap-contact">
          <img className="ap-contact-photo" src="/sabsn-founder-greenhouse.webp" width="800" height="1421" loading="lazy" decoding="async"
            alt="Uppada Kumara Swamy, Managing Partner of Sri Ayyappa Bala Sai Nursery, holding a potted succulent in a greenhouse" />
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
