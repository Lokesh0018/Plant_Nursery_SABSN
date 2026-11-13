import React from 'react';
import {
  Trees, Shovel, Scissors, Flower2, FlaskConical, Layers, Recycle, Amphora, BrickWall, LayoutGrid,
  ArrowRight, MessageCircle, Building, BadgeCheck,
} from 'lucide-react';
import VineOrnament from './VineOrnament';
import './Services.css';

// The nursery's ten services, in the wording the nursery chose for the website
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

export default function Services() {
  const toContact = (e) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="services-section" id="services" aria-labelledby="services-title">
      <div className="services-inner">
        <header className="services-intro">
          <p className="services-eyebrow">What we do</p>
          <h2 id="services-title" className="services-title">
            Complete <em>landscape</em> services
          </h2>
          <VineOrnament />
          <p className="services-lede">
            From a single planter to a full campus landscape: plants, growing media, design, build and
            upkeep, all from one nursery, point to point.
          </p>
          <ul className="services-for" aria-label="Who we work with">
            <li>Institutional</li>
            <li>Commercial</li>
            <li>Residential</li>
          </ul>
          <div className="services-actions">
            <a className="services-btn" href="#contact" onClick={toContact}>
              Plan a project <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </a>
            <a className="services-btn services-btn--ghost" href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" /> WhatsApp us
            </a>
          </div>
        </header>

        <ol className="services-grid">
          {SERVICES.map(({ title, text, Icon }, i) => (
            <li key={title} className="service-card">
              <div className="service-card-top">
                <span className="service-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.9} /></span>
                <span className="service-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="service-title">{title}</h3>
              <p className="service-text">{text}</p>
            </li>
          ))}
        </ol>
      </div>

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
    </section>
  );
}
