import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import useOffscreenPause from '../hooks/useOffscreenPause';
import useOpenStatus from '../hooks/useOpenStatus';
import { Leaf, Clock, MapPin, Phone, Mail, MessageCircle, ArrowRight, ArrowUpRight, Navigation, Send, CircleHelp, Package, User, ShieldCheck, Sprout, Trees, Truck, Flower2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import WhatsAppButton from '../components/layout/WhatsAppButton';
import VineOrnament from '../components/shared/VineOrnament';
import VineDivider from '../components/shared/VineDivider';
import VisitBadge from '../components/shared/VisitBadge';
import './ContactPage.css';
import { routeFor } from '../data/routes';
import { BUSINESS } from '../data/site';
import { LOCATIONS, formatAddress, directionsUrl, mapEmbedUrl } from '../data/locations';

const Footer = lazy(() => import('../components/layout/Footer'));

// the nursery's details, as given on the About page and in the footer
const PHONE_1 = BUSINESS.phones[0];
const EMAIL = 'sabsnnursery@gmail.com';
const WA_NUMBER = '919849936169';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hello SABSN, I would like to know more about your plants and services.')}`;

const TOPICS = [
  { label: 'Plants for home', Icon: Sprout },
  { label: 'Landscaping', Icon: Trees },
  { label: 'Bulk order', Icon: Package },
  { label: 'Delivery', Icon: Truck },
  { label: 'Pots & planters', Icon: Flower2 },
  { label: 'Something else', Icon: CircleHelp },
];
const MESSAGE_MAX = 600;

/*
 * /contact: the ways to reach the nursery in one place. A forest header (the same family as the Plants,
 * Services, Pots and Gallery headers) with a contact panel (live status, a row per channel, today's hours), a
 * vine divider into the ivory body, four contact cards, an enquiry form and the visiting details with
 * a map. The site has no form backend, so the form composes the enquiry and opens it in WhatsApp
 * (or the visitor's email app); nothing is stored or sent anywhere else.
 */
export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', topic: TOPICS[0].label, place: '', message: '' });
  const [branch, setBranch] = useState(0); // which nursery the visit card's map shows
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => { document.title = routeFor('/contact/').title; }, []);
  const open = useOpenStatus();
  const heroRef = useRef(null);
  // the hero's looping animations (status pulse, tickers, drifting tags) stop while it is scrolled away
  useOffscreenPause(heroRef);

  const enquiry = [
    `Hello SABSN, my name is ${form.name.trim()}.`,
    `Enquiry: ${form.topic}`,
    form.place.trim() && `Location: ${form.place.trim()}`,
    form.phone.trim() && `Phone: ${form.phone.trim()}`,
    '',
    form.message.trim(),
  ].filter((l) => l !== false && l !== '').join('\n');

  const sendWhatsApp = (e) => {
    e.preventDefault();
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(enquiry)}`, '_blank', 'noopener,noreferrer');
  };
  const mailHref = `mailto:${EMAIL}?subject=${encodeURIComponent(`Enquiry: ${form.topic}`)}&body=${encodeURIComponent(enquiry)}`;
  const ready = form.name.trim() && form.message.trim();

  return (
    <div className="contact-page">
      <Navbar page="contact" />

      <header ref={heroRef} className="cp-hero">
        <img className="cp-corner" src="/images/home/hero/foliage-tr.webp" alt="" width="372" height="420" aria-hidden="true" decoding="async" />
        {/* a large outline leaf, barely there, so the lower left of the copy column is not flat green */}
        <Leaf className="cp-watermark" strokeWidth={0.6} aria-hidden="true" />
        <div className="cp-hero-copy">
          <VisitBadge />
          <p className="cp-eyebrow">Get in touch</p>
          <h1 className="cp-title">Let’s talk <em>plants.</em></h1>
          <VineOrnament />
          <p className="cp-lede">
            Choosing plants for a home, planning a landscape or ordering in bulk, call, message or visit the
            nursery and we will help you find the right green.
          </p>
          <div className="cp-actions">
            <a className="cp-btn" href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={17} strokeWidth={2.2} aria-hidden="true" /> Chat on WhatsApp
            </a>
            <a className="cp-btn cp-btn--ghost" href={`tel:${PHONE_1.tel}`}>
              <Phone size={16} strokeWidth={2.2} aria-hidden="true" /> Call {PHONE_1.label}
            </a>
          </div>
          {/* the nursery's hours and lines in figures, as in the Plants header */}
          <ul className="cp-stats" aria-label="When and how to reach us">
            <li><strong>7</strong><span>Days a week</span></li>
            <li><strong>7–6</strong><span>Opening hours</span></li>
            <li><strong>2</strong><span>Phone lines</span></li>
          </ul>
        </div>

        {/* one contact panel: the nursery and whether it is open now, a row for each way to reach us (each row
            is the link), and today's hours on a line with a marker at the time now */}
        <div className="cp-board">
          <span className="cp-board-glow" aria-hidden="true" />
          <span className="cp-card-back" aria-hidden="true" />
          {/* two tags pinned to the panel's left edge: where we deliver, and that we take large orders (both from the FAQ) */}
          <p className="cp-float cp-float--areas">
            <span className="cp-float-icon" aria-hidden="true"><Navigation size={15} strokeWidth={2.2} /></span>
            <span><small>We serve</small>Rajahmundry &amp; Visakhapatnam</span>
          </p>
          <p className="cp-float cp-float--bulk">
            <span className="cp-float-icon" aria-hidden="true"><Package size={15} strokeWidth={2.2} /></span>
            <span><small>Landscaping &amp; plantation</small>Bulk orders welcome</span>
          </p>
          <section className="cp-panel" aria-label="Contact the nursery">
            <header className="cp-panel-head">
              <img src="/images/brand/logo-256.webp" alt="" width="52" height="52" decoding="async" />
              <div className="cp-panel-name">
                <strong>Sri Ayyappa Bala Sai Nursery</strong>
                <span>Kadiyam &amp; Visakhapatnam</span>
              </div>
              <p className={`cp-panel-status${open.now ? ' is-open' : ''}`}>
                <span className="cp-panel-dot" aria-hidden="true" />{open.now ? 'Open now' : 'Closed now'}
              </p>
            </header>

            <ul className="cp-actions-list">
              <li>
                <a className="cp-action" href={`tel:${PHONE_1.tel}`}>
                  <span className="cp-action-icon" aria-hidden="true"><Phone size={18} strokeWidth={2} /></span>
                  <span className="cp-action-text"><small>Call</small>{PHONE_1.label}</span>
                  <span className="cp-action-go" aria-hidden="true"><ArrowUpRight size={16} strokeWidth={2.2} /></span>
                </a>
              </li>
              <li>
                <a className="cp-action cp-action--wa" href={WA_LINK} target="_blank" rel="noopener noreferrer">
                  <span className="cp-action-icon" aria-hidden="true"><MessageCircle size={18} strokeWidth={2} /></span>
                  <span className="cp-action-text"><small>WhatsApp · quickest reply</small>Chat with the nursery</span>
                  <span className="cp-action-go" aria-hidden="true"><ArrowUpRight size={16} strokeWidth={2.2} /></span>
                </a>
              </li>
              <li>
                <a className="cp-action" href={`mailto:${EMAIL}`}>
                  <span className="cp-action-icon" aria-hidden="true"><Mail size={18} strokeWidth={2} /></span>
                  <span className="cp-action-text"><small>Email</small><span className="cp-action-mail">{EMAIL}</span></span>
                  <span className="cp-action-go" aria-hidden="true"><ArrowUpRight size={16} strokeWidth={2.2} /></span>
                </a>
              </li>
              {LOCATIONS.map((loc) => (
                <li key={loc.key}>
                  <a className="cp-action" href={directionsUrl(loc)} target="_blank" rel="noopener noreferrer">
                    <span className="cp-action-icon" aria-hidden="true"><MapPin size={18} strokeWidth={2} /></span>
                    <span className="cp-action-text"><small>Visit · get directions</small>{loc.locality}{loc.locality === loc.district ? '' : `, ${loc.market}`}</span>
                    <span className="cp-action-go" aria-hidden="true"><ArrowUpRight size={16} strokeWidth={2.2} /></span>
                  </a>
                </li>
              ))}
            </ul>

            <footer className="cp-panel-hours">
              <p><Clock size={14} strokeWidth={2.2} aria-hidden="true" /><span>Open daily, 7 am – 6 pm</span><b>{open.label}</b></p>
              {/* 6 am to 8 pm; the open window is lit and the marker shows the time now */}
              <div className="cp-hours-track" aria-hidden="true">
                <span className="cp-hours-window" />
                {open.mark !== null && <span className="cp-hours-now" style={{ left: `${open.mark}%` }} />}
              </div>
              <div className="cp-hours-scale" aria-hidden="true"><span>6 am</span><span>Noon</span><span>8 pm</span></div>
            </footer>
          </section>
        </div>
      </header>

      <VineDivider variant="ramp" id="contact-top" from="#163624" to="#F7F3EA" />

      <main className="cp-main">
        {/* the four ways to reach us */}
        <section className="cp-ways" aria-labelledby="cp-ways-title">
          <div className="cp-head">
            <p className="cp-kicker">Reach us</p>
            <h2 id="cp-ways-title">Four ways to <em>reach the nursery.</em></h2>
          </div>
          <ul className="cp-cards">
            <li className="cp-card">
              <span className="cp-card-icon" aria-hidden="true"><Phone size={20} strokeWidth={2} /></span>
              <h3>Call us</h3>
              <p>Talk to the team about plants, sizes and prices.</p>
              {BUSINESS.phones.map((p) => <a key={p.tel} href={`tel:${p.tel}`}>{p.label}</a>)}
            </li>
            <li className="cp-card cp-card--feature">
              <span className="cp-card-icon" aria-hidden="true"><MessageCircle size={20} strokeWidth={2} /></span>
              <h3>WhatsApp</h3>
              <p>Send photos of your space or a plant list and we will reply there.</p>
              <a className="cp-card-cta" href={WA_LINK} target="_blank" rel="noopener noreferrer">Start a chat <ArrowUpRight size={16} aria-hidden="true" /></a>
            </li>
            <li className="cp-card">
              <span className="cp-card-icon" aria-hidden="true"><Mail size={20} strokeWidth={2} /></span>
              <h3>Email</h3>
              <p>For project briefs, plant lists and quotations.</p>
              <a className="cp-card-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
            <li className="cp-card">
              <span className="cp-card-icon" aria-hidden="true"><MapPin size={20} strokeWidth={2} /></span>
              <h3>Visit</h3>
              <p>Two nurseries: Kadiyam, near Rajahmundry, and Madhurawada, Visakhapatnam.</p>
              <a className="cp-card-cta" href="#cp-visit-title">See both addresses <ArrowRight size={16} aria-hidden="true" /></a>
            </li>
          </ul>
        </section>

        {/* enquiry form beside the visiting details */}
        <section className="cp-split" aria-label="Send an enquiry and visit the nursery">
          <form className="cp-form" onSubmit={sendWhatsApp}>
            <div className="cp-form-head">
              <span className="cp-form-badge" aria-hidden="true"><Send size={20} strokeWidth={2} /></span>
              <div>
                <p className="cp-kicker">Send an enquiry</p>
                <h2>Tell us what <em>you need.</em></h2>
              </div>
            </div>
            <p className="cp-form-note">Fill this in and it opens in WhatsApp, ready to send. Prefer email? Use the email button instead.</p>

            {/* what the enquiry is about: one tap, as chips (radio buttons underneath) */}
            <fieldset className="cp-topics">
              <legend>I’m asking about</legend>
              <div className="cp-topic-list">
                {TOPICS.map(({ label, Icon }) => (
                  <label key={label} className={`cp-topic${form.topic === label ? ' is-on' : ''}`}>
                    <input type="radio" name="topic" value={label} checked={form.topic === label} onChange={set('topic')} />
                    <Icon size={16} strokeWidth={2} aria-hidden="true" />{label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="cp-fields">
              <label className="cp-field">
                <span>Your name <b aria-hidden="true">*</b></span>
                <span className="cp-input">
                  <User size={17} strokeWidth={2} aria-hidden="true" />
                  <input type="text" name="name" autoComplete="name" required placeholder="Full name" value={form.name} onChange={set('name')} />
                </span>
              </label>
              <label className="cp-field">
                <span>Phone <i>(optional)</i></span>
                <span className="cp-input">
                  <Phone size={17} strokeWidth={2} aria-hidden="true" />
                  <input type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="+91" value={form.phone} onChange={set('phone')} />
                </span>
              </label>
              <label className="cp-field cp-field--wide">
                <span>Town or city <i>(optional)</i></span>
                <span className="cp-input">
                  <MapPin size={17} strokeWidth={2} aria-hidden="true" />
                  <input type="text" name="place" autoComplete="address-level2" placeholder="e.g. Rajahmundry" value={form.place} onChange={set('place')} />
                </span>
              </label>
              <label className="cp-field cp-field--wide">
                <span className="cp-field-row">
                  <span>Message <b aria-hidden="true">*</b></span>
                  <small className="cp-count" aria-live="polite">{form.message.length} / {MESSAGE_MAX}</small>
                </span>
                <textarea name="message" rows={5} required maxLength={MESSAGE_MAX} placeholder="Plants or services you need, quantities, sizes, your space…" value={form.message} onChange={set('message')} />
              </label>
            </div>

            <div className="cp-form-actions">
              <button type="submit" className="cp-btn cp-btn--forest cp-btn--send">
                <MessageCircle size={17} strokeWidth={2.2} aria-hidden="true" /> Send on WhatsApp <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </button>
              <a className={`cp-btn cp-btn--outline${ready ? '' : ' is-disabled'}`} href={ready ? mailHref : undefined} aria-disabled={!ready}>
                <Mail size={16} strokeWidth={2.2} aria-hidden="true" /> Send by email
              </a>
            </div>
            <p className="cp-form-privacy">
              <ShieldCheck size={15} strokeWidth={2} aria-hidden="true" />
              Nothing is stored on this site: your enquiry opens in WhatsApp or your email app, and you choose to send it.
            </p>
          </form>

          <aside className="cp-visitcard" aria-labelledby="cp-visit-title">
            <p className="cp-kicker cp-kicker--light">Visit the nursery</p>
            <h2 id="cp-visit-title">Come and <em>walk the beds.</em></h2>
            <dl className="cp-facts">
              <div><dt><Clock size={16} aria-hidden="true" />Hours</dt><dd>Open daily, 7 am – 6 pm</dd></div>
              {LOCATIONS.map((loc) => (
                <div key={loc.key}>
                  <dt><MapPin size={16} aria-hidden="true" />{loc.locality}</dt>
                  <dd><a className="cp-branch-link" href={loc.path}>{loc.cardTitle}</a><br />{formatAddress(loc)}</dd>
                </div>
              ))}
              <div><dt><Navigation size={16} aria-hidden="true" />We serve</dt><dd>Rajahmundry, Visakhapatnam and across Andhra Pradesh</dd></div>
            </dl>
            <p className="cp-visit-tip">Call ahead and we can have plants ready for you to see.</p>
            {/* one map, switched between the two nurseries */}
            <div className="cp-branch-tabs" role="group" aria-label="Show on the map">
              {LOCATIONS.map((loc, i) => (
                <button key={loc.key} type="button" className="cp-branch-tab" aria-pressed={branch === i} onClick={() => setBranch(i)}>{loc.locality}</button>
              ))}
            </div>
            <div className="cp-map">
              <iframe
                key={LOCATIONS[branch].key}
                title={`Map: ${LOCATIONS[branch].name}, ${formatAddress(LOCATIONS[branch])}`}
                src={mapEmbedUrl(LOCATIONS[branch])}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a className="cp-btn cp-btn--light" href={directionsUrl(LOCATIONS[branch])} target="_blank" rel="noopener noreferrer">
              <Navigation size={16} strokeWidth={2.2} aria-hidden="true" /> Directions to {LOCATIONS[branch].locality}
            </a>
          </aside>
        </section>

        {/* quick answers live in the home-page FAQ */}
        <a className="cp-faq" href="/?section=faq">
          <span className="cp-faq-icon" aria-hidden="true"><CircleHelp size={22} strokeWidth={2} /></span>
          <span className="cp-faq-text"><strong>Have a quick question?</strong>Delivery, bulk orders, visits and more, answered in our FAQ.</span>
          <span className="cp-faq-go">Read the FAQ <ArrowRight size={16} aria-hidden="true" /></span>
        </a>
      </main>

      <Suspense fallback={<div style={{ minHeight: 460, background: '#0f2d1b' }} aria-hidden="true" />}>
        <Footer />
      </Suspense>
      <WhatsAppButton />
    </div>
  );
}
