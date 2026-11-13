import React from 'react';
import {
  Trees, Shovel, Scissors, Flower2, FlaskConical, Layers, Recycle, Amphora, BrickWall, LayoutGrid,
  ArrowRight, MessageCircle,
} from 'lucide-react';
import VineOrnament from './VineOrnament';
import NurseryMarquee from './NurseryMarquee';
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

      <NurseryMarquee />
    </section>
  );
}
