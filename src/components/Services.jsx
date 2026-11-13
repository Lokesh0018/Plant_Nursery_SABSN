import React, { useEffect, useRef, useState } from 'react';
import {
  Trees, Shovel, Scissors, Flower2, FlaskConical, Layers, Recycle, Amphora, BrickWall, LayoutGrid,
  ArrowRight, ArrowLeft, MessageCircle, Building, BadgeCheck, X,
} from 'lucide-react';
import VineOrnament from './VineOrnament';
import useServiceCarousel from '../hooks/useServiceCarousel';
import './Services.css';

// The nursery's ten services, each with a relevant local image.
const SERVICES = [
  { title: 'Garden Design & Landscaping', text: 'Professional garden planning, landscape development and ongoing garden care for institutional, commercial and residential spaces.', Icon: Trees },
  { title: 'Plant Supply & Installation', text: 'Supply and professional planting of trees, shrubs, ornamental plants and garden materials tailored to project requirements.', Icon: Shovel },
  { title: 'Lawn Development & Maintenance', text: 'Lawn planning, ground preparation, grass installation, routine maintenance and upkeep of established green spaces.', Icon: Scissors },
  { title: 'Flowers, Shrubs & Ornamental Plants', text: 'Supply of flowering plants, ornamental shrubs, seasonal annuals and decorative plant varieties for gardens and landscapes.', Icon: Flower2 },
  { title: 'Plant Research, Breeding & Development', text: 'Research, testing and development of new plant varieties, cultivation techniques and improved nursery growing practices.', Icon: FlaskConical },
  { title: 'Cocopeat & Coco Fibre Supply', text: 'Quality growing media and coco-based products for nursery propagation, potting applications and professional soil-mix preparation.', Icon: Layers },
  { title: 'Organic Compost & Soil Conditioner Supply', text: 'Supply of organic compost and soil-enrichment materials to improve soil structure, planting conditions and plant growth.', Icon: Recycle },
  { title: 'Plant Pots, Planters & Containers', text: 'Wide selection of indoor and outdoor pots, decorative planters and functional containers in different materials, designs and sizes.', Icon: Amphora },
  { title: 'Landscape Civil Works & Infrastructure', text: 'Execution of landscape-related civil works, including pathways, paving, garden edging, raised planters, site preparation and supporting infrastructure.', Icon: BrickWall },
  { title: 'Vertical Garden Design, Installation & Maintenance', text: 'Customized vertical garden planning, installation, planting arrangements, irrigation integration and ongoing maintenance.', Icon: LayoutGrid },
];

// Original generated service illustrations, stored in two local image atlases.
const SERVICE_IMAGES = [
  { atlas: 'landscape', sheet: 'six', alt: 'Illustration of a designed tropical garden with curved beds and a seating area', category: 'Design & build' },
  { atlas: 'planting', sheet: 'six', alt: 'Illustration of a gardener planting a young tree beside nursery shrubs', category: 'Plants & planting' },
  { atlas: 'lawn', sheet: 'six', alt: 'Illustration of a lawnmower maintaining a neatly edged green lawn', category: 'Garden care' },
  { atlas: 'flowers', sheet: 'six', alt: 'Illustration of flowering hibiscus, bougainvillea, marigolds and ornamental crotons', category: 'Plants & planting' },
  { atlas: 'research', alt: 'Illustration of seedling trials and plant tissue-culture vessels in a greenhouse', category: 'Research & growing' },
  { atlas: 'cocopeat', alt: 'Illustration of compressed cocopeat bricks and loose coconut fibres', category: 'Growing essentials' },
  { atlas: 'compost', sheet: 'six', alt: 'Illustration of organic compost in a burlap sack with a soil scoop', category: 'Growing essentials' },
  { atlas: 'planters', sheet: 'six', alt: 'Illustration of terracotta, ceramic and stone planters in a range of sizes', category: 'Garden essentials' },
  { atlas: 'civil', alt: 'Illustration of a stone garden pathway, masonry edging and raised planting beds', category: 'Design & build' },
  { atlas: 'vertical', alt: 'Illustration of a vertical garden filled with ferns and trailing foliage', category: 'Design & build' },
];

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

// Organisations named in the company profile among the nursery's clients
const CLIENTS = [
  { name: 'Airports Authority of India', work: 'Visakhapatnam airport landscape support' },
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
  const [expanded, setExpanded] = useState(null);
  const dialogRef = useRef(null);
  useEffect(() => {
    if (expanded === null) return undefined;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, [expanded]);
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
          {expanded !== null && <div className="svc-dialog-content">
            <ServiceImage media={SERVICE_IMAGES[expanded]} />
            <button type="button" className="svc-dialog-close" onClick={() => setExpanded(null)} aria-label="Close service details" autoFocus><X size={21} /></button>
            <div className="svc-dialog-body"><p className="services-eyebrow">Service {String(expanded + 1).padStart(2, '0')} / 10</p>
              <h3 id="svc-dialog-title">{SERVICES[expanded].title}</h3><p>{SERVICES[expanded].text}</p>
              <a className="services-btn" href={`https://wa.me/919849936169?text=${encodeURIComponent('Hello SABSN, I would like to enquire about ' + SERVICES[expanded].title + '.')}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> Enquire about this service <ArrowRight size={17} /></a>
            </div>
          </div>}
        </dialog>

        <div className="services-process" aria-labelledby="services-process-title">
          <div className="services-process-head">
            <p className="services-eyebrow">How we work</p>
            <h3 id="services-process-title" className="services-subtitle">From site visit to handover</h3>
          </div>
          <ol className="services-steps">
            {WORKFLOW.map((step, i) => (
              <li key={step} className="services-step">
                <span className="services-step-num" aria-hidden="true">{i + 1}</span>
                <span className="services-step-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="services-record" aria-labelledby="services-record-title">
          <div className="services-process-head">
            <p className="services-eyebrow">Track record</p>
            <h3 id="services-record-title" className="services-subtitle">Trusted by industry and the public sector</h3>
          </div>
          <ul className="services-clients">
            {CLIENTS.map(({ name, work }) => (
              <li key={name} className="services-client">
                <Building size={20} strokeWidth={1.8} aria-hidden="true" />
                <div>
                  <strong>{name}</strong>
                  <span>{work}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="services-registration">
            <BadgeCheck size={18} strokeWidth={2} aria-hidden="true" />
            Registered Class V Contractor, Public Health Division, Rajamahendravaram
          </p>
        </div>
      </div>
    </section>
  );
}
