import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Leaf, X, MessageCircle } from 'lucide-react';
import './IndoorPlants.css';
import PlantFrame from './PlantFrame';

const plants = [
  { id: 'mickey-green', name: 'Mickey Green', botanical: 'Peperomia tetraphylla', description: 'Small rounded leaves and delicate trailing stems bring a soft green accent to shelves and tabletops.', feature: 'Delicate trailing foliage', placement: 'Shelves & tabletops', note: 'Botanical name confirmed in the nursery company profile.' },
  { id: 'peperomia', name: 'Peperomia', botanical: 'Peperomia species', description: 'A compact foliage plant with rounded, glossy leaves for a fresh accent in smaller indoor spaces.', feature: 'Compact glossy foliage', placement: 'Desks & small spaces', note: 'Image represents Peperomia obtusifolia. Confirm the available variety with the nursery.' },
  { id: 'alocasia', name: 'Alocasia', botanical: 'Alocasia species', description: 'Bold arrow-shaped leaves and expressive veins create a sculptural focal point in an indoor plant collection.', feature: 'Sculptural statement leaves', placement: 'Indoor feature displays', note: 'Leaf shape and colour vary by cultivar. Ask the nursery to confirm the available selection.' },
];

export default function IndoorPlants({ query = '', items = plants, category = 'Indoor Plants', slug = 'indoor-plants', title = 'A little green, closer to home.', subtitle = 'Thoughtful foliage for your everyday spaces.' }) {
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
    <div className="indoor-heading"><div><p className="indoor-kicker"><Leaf size={15} /> {category}</p><h2 id={`${slug}-heading`}>{title}</h2><p>{category} · {subtitle}</p></div><span className="indoor-count">{shown.length} / {items.length} plants</span></div>
    <div className="indoor-grid">{shown.map((plant, i) => <button className="indoor-card" key={plant.id} onClick={e => { opener.current = e.currentTarget; setSelected(plant); }} aria-label={`View ${plant.name} details`}>
      <div className="indoor-photo"><PlantFrame plant={plant} /><span className="indoor-number">{String(i + 1).padStart(2, '0')}</span></div>
      <div className="indoor-card-body"><span className="indoor-kicker">{category}</span><h3>{plant.name}</h3><span className="plant-presentation">{plant.imagePresentation?.label}</span><p className="indoor-botanical">{plant.botanical}</p><p>{plant.description}</p><div className="indoor-card-foot"><span>{plant.feature}</span><ArrowUpRight size={20} /></div></div>
    </button>)}</div>
    {!shown.length && <p>No plants in this category match your search.</p>}
    {selected && <dialog ref={dialog} className="indoor-dialog" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }} aria-labelledby={`${slug}-detail-name`}>
      <button className="indoor-close" onClick={close} aria-label="Close plant details"><X /></button>
      <div className="indoor-dialog-layout"><PlantFrame plant={selected} /><div className="indoor-details"><p className="indoor-kicker">{category}</p><h2 id={`${slug}-detail-name`}>{selected.name}</h2><p className="indoor-botanical">{selected.botanical}</p><p className="plant-presentation">{selected.imagePresentation?.label}</p><p>{selected.description}</p><dl><dt>Foliage character</dt><dd>{selected.feature}</dd><dt>Styling idea</dt><dd>{selected.placement}</dd><dt>Variety details</dt><dd>{selected.note}</dd></dl><a href={`https://wa.me/919849936169?text=${encodeURIComponent(`Hello SABSN, please share availability, size, price and care guidance for ${selected.name}.`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Enquire about this plant</a><p className="indoor-note">Illustrative image; actual nursery plants may vary.</p></div></div>
    </dialog>}
  </section>;
}
