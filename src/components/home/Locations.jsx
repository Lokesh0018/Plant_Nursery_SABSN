import { MapPin, ArrowRight, Navigation, Store } from 'lucide-react';
import VineOrnament from '../shared/VineOrnament';
import { LOCATIONS, formatAddress, directionsUrl } from '../../data/locations';
import './Locations.css';

/*
 * Home page: OUR NURSERY LOCATIONS. One card per nursery from src/data/locations.js, each linking to its own
 * location page (the main internal link into them) and to directions. A branch with a real photograph shows it;
 * one without shows a plain forest panel rather than a borrowed picture.
 */
export default function Locations() {
  return (
    <section id="locations" className="hl-section" aria-labelledby="hl-title">
      <div className="hl-head">
        <p className="hl-kicker">Our nursery locations</p>
        <h2 id="hl-title">Visit us in <em>Kadiyam or Visakhapatnam.</em></h2>
        <VineOrnament />
        <p className="hl-lede">
          Sri Ayyappa Bala Sai Nursery (SABSN) has two nurseries in Andhra Pradesh. Visit either to see the plants,
          plan a landscape or ask about bulk orders and delivery.
        </p>
      </div>
      <ul className="hl-cards">
        {LOCATIONS.map((loc) => {
          const photo = loc.photos[0];
          return (
            <li key={loc.key} className="hl-card">
              <a className="hl-card-media" href={loc.path} tabIndex={-1} aria-hidden="true">
                {photo
                  ? <img src={photo.src} srcSet={photo.srcSet} sizes="(max-width: 860px) 92vw, 46vw" alt="" width={photo.width} height={photo.height} loading="lazy" decoding="async" />
                  : <span className="hl-card-plain"><Store size={34} strokeWidth={1.6} /></span>}
              </a>
              <div className="hl-card-body">
                {loc.headquarters && <p className="hl-tag">Headquarters</p>}
                <h3>{loc.cardTitle}</h3>
                <p className="hl-card-address"><MapPin size={16} aria-hidden="true" />{formatAddress(loc, { country: false })}</p>
                <div className="hl-card-actions">
                  <a className="hl-btn" href={loc.path}>{loc.cta} <ArrowRight size={16} aria-hidden="true" /></a>
                  <a className="hl-link" href={directionsUrl(loc)} target="_blank" rel="noopener noreferrer">
                    <Navigation size={15} aria-hidden="true" /> Directions
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
