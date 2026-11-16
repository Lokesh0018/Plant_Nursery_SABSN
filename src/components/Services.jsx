import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, MessageCircle, BadgeCheck, X } from 'lucide-react';
import { SERVICES, SERVICE_IMAGES } from '../data/services';
import VineOrnament from './VineOrnament';
import useServiceCarousel from '../hooks/useServiceCarousel';
import './Services.css';

// How a project runs, as set out in the nursery's company profile
const WORKFLOW = [
  'Site visit and requirement collection',
  'Plant palette and material selection',
  'Quantity estimate and quotation',
  'Site preparation and civil works, where required',
  'Supply and installation',
  'Irrigation, establishment and maintenance plan',
  'Handover with care instructions',
];

// The seven steps grouped into phases (span = how many steps each covers)
const PHASES = [
  { label: 'Plan', span: 3 },
  { label: 'Build', span: 2 },
  { label: 'Care', span: 2 },
];

// true from the first time the element is seen (for one-off entrance animations)
function useSeenOnce() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') { requestAnimationFrame(() => setSeen(true)); return undefined; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

// Organisations named in the company profile among the nursery's clients
const CLIENTS = [
  { name: 'Airports Authority of India', work: 'Rajahmundry airport landscape support' },
  { name: 'Grasim Industries Ltd.', work: 'Chemical Division, Caustic Plant, Balabhadrapuram' },
  { name: 'Sri Sarvaraya Sugars Ltd.', work: 'Plant and garden requirements, Gopalapuram' },
  { name: 'Renaatus', work: 'Plant supply, gardening and maintenance' },
];

const WA_LINK = `https://wa.me/919849936169?text=${encodeURIComponent('Hello SABSN, I’d like to discuss a landscaping / garden service.')}`;

function ServiceImage({ media }) {
  return <div className="svc-card-media">
    <img className={`svc-atlas${media.sheet === 'six' ? ' svc-atlas--six' : ''} svc-atlas--${media.atlas}`}
      src={media.sheet === 'six' ? '/services/service-atlas-six.webp' : '/services/service-atlas.webp'}
      alt={media.alt} width={media.sheet === 'six' ? 1254 : 1536} height={media.sheet === 'six' ? 1254 : 1024}
      loading="lazy" decoding="async" draggable="false" />
    <span className="svc-card-category">{media.category}</span>
  </div>;
}

