import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '../data/products';
import PlantModal from './PlantModal';
import { Plus, Sun, Droplets } from 'lucide-react';
import VineOrnament from './VineOrnament';
import './Collection.css';

gsap.registerPlugin(ScrollTrigger);

function ProductCard({ product, onOpen }) {
  const [isHovered, React_useState] = React.useState(false);
  const setIsHovered = React_useState;

  const handleAddToCart = (e) => {
    e.stopPropagation();

    const card = e.currentTarget.closest('.product-card');
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
      ease: "back.in(3)", // Causes it to move downwards first before shooting up
      onComplete: () => {
        clone.remove();

        // Tell the Navbar to increment the cart
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { item: product, quantity: 1 } }));

        gsap.fromTo(cartIcon, { scale: 1 }, { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1 });

        // Wait a tiny bit for React to render the badge if it's the first item
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
      id={`product-${product.id}`}
      className={`product-card${isHovered ? ' is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => onOpen(product, e.currentTarget)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(product, e.currentTarget); } }}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
    >
      {/* Stage: every plant stands on the same ground line, whatever its height */}
      <div className="product-stage">
        <span className="product-stage-glow" aria-hidden="true" />
        <span className="product-stage-shadow" aria-hidden="true" />
        <img src={product.image} alt={product.name} className="product-img" loading="lazy" decoding="async" />
        <button className="product-add" onClick={handleAddToCart} aria-label={`Add ${product.name} to cart`}>
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="product-body">
        <p className="product-latin">{product.scientificName}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-foot">
          <p className="product-price">₹{product.price.toLocaleString()}</p>
          {product.care && (
            <div className="product-care">
              <span><Sun size={11} strokeWidth={2.5} />{product.care.light}</span>
              <span><Droplets size={11} strokeWidth={2.5} />{product.care.water}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Collection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const bgTextRef = useRef(null);
  const gridRef = useRef(null);
  const [selected, setSelected] = React.useState(null); // { product, rect, card }

  const openProduct = (product, card) => {
    setSelected({ product, rect: card.getBoundingClientRect(), card });
  };
  const closeProduct = () => {
    const card = selected?.card;
    setSelected(null);
    card?.focus({ preventScroll: true }); // return focus to where the user was
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {

      // Animate background text "Plant" - scrubbed parallax effect
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
    <section id="collection" ref={sectionRef} className="collection-section">
      {/* Huge background text */}
      <div ref={bgTextRef} className="collection-bg-text">
        Plant
      </div>

      <div ref={headingRef} className="collection-header">
        <span className="collection-subtitle">
          Our Curated
        </span>
        <h2 className="collection-title">
          Select
        </h2>
        <VineOrnament />
        <p className="collection-lede">
          Healthy, nursery-raised plants chosen for homes and gardens, each with its light and water needs at a glance.
        </p>
      </div>

      <div ref={gridRef} className="collection-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onOpen={openProduct} />
        ))}
      </div>

      {selected && <PlantModal product={selected.product} originRect={selected.rect} onClose={closeProduct} />}
    </section>
  );
}
