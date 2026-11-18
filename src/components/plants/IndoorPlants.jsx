import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Leaf, X, MessageCircle, Phone, LayoutGrid, Info, Check, Sprout, Sun, Droplets, TreeDeciduous } from 'lucide-react';
import { plantBenefits, plantCare } from '../../data/plantBenefits';
import './IndoorPlants.css';
import PlantFrame from '../shared/PlantFrame';
import catalogue from '../../data/plantCatalogue.json';

const plants = catalogue.find(group => group.slug === 'indoor-plants').items;

export default function IndoorPlants({ query = '', items = plants, category = 'Indoor Plants', slug = 'indoor-plants', title = 'A little green, closer to home.', subtitle = 'Thoughtful foliage for your everyday spaces.', icon: KickerIcon = Leaf }) {
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const opener = useRef(null);
  const shown = items.filter(p => `${p.name} ${p.botanical} ${category}`.toLowerCase().includes(query.trim().toLowerCase()));
  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; opener.current?.focus(); };
  }, [selected]);
  const close = () => { dialog.current?.close(); setSelected(null); };
  if (!shown.length) return null;
  return <section className="indoor-category" id={slug} aria-labelledby={`${slug}-heading`}>
    <div className="indoor-heading"><div><p className="indoor-kicker"><KickerIcon size={15} aria-hidden="true" /> {category}</p><h2 id={`${slug}-heading`}>{title}</h2><p>{subtitle}</p></div><span className="indoor-count"><strong>{shown.length}</strong>{shown.length === items.length ? '' : ` of ${items.length}`} {items.length === 1 ? 'plant' : 'plants'}</span></div>
    <div className="indoor-grid">{shown.map((plant, i) => <button className="indoor-card" key={plant.id} onClick={e => { opener.current = e.currentTarget; setSelected(plant); }} aria-label={`View ${plant.name} details`}>
      <div className="indoor-photo"><PlantFrame plant={plant} /><span className="indoor-number">{String(i + 1).padStart(2, '0')}</span>{plant.imagePresentation?.label && <span className="plant-presentation">{plant.imagePresentation.label}</span>}</div>
      <div className="indoor-card-body"><h3>{plant.name}</h3><p className="indoor-botanical">{plant.botanical}</p><p className="indoor-desc">{plant.description}</p><div className="indoor-card-foot"><span className="indoor-feature"><Leaf size={14} aria-hidden="true" />{plant.placement || plant.feature}</span><span className="indoor-more" aria-hidden="true">View details<span className="indoor-more-icon"><ArrowUpRight size={16} /></span></span></div></div>
    </button>)}</div>
    {!shown.length && <p>No plants in this category match your search.</p>}
    {selected && <dialog ref={dialog} className="indoor-dialog" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }} aria-labelledby={`${slug}-detail-name`}>
      <button className="indoor-close" onClick={close} aria-label="Close plant details"><X /></button>
      <div className="indoor-dialog-layout">
        <div className="indoor-dialog-photo">
          <PlantFrame plant={selected} />
          {selected.imagePresentation?.label && <span className="plant-presentation">{selected.imagePresentation.label}</span>}
        </div>
        <div className="indoor-details">
          <p className="indoor-kicker"><KickerIcon size={15} aria-hidden="true" /> {category}</p>
          <h2 id={`${slug}-detail-name`}>{selected.name}</h2>
          <p className="indoor-botanical">{selected.botanical}</p>
          <p className="indoor-detail-desc">{selected.description}</p>
          <dl className="indoor-facts">
            {/* the feature field sometimes only repeats the category name; that row is skipped then */}
            {selected.feature && selected.feature !== category && <div><dt><Leaf size={16} aria-hidden="true" />Foliage character</dt><dd>{selected.feature}</dd></div>}
            {selected.placement && <div><dt><LayoutGrid size={16} aria-hidden="true" />Styling idea</dt><dd>{selected.placement}</dd></div>}
          </dl>
          {/* care at a glance: fills the space above the actions without growing the dialog */}
          {(() => {
            const care = plantCare(selected, slug);
            const tiles = [[Sun, 'Sunlight', care.sun], [Droplets, 'Watering', care.water], [TreeDeciduous, 'Plant form', care.form]].filter(t => t[2]);
            return tiles.length > 0 && <div className="indoor-care" aria-label="Care at a glance">
              {tiles.map(([Icon, label, value]) => <div key={label}><span className="indoor-care-icon"><Icon size={16} aria-hidden="true" /></span><span><small>{label}</small>{value}</span></div>)}
            </div>;
          })()}
          <div className="indoor-actions">
            <a className="indoor-cta" href={`https://wa.me/919849936169?text=${encodeURIComponent(`Hello SABSN, please share availability, size, price and care guidance for ${selected.name}.`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" /> Enquire on WhatsApp</a>
            <a className="indoor-cta indoor-cta--ghost" href="tel:+919849936169"><Phone size={17} aria-hidden="true" /> Call us</a>
          </div>
          {/* the variety caveat sits with the image note as small print */}
          <p className="indoor-note"><Info size={14} aria-hidden="true" /><span>{selected.imagePresentation?.sourceType === 'photograph' || /^illustrative/i.test(selected.note || '') ? selected.note : `${selected.note ? `${selected.note} ` : ''}Illustrative image; actual nursery plants may vary.`}</span></p>
        </div>
        {/* sits under the photo on wide screens, after the details on phones */}
        {plantBenefits(selected.name, slug).length > 0 && (
          <section className="indoor-benefits" aria-labelledby={`${slug}-benefits`}>
            <h3 id={`${slug}-benefits`}><Sprout size={17} aria-hidden="true" />Why grow it</h3>
            <ul>{plantBenefits(selected.name, slug).map((b) => <li key={b}><span className="indoor-benefit-check" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>{b}</li>)}</ul>
          </section>
        )}
      </div>
    </dialog>}
  </section>;
}