export default function Services() {
  const { trackRef, ...carousel } = useServiceCarousel(SERVICES.length);
  const [processRef, processIn] = useSeenOnce();
  const [recordRef, recordIn] = useSeenOnce();
  const [expanded, setExpanded] = useState(null);
  const dialogRef = useRef(null);
  // keyed on open/closed only: browsing services inside the dialog must not close and reopen it
  const isOpen = expanded !== null;
  useEffect(() => {
    if (!isOpen) return undefined;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, [isOpen]);
  const openService = (i) => { carousel.setPaused(true); setExpanded(i); };
  const toContact = (e) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="services-section" id="services" aria-labelledby="services-title">
      <div className="services-wrap">
        {/* split header: title on the left, the pitch and actions on the right */}
        <header className="services-head">
          <div>
            <p className="services-eyebrow">What we do</p>
            <h2 id="services-title" className="services-title">
              Complete <em>landscape</em> services
            </h2>
            <VineOrnament />
          </div>
          {/* the pitch: the promise, who it is for, and the two ways to start */}
          <div className="services-head-side">
            <p className="services-lede">
              From a <em>single planter</em> to a <em>full campus landscape</em>: plants, growing media,
              design, build and upkeep, all from one nursery, point to point.
            </p>
            <div className="services-for-wrap">
              <span className="services-for-label">We work with</span>
              <ul className="services-for">
                <li>Institutional</li>
                <li>Commercial</li>
                <li>Residential</li>
              </ul>
            </div>
            <div className="services-actions">
              <a className="services-btn" href="#contact" onClick={toContact}>
                Plan a project <ArrowRight className="services-btn-arrow" size={16} strokeWidth={2.2} aria-hidden="true" />
              </a>
              <a className="services-btn services-btn--ghost" href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" /> WhatsApp us
              </a>
            </div>
          </div>
        </header>

        <div className="services-catalog-heading">
          <div className="svc-catalog-title"><span>Our services</span><span>10 ways to bring your space to life</span></div>
          <span className="svc-counter"><strong>{String(carousel.index + 1).padStart(2, '0')}</strong> / 10</span>
        </div>
        <div className="svc-carousel" role="region" aria-roledescription="carousel" aria-label="Nursery services">
          <div ref={trackRef} className="svc-stage" tabIndex={0} {...carousel.interactionProps}
            aria-label="Use arrow keys to browse services, or select a card to view details.">
            {SERVICES.map(({ title, text, Icon }, i) => {
              let offset = (i - carousel.index + SERVICES.length) % SERVICES.length;
              if (offset > SERVICES.length / 2) offset -= SERVICES.length;
              const distance = Math.abs(offset);
              const active = offset === 0;
              // placement in the fan (--offset, --scale, ...) is written every frame by the carousel hook
              return <article key={title} ref={carousel.cardRef(i)} className={`svc-card${active ? ' is-active' : ''}`}
                aria-hidden={distance > 3 || undefined} inert={distance > 3 || undefined}>
                <button type="button" className="svc-card-select" tabIndex={active ? 0 : -1}
                  aria-label={active ? `View details for ${title}` : `Show ${title}`}
                  onClick={() => active ? openService(i) : carousel.goTo(i)}>
                  <ServiceImage media={SERVICE_IMAGES[i]} />
                  <span className="svc-card-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="svc-card-body">
                    <span className="svc-card-icon" aria-hidden="true"><Icon size={21} strokeWidth={1.7} /></span>
                    <h3>{title}</h3><p>{text}</p>
                    <span className="svc-card-footer"><span>Service {String(i + 1).padStart(2, '0')} / 10</span><span>{active ? 'View details' : 'Explore'} <ArrowRight size={15} aria-hidden="true" /></span></span>
                  </div>
                </button>
              </article>;
            })}
          </div>
          <div className="svc-navigation" onKeyDown={carousel.interactionProps.onKeyDown}>
            <button type="button" className="svc-arrow" onClick={() => carousel.nudge(-1)} aria-label="Previous service"><ArrowLeft size={19} /></button>
            <div className="svc-dots" role="group" aria-label="Choose a service">
              {SERVICES.map(({ title }, i) => <button type="button" key={title} className="svc-dot" aria-label={`Go to service ${i + 1}: ${title}`} aria-current={carousel.index === i ? 'true' : undefined} onClick={() => carousel.goTo(i)}><span /></button>)}
            </div>
            <button type="button" className="svc-arrow" onClick={() => carousel.nudge(1)} aria-label="Next service"><ArrowRight size={19} /></button>
          </div>
        </div>
        <dialog ref={dialogRef} className="svc-dialog" aria-labelledby="svc-dialog-title" onClose={() => { setExpanded(null); carousel.setPaused(false); }}
          onClick={event => { if (event.target === event.currentTarget) setExpanded(null); }}>
          {expanded !== null && (() => {
            const { title, text, Icon } = SERVICES[expanded];
            // browsing inside the dialog also moves the carousel, so closing lands on the same service
            const step = (d) => { const next = (expanded + d + SERVICES.length) % SERVICES.length; setExpanded(next); carousel.goTo(next); };
            return <div className="svc-dialog-content" key={expanded}>
              <ServiceImage media={SERVICE_IMAGES[expanded]} />
              <button type="button" className="svc-dialog-close" onClick={() => setExpanded(null)} aria-label="Close service details" autoFocus><X size={20} /></button>
              <div className="svc-dialog-body">
                <div className="svc-dialog-meta">
                  <span className="svc-dialog-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.8} /></span>
                  <p className="services-eyebrow">Service {String(expanded + 1).padStart(2, '0')} <span aria-hidden="true">/</span> 10</p>
                </div>
                <h3 id="svc-dialog-title">{title}</h3>
                <p className="svc-dialog-text">{text}</p>
                <div className="svc-dialog-for">
                  <span>We work with</span>
                  <ul><li>Institutional</li><li>Commercial</li><li>Residential</li></ul>
                </div>
                <div className="svc-dialog-actions">
                  <a className="services-btn" href={`https://wa.me/919849936169?text=${encodeURIComponent('Hello SABSN, I would like to enquire about ' + title + '.')}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={17} aria-hidden="true" /> Enquire on WhatsApp
                  </a>
                  <a className="services-btn services-btn--ghost" href="#contact" onClick={(e) => { setExpanded(null); toContact(e); }}>
                    Plan a project <ArrowRight className="services-btn-arrow" size={16} strokeWidth={2.2} aria-hidden="true" />
                  </a>
                </div>
                <nav className="svc-dialog-nav" aria-label="Browse services">
                  <button type="button" onClick={() => step(-1)} aria-label={`Previous service: ${SERVICES[(expanded - 1 + SERVICES.length) % SERVICES.length].title}`}><ArrowLeft size={17} aria-hidden="true" /> Previous</button>
                  <span aria-hidden="true">{String(expanded + 1).padStart(2, '0')} / 10</span>
                  <button type="button" onClick={() => step(1)} aria-label={`Next service: ${SERVICES[(expanded + 1) % SERVICES.length].title}`}>Next <ArrowRight size={17} aria-hidden="true" /></button>
                </nav>
              </div>
            </div>;
          })()}
        </dialog>

        <div ref={processRef} className={`services-process${processIn ? ' is-in' : ''}`} aria-labelledby="services-process-title">
          <div className="services-process-head">
            <p className="services-eyebrow">How we work</p>
            <h3 id="services-process-title" className="services-subtitle">From site visit to handover</h3>
          </div>
          {/* the seven steps fall into three phases; the rail draws across and each marker
              fills in turn the first time the timeline is seen */}
          <div className="services-phases" aria-hidden="true">
            {PHASES.map(({ label, span }) => (
              <span key={label} style={{ gridColumn: `span ${span}` }}>{label}</span>
            ))}
          </div>
          <ol className="services-steps">
            {WORKFLOW.map((step, i) => (
              <li key={step} className="services-step" style={{ '--i': i }}>
                <span className="services-step-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="services-step-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div ref={recordRef} className={`services-record${recordIn ? ' is-in' : ''}`} aria-labelledby="services-record-title">
          <div className="services-process-head">
            <p className="services-eyebrow">Track record</p>
            <h3 id="services-record-title" className="services-subtitle">Trusted by industry and the public sector</h3>
          </div>
          <ul className="services-clients">
            {CLIENTS.map(({ name, work }, i) => (
              <li key={name} className="services-client" style={{ '--i': i }}>
                <strong>{name}</strong>
                <span>{work}</span>
              </li>
            ))}
          </ul>
          <p className="services-registration">
            <BadgeCheck size={17} strokeWidth={2} aria-hidden="true" />
            Registered Class V Contractor, Public Health Division, Rajahmundry
          </p>
        </div>
      </div>
    </section>
  );
}
