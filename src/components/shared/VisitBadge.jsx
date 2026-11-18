import { Clock, MapPin } from 'lucide-react';
import useOpenStatus from '../../hooks/useOpenStatus';
import './VisitBadge.css';

/*
 * The "open / hours / location" badge at the top of every page header: the live open-or-closed state (India
 * time), the daily hours and the place. One component, so every page shows the same facts the same way.
 */
// `place` defaults to both nurseries; a location page passes its own
export default function VisitBadge({ place = 'Kadiyam & Visakhapatnam' }) {
  const { now } = useOpenStatus();
  return (
    <p className="visit-badge">
      <span className={`visit-badge-status${now ? '' : ' is-closed'}`}>
        <span className="visit-badge-dot" aria-hidden="true" />{now ? 'Open now' : 'Closed now'}
      </span>
      <span><Clock size={13} strokeWidth={2.2} aria-hidden="true" />Daily, 7 am – 6 pm</span>
      <span><MapPin size={13} strokeWidth={2.2} aria-hidden="true" />{place}</span>
    </p>
  );
}
