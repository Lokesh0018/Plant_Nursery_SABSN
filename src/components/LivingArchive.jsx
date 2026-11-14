import React from 'react';
import { Image as ImageIcon, Camera, ArrowRight } from 'lucide-react';
import { galleryItems } from '../data/gallery';
import './LivingArchive.css';

// The home page shows the five featured photos; the rest live on the /gallery page.
const FEATURED = galleryItems.filter((g) => g.featured).sort((a, b) => a.featured - b.featured);
const SPANS = [7, 5, 4, 4, 4];

// how wide each tile renders, so the browser picks the right srcset candidate
const SIZES = {"archive-col-7": "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, min(58vw, 790px)", "archive-col-5": "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, min(42vw, 570px)", "archive-col-4": "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, min(33vw, 450px)", "archive-col-12": "(max-width: 640px) 92vw, min(92vw, 1280px)"};

export default function LivingArchive() {
  return (
    <section className="archive-section" id="gallery">
      {/* Editorial Watermark & Ambient Atmosphere */}
      <div className="archive-watermark" aria-hidden="true">ARCHIVE</div>
      <div className="archive-ambient-orb archive-ambient-orb--left" aria-hidden="true" />
      <div className="archive-ambient-orb archive-ambient-orb--right" aria-hidden="true" />

      {/* Decorative Botanical Corner Leaves, matching the About, founder and care sections */}
      <div className="archive-corner-leaf archive-corner-leaf-top" aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C40 20 80 60 120 120C60 100 20 60 0 0Z" fill="currentColor" />
        </svg>
      </div>
      <div className="archive-corner-leaf archive-corner-leaf-bottom" aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C40 20 80 60 120 120C60 100 20 60 0 0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="archive-container">
        {/* Header */}
        <div className="archive-header">
          <div>
            <span className="archive-tagline">
              <Camera size={14} className="archive-tagline-icon" />
              The Living Archive
            </span>
            <h2 className="archive-heading">Glimpses of Greenery</h2>
            <p className="archive-subtext">
              Our nursery stock, the landscapes we look after, and the clients and partners we work with.
            </p>
          </div>
          <div className="archive-location">
            <span>Kadiyam, Andhra Pradesh</span>
            <span className="archive-location-icon" aria-hidden="true">
              <ImageIcon size={16} />
            </span>
          </div>
        </div>

        {/* asymmetrical editorial collage of the featured five */}
        <div className="archive-grid">
          {FEATURED.map((item, index) => {
            const spanClass = `archive-col-${SPANS[index]}`;
            return (
              <figure key={item.src} className={`archive-item ${spanClass}`} style={{ '--i': index }}>
                <img
                  src={item.src}
                  sizes={SIZES[spanClass]}
                  width={item.width}
                  height={item.height}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  className="archive-img"
                  style={item.pos ? { objectPosition: item.pos } : undefined}
                />
                <div className="archive-overlay" />
                <figcaption className="archive-caption">
                  <span className="archive-item-tag">{item.tag}</span>
                  <p className="archive-item-title">{item.title}</p>
                </figcaption>
                <span className="archive-item-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </figure>
            );
          })}
        </div>

        <div className="archive-more">
          <a className="archive-more-link" href="/gallery">
            View the full gallery <span className="archive-more-count">{galleryItems.length} photos</span>
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

