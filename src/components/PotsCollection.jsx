import React, { useRef, useLayoutEffect, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { pots } from '../data/pots';
import { Plus, Sun, Droplets } from 'lucide-react';
import VineOrnament from './VineOrnament';
const PlantModal = lazy(() => import('./PlantModal')); // only fetched when a product is opened
import './Collection.css'; // Reusing the same responsive grid layout classes

gsap.registerPlugin(ScrollTrigger);

function PotCard({ pot, onOpen }) {
  const [isHovered, React_useState] = React.useState(false);
  const setIsHovered = React_useState;

  const handleAddToCart = (e) => {
    e.stopPropagation();

    const card = e.currentTarget.closest('.pot-card');
    const img = card.querySelector('img');
    const cartIcon = document.querySelector('.cart-icon-target');

    if (!img || !cartIcon) return;

    const clone = img.cloneNode(true);
    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    clone.style.position = 'fixed';
    clone.style.top = `${imgRect.top}px`;
    clone.style.left = `${imgRect.left}px`;
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;
    clone.style.zIndex = 9999;
    clone.style.pointerEvents = 'none';
    clone.style.transform = 'none';
    clone.style.transition = 'none';
    clone.style.filter = 'drop-shadow(0 15px 15px rgba(0,0,0,0.2))';

    document.body.appendChild(clone);

    // Horizontal movement
    gsap.to(clone, {
      left: cartRect.left + cartRect.width / 2 - 15,
      width: 30,
      height: 30,
      duration: 0.9,
      ease: "power1.inOut"
    });

    // Vertical movement with a deep U-dip
    gsap.to(clone, {
      top: cartRect.top + cartRect.height / 2 - 15,
      opacity: 0.3,
      duration: 0.9,
      ease: "back.in(3)",
      onComplete: () => {
        clone.remove();

        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { item: pot, quantity: 1 } }));

        gsap.fromTo(cartIcon, { scale: 1 }, { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1 });

        setTimeout(() => {
          const badge = document.querySelector('.cart-badge');
          if (badge) {
            // pulse only: flash to pale lime and back to the badge's own green, never to forest (invisible on the dark bar)
            gsap.fromTo(badge, { scale: 1 }, { scale: 1.5, duration: 0.15, yoyo: true, repeat: 1 });
            gsap.fromTo(badge, { backgroundColor: '#f4ecd9' }, { backgroundColor: '#c9d98a', duration: 0.5, delay: 0.3 });
          }
        }, 50);
      }
    });
  };

  return (
    <article
      id={`pot-${pot.id}`}
      className={`product-card pot-card${isHovered ? ' is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => onOpen(pot, e.currentTarget)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(pot, e.currentTarget); } }}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
    >
      <div className="product-stage">
        <span className="product-stage-glow" aria-hidden="true" />
        <span className="product-stage-shadow" aria-hidden="true" />
        <img src={pot.image} alt={pot.name} className="product-img" loading="lazy" decoding="async" />
        <button className="product-add" onClick={handleAddToCart} aria-label={`Add ${pot.name} to cart`}>
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="product-body">
        <p className="product-latin">{pot.scientificName}</p>
        <h3 className="product-name">{pot.name}</h3>
        <div className="product-foot">
          <p className="product-price">₹{pot.price.toLocaleString()}</p>
          {pot.care && (
            <div className="product-care">
              <span><Sun size={11} strokeWidth={2.5} />{pot.care.light}</span>
              <span><Droplets size={11} strokeWidth={2.5} />{pot.care.water}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function PotsCollection() {
  const [selected, setSelected] = React.useState(null);
  const openPot = (pot, card) => setSelected({ product: pot, rect: card.getBoundingClientRect(), card });
  const closePot = () => { const card = selected?.card; setSelected(null); card?.focus({ preventScroll: true }); };
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const bgTextRef = useRef(null);
  const gridRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {

      // Animate background text
      gsap.fromTo(bgTextRef.current,
        { y: 250, opacity: 0, scale: 0.85 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            end: 'center center',
            scrub: 1.5
          },
          y: 0,
          opacity: 1,
          scale: 1,
          ease: 'none'
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pots-collection" ref={sectionRef} className="collection-section">
      {/* Huge background text */}
      <div ref={bgTextRef} className="collection-bg-text">
        Pots
      </div>

      <div ref={headingRef} className="collection-header">
        <span className="collection-subtitle">
          Handcrafted
        </span>
        <h2 className="collection-title">
          Ceramics
        </h2>
        <VineOrnament />
      </div>

      <div ref={gridRef} className="collection-grid">
        {pots.map(pot => (
          <PotCard key={pot.id} pot={pot} onOpen={openPot} />
        ))}
      </div>

      {selected && <Suspense fallback={null}><PlantModal product={selected.product} originRect={selected.rect} onClose={closePot} /></Suspense>}
    </section>
  );
}
