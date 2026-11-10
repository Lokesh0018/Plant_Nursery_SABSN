import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
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
      <div className="archive-container">
        {/* Header */}
        <div className="archive-header">
          <div>
            <span className="archive-tagline">The Living Archive</span>
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
            <div key={index} className={`archive-item ${item.spanClass}`}>
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="archive-img"
              />
              <div className="archive-overlay" />
              <div className="archive-caption">
                <span className="archive-item-tag">{item.tag}</span>
                <p className="archive-item-title">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

