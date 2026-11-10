import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Sparkles, 
  Repeat, 
  Sprout, 
  Droplets, 
  Handshake, 
  CheckCircle2, 
  ArrowRight,
  Flower2,
  Layers,
  Wind,
  Headphones
} from 'lucide-react';
import VineOrnament from './VineOrnament';
import './PlantCare.css';

gsap.registerPlugin(ScrollTrigger);

const protocolCards = [
  {
    num: '01',
    code: 'ACCLIMATIZATION',
    title: 'Microclimate Balance',
    desc: 'Every specimen undergoes gradual shade-to-sun conditioning and Godavari riverbed humidity tapering before departing our nursery grounds.',
    tag: 'Adaptive Hardening',
    icon: Repeat,
    accentIcon: Flower2,
    badgeColor: '#4f7f3a'
  },
  {
    num: '02',
    code: 'NUTRITION',
    title: 'Bio-Dynamic Soil',
    desc: 'Formulated with indigenous vermicompost, mycorrhizal inoculants, and mineral-rich alluvial loam for robust root anchoring.',
    tag: 'Rich River Loam',
    icon: Sprout,
    accentIcon: Layers,
    badgeColor: '#7a6348'
  },
  {
    num: '03',
    code: 'HYDRATION',
    title: 'Precision Aeration',
    desc: 'Root-balls protected with breathable burlap and aerated packing to prevent moisture stress during transit and establishment.',
    tag: 'Zero Transit Shock',
    icon: Droplets,
    accentIcon: Wind,
    badgeColor: '#367a8f'
  },
  {
    num: '04',
    code: 'STEWARDSHIP',
    title: 'Lifetime Guidance',
    desc: 'Direct master horticulturist consultation and bespoke maintenance schedules for landscape architects and collectors.',
    tag: 'Ongoing Curation',
    icon: Handshake,
    accentIcon: Headphones,
    badgeColor: '#2b5a38'
  }
];

export default function PlantCare() {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const bannerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Header reveal
      gsap.fromTo('.plantcare-header-block', 
        { y: 35, opacity: 0 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play reverse play reverse'
          },
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out'
        }
      );

      // 2. Protocol Cards stagger entrance
      if (cardsRef.current) {
        gsap.fromTo(cardsRef.current.children,
          { y: 45, opacity: 0 },
          {
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 82%',
              toggleActions: 'play reverse play reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power3.out'
          }
        );
      }

      // 3. Bottom Assurance Banner entrance
      if (bannerRef.current) {
        gsap.fromTo(bannerRef.current,
          { y: 30, opacity: 0 },
          {
            scrollTrigger: {
              trigger: bannerRef.current,
              start: 'top 88%',
              toggleActions: 'play reverse play reverse'
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="plantcare-section" id="care">
      {/* Editorial Watermark & Ambient Atmosphere */}
      <div className="plantcare-watermark" aria-hidden="true">STANDARDS</div>
      <div className="plantcare-ambient-orb plantcare-ambient-orb--left" aria-hidden="true" />
      <div className="plantcare-ambient-orb plantcare-ambient-orb--right" aria-hidden="true" />

      <div className="plantcare-container">
        {/* Header Block: Title & Narrative Quote */}
        <div className="plantcare-header-block">
          <div className="plantcare-header-left">
            <div className="plantcare-tag-row">
              <Sparkles size={15} className="plantcare-tag-icon" />
              <span className="plantcare-tag-text">Horticultural Nurture &amp; Care</span>
            </div>
            <h2 className="plantcare-main-title">Expert Care Protocol</h2>
          </div>

          <div className="plantcare-header-right">
            <blockquote className="plantcare-quote-text">
              “Growing happiness, one leaf at a time.”
            </blockquote>
            <p className="plantcare-quote-subtext">
              Decades of botanical observation distilled into uncompromising standards of specimen health and longevity.
            </p>
          </div>
        </div>

        {/* Botanical Divider */}
        <VineOrnament className="plantcare-vine-flourish" />

        {/* 4-Column Protocol Grid */}
        <div ref={cardsRef} className="plantcare-protocol-grid">
          {protocolCards.map((card, idx) => {
            const Icon = card.icon;
            const AccentIcon = card.accentIcon;
            return (
              <div key={idx} className="plantcare-protocol-card">
                <div className="plantcare-card-top">
                  <div className="plantcare-code-row">
                    <span className="plantcare-code-label">{card.num} // {card.code}</span>
                    <span className="plantcare-card-icon" style={{ color: card.badgeColor }}>
                      <Icon size={20} />
                    </span>
                  </div>

                  <h3 className="plantcare-card-heading">{card.title}</h3>
                  <p className="plantcare-card-description">{card.desc}</p>
                </div>

                <div className="plantcare-card-bottom">
                  <span className="plantcare-card-tag">{card.tag}</span>
                  <span className="plantcare-card-subicon">
                    <AccentIcon size={15} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vitality Standard Bottom Assurance Banner */}
        <div ref={bannerRef} className="plantcare-assurance-banner">
          <div className="plantcare-assurance-content">
            <div className="plantcare-assurance-icon-box">
              <CheckCircle2 size={24} className="plantcare-check-icon" />
            </div>
            <div>
              <p className="plantcare-assurance-title">100% Acclimatized Vitality Standard</p>
              <p className="plantcare-assurance-subtitle">
                Backed by SABSN generational stewardship &amp; Godavari botanical heritage
              </p>
            </div>
          </div>

          <a 
            href="#contact" 
            className="plantcare-cta-btn"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Request Care Guide</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
