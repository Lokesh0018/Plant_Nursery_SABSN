import { useEffect } from 'react';
import { ArrowRight, MapPin, Sprout, Phone } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { LOCATIONS } from '../data/locations';
import './NotFoundPage.css';

/*
 * Any path that is not a page. The host serves this build's 404.html with a real 404 status (public/_redirects,
 * public/.htaccess); this is what it shows: where to go instead, never a silent copy of the home page.
 */
export default function NotFoundPage() {
  useEffect(() => { document.title = 'Page not found | SABSN – Sri Ayyappa Bala Sai Nursery'; }, []);
  return (
    <div className="nf-page">
      <Navbar page="notfound" />
      <main className="nf-main">
        <p className="nf-code">404</p>
        <h1>This page could not be <em>found.</em></h1>
        <p className="nf-text">The link may be old or mistyped. These will take you somewhere useful:</p>
        <ul className="nf-links">
          <li><a href="/"><Sprout size={18} aria-hidden="true" />Home <ArrowRight size={16} aria-hidden="true" /></a></li>
          <li><a href="/plants/"><Sprout size={18} aria-hidden="true" />Plant catalogue <ArrowRight size={16} aria-hidden="true" /></a></li>
          {LOCATIONS.map((l) => (
            <li key={l.key}><a href={l.path}><MapPin size={18} aria-hidden="true" />{l.cardTitle} <ArrowRight size={16} aria-hidden="true" /></a></li>
          ))}
          <li><a href="/contact/"><Phone size={18} aria-hidden="true" />Contact the nursery <ArrowRight size={16} aria-hidden="true" /></a></li>
        </ul>
      </main>
    </div>
  );
}
