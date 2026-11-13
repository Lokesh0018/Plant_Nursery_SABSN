import React from 'react';
import { Image as ImageIcon, Camera } from 'lucide-react';
import './LivingArchive.css';

const galleryItems = [
  {
    spanClass: 'archive-col-7',
    alt: 'Abundant vibrant blooming bougainvillea climbing arches with crimson and magenta flowers in high detail natural daylight.',
    src: '/gallery/bougainvillea-1200.webp',
    srcSet: '/gallery/bougainvillea-640.webp 640w, /gallery/bougainvillea-1200.webp 900w',
    width: 900,
    height: 401,
    tag: 'Flowering Sanctuary',
    title: 'Hybrid Bougainvillea Cultivars'
  },
  {
    spanClass: 'archive-col-5',
    alt: 'Organized lines of young grafted fruit saplings in black polybags under green agro-shade netting with fresh morning irrigation droplets.',
    src: '/gallery/saplings-1200.webp',
    srcSet: '/gallery/saplings-640.webp 640w, /gallery/saplings-1200.webp 736w',
    width: 736,
    height: 455,
    tag: 'Field Rows',
    title: 'Acclimatized Grafted Fruit Saplings'
  },
  {
    spanClass: 'archive-col-4',
    alt: 'Golden late afternoon sunbeams streaming through high greenhouse glass panels highlighting tropical monsteras and palms.',
    src: '/gallery/glasshouse-1200.webp',
    srcSet: '/gallery/glasshouse-640.webp 640w, /gallery/glasshouse-1200.webp 844w',
    width: 844,
    height: 600,
    tag: 'Microclimate',
    title: 'Sunbeams through Glasshouse'
  },
  {
    spanClass: 'archive-col-4',
    alt: 'Expansive manicured garden lawn with perfectly trimmed green turf grass surrounded by artistic landscape borders.',
    src: '/gallery/lawn-1200.webp',
    srcSet: '/gallery/lawn-640.webp 640w, /gallery/lawn-1200.webp 944w',
    width: 944,
    height: 671,
    tag: 'Turf Development',
    title: 'Natural Lawn Installation'
  },
  {
    spanClass: 'archive-col-4',
    alt: 'Extreme close-up macro photograph of deep green tropical leaves with pristine crystalline morning dewdrops on delicate leaf veins.',
    src: '/gallery/dewdrops-1200.webp',
    srcSet: '/gallery/dewdrops-640.webp 640w, /gallery/dewdrops-1200.webp 1200w',
    width: 1200,
    height: 853,
    tag: 'Macro Detail',
    title: 'Dewdrops on Ornamental Foliage'
  }
];

// how wide each tile renders, so the browser picks the right srcset candidate
const SIZES = {"archive-col-7": "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, min(58vw, 790px)", "archive-col-5": "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, min(42vw, 570px)", "archive-col-4": "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, min(33vw, 450px)"};

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
              A window into our everyday cultivation, greenhouse sunlight, and acclimatized field stock.
            </p>
          </div>
          <div className="archive-location">
            <span>Kadiyam, Andhra Pradesh</span>
            <span className="archive-location-icon" aria-hidden="true">
              <ImageIcon size={16} />
            </span>
          </div>
        </div>

        {/* Asymmetrical Editorial Collage */}
        <div className="archive-grid">
          {galleryItems.map((item, index) => (
            <figure key={index} className={`archive-item ${item.spanClass}`}>
              <img
                src={item.src}
                srcSet={item.srcSet}
                sizes={SIZES[item.spanClass]}
                width={item.width}
                height={item.height}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="archive-img"
              />
              <div className="archive-overlay" />
              <figcaption className="archive-caption">
                <span className="archive-item-tag">{item.tag}</span>
                <p className="archive-item-title">{item.title}</p>
              </figcaption>
              <span className="archive-item-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

