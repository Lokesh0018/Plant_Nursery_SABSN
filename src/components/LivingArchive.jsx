import React from 'react';
import { Image as ImageIcon, Camera } from 'lucide-react';
import './LivingArchive.css';

const galleryItems = [
  {
    spanClass: 'archive-col-7',
    alt: 'Abundant vibrant blooming bougainvillea climbing arches with crimson and magenta flowers in high detail natural daylight.',
    src: 'https://i.pinimg.com/1200x/8d/98/5e/8d985e0230d28d8344e90034d9ddefc7.jpg',
    tag: 'Flowering Sanctuary',
    title: 'Hybrid Bougainvillea Cultivars'
  },
  {
    spanClass: 'archive-col-5',
    alt: 'Organized lines of young grafted fruit saplings in black polybags under green agro-shade netting with fresh morning irrigation droplets.',
    src: 'https://i.pinimg.com/736x/9d/21/7f/9d217f98a496c53ffb368c996dce5985.jpg',
    tag: 'Field Rows',
    title: 'Acclimatized Grafted Fruit Saplings'
  },
  {
    spanClass: 'archive-col-4',
    alt: 'Golden late afternoon sunbeams streaming through high greenhouse glass panels highlighting tropical monsteras and palms.',
    src: 'https://i.pinimg.com/1200x/60/f4/27/60f42722f7e92d50978ec77237a59363.jpg',
    tag: 'Microclimate',
    title: 'Sunbeams through Glasshouse'
  },
  {
    spanClass: 'archive-col-4',
    alt: 'Expansive manicured garden lawn with perfectly trimmed green turf grass surrounded by artistic landscape borders.',
    src: 'https://i.pinimg.com/1200x/fa/84/75/fa8475007bce228742a6f28534df88b1.jpg',
    tag: 'Turf Development',
    title: 'Natural Lawn Installation'
  },
  {
    spanClass: 'archive-col-4',
    alt: 'Extreme close-up macro photograph of deep green tropical leaves with pristine crystalline morning dewdrops on delicate leaf veins.',
    src: 'https://i.pinimg.com/1200x/c5/3f/83/c53f833968c43d8b7e94f1819e1b0bbe.jpg',
    tag: 'Macro Detail',
    title: 'Dewdrops on Ornamental Foliage'
  }
];

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
            <span>Kadiam, Andhra Pradesh</span>
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
                alt={item.alt}
                loading="lazy"
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

