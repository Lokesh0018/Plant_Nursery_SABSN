import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sprout, Shovel, Trees, Flower2, PhoneCall, Mail, Sparkles, MapPin } from 'lucide-react';
import './AboutNursery.css';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Flower2,
    title: 'Hybrid Flowering Plants',
    desc: 'Exotic bougainvilleas, hibiscus, jasmine & fragrant ornamental cultivars'
  },
  {
    icon: Trees,
    title: 'Green Field & Avenue Trees',
    desc: 'Monumental avenue trees, royal palms & landscape canopy foliage'
  },
  {
    icon: Shovel,
    title: 'Landscaping & Garden Design',
    desc: 'Bespoke residential sanctuaries, farmhouses & commercial greening'
  },
  {
    icon: Sprout,
    title: 'Grafted Fruit & Revenue Flora',
    desc: 'High-yield mango, guava, coconut & commercial agricultural saplings'
  }
];

export default function AboutNursery() {
  const containerRef = useRef(null);
  const imageFrameRef = useRef(null);
  const imageRef = useRef(null);
  const textColRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Image Parallax
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          },
          y: '8%',
          ease: 'none'
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="about-nursery-section" id="about">
      {/* Background Ambience */}
      <div className="about-nursery-watermark" aria-hidden="true">KADIYAM</div>
      <div className="about-nursery-glow-1" aria-hidden="true" />
      <div className="about-nursery-glow-2" aria-hidden="true" />

      {/* Decorative Botanical Corner Leaves, matching the founder section */}
      <div className="about-corner-leaf about-corner-leaf-top" aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C40 20 80 60 120 120C60 100 20 60 0 0Z" fill="currentColor" />
        </svg>
      </div>
      <div className="about-corner-leaf about-corner-leaf-bottom" aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C40 20 80 60 120 120C60 100 20 60 0 0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="about-nursery-container">
        {/* Editorial Top Bar */}
        <div className="about-nursery-topbar">
          <div className="about-nursery-pill">
            <Sparkles size={13} className="about-nursery-pill-icon" />
            <span>Green Plants • Healthy Life • Happy Life</span>
          </div>
          <div className="about-nursery-location">
            <MapPin size={13} />
            <span>Jakkampudi Nagar, Kadiyam, East Godavari</span>
          </div>
        </div>

        <div className="about-nursery-grid">
          {/* Left Column: Image with Glass Frame and Organic Floating Badge */}
          <div className="about-nursery-image-col" ref={imageFrameRef}>
            <div className="about-nursery-frame-outer">
              <div className="about-nursery-frame-inner">
                <div className="about-nursery-img-wrapper">
                  <img
                    ref={imageRef}
                    src="/nursery.webp"
                    srcSet="/nursery-800.webp 800w, /nursery.webp 1200w"
                    sizes="(max-width: 768px) 92vw, min(50vw, 680px)"
                    width="1200"
                    height="673"
                    alt="Lush botanical acreage at Sri Ayyappa Bala Sai Nursery in Kadiyam"
                    className="about-nursery-img"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="about-nursery-img-overlay" />

                  {/* Floating Acreage Badge */}
                  <div className="about-nursery-floating-badge">
                    <span className="about-badge-val">20 Acres</span>
                    <span className="about-badge-lbl">Combined nursery footprint</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-tag row below image */}
            <div className="about-nursery-tags">
              <span className="about-tag-item">Hybrid</span>
              <span className="about-tag-dot">•</span>
              <span className="about-tag-item">Grafted Fruits</span>
              <span className="about-tag-dot">•</span>
              <span className="about-tag-item">Avenue Trees</span>
              <span className="about-tag-dot">•</span>
              <span className="about-tag-item">Lawn Turf</span>
            </div>
          </div>

          {/* Right Column: Narrative & Service Cards */}
          <div className="about-nursery-text-col" ref={textColRef}>
            <div className="about-nursery-headings">
              <span className="about-eyebrow">Botanical Legacy &amp; Infrastructure</span>
              <h2 className="about-title">
                Grown with care, <br />
                <span className="about-title-italic">planted with purpose.</span>
              </h2>
            </div>

            <p className="about-lead">
              Nestled in the lush alluvial soil of the Godavari delta, Sri Ayyappa Bala Sai Nursery (SABSN) is one of Kadiyam’s premier botanical destinations. We raise rare hybrid flowering varieties, grafted fruit saplings, exotic foliage, and commercial plantation flora nurtured to flourish across diverse Indian climates.
            </p>

            <p className="about-secondary">
              Beyond supply, our 50+ strong team handles landscaping, garden establishment, planting and ongoing maintenance for corporate, public-sector and private clients. Our mission: the right plant for every site, with coordinated service from supply through establishment and care.
            </p>

            {/* Service Pillars */}
            <div className="about-services-grid">
              {services.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="about-service-card">
                    <div className="about-service-icon-box">
                      <Icon size={18} />
                    </div>
                    <div className="about-service-info">
                      <strong className="about-service-title">{item.title}</strong>
                      <p className="about-service-desc">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct Contacts & Actions */}
            <div className="about-actions-row">
              <a
                href="https://wa.me/919849936169"
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-btn about-contact-btn--primary"
              >
                <PhoneCall size={15} />
                <span>+91 98499 36169</span>
              </a>
              <a
                href="mailto:uppadakumaraswamy@gmail.com"
                className="about-contact-btn about-contact-btn--secondary"
              >
                <Mail size={15} />
                <span>uppadakumaraswamy@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

