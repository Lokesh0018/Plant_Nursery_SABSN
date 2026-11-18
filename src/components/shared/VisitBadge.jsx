import { Clock, MapPin } from 'lucide-react';
import useOpenStatus from '../../hooks/useOpenStatus';
import './VisitBadge.css';

/*
 * The "open / hours / location" badge at the top of every page header: the live open-or-closed state (India
 * time), the daily hours and the place. One component, so every page shows the same facts the same way.
 *
 * Desktop: one glass capsule, three segments split by hairline dividers.
 * Mobile: the capsule becomes a compact card: status row on top, hours and place stacked beneath.
 */
// `place` defaults to both nurseries; a location page passes its own
export default function VisitBadge({ place = 'Kadiyam & Visakhapatnam' }) {
  const { now, label } = useOpenStatus();
  return (
    <div className={`visit-badge${now ? '' : ' is-closed'}`} role="group" aria-label="Visiting information">
      <span className="visit-badge-status">
        <span className="visit-badge-dot" aria-hidden="true" />
        <strong>{now ? 'Open now' : 'Closed now'}</strong>
        <span className="visit-badge-when">{label}</span>
      </span>

      <span className="visit-badge-item">
        <span className="visit-badge-icon" aria-hidden="true"><Clock size={13} strokeWidth={2.2} /></span>
        <span>Daily, <time dateTime="07:00">7 am</time> – <time dateTime="18:00">6 pm</time></span>
      </span>

      <span className="visit-badge-item">
        <span className="visit-badge-icon" aria-hidden="true"><MapPin size={13} strokeWidth={2.2} /></span>
        <span>{place}</span>
      </span>
    </div>
  );
}
