import React, { useEffect, useState, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VineDivider from './components/VineDivider';
import NurseryMarquee from './components/NurseryMarquee';
import Collection from './components/Collection';
import PotsCollection from './components/PotsCollection';
import AboutNursery from './components/AboutNursery';
import StorySection from './components/StorySection';
import WhatsAppButton from './components/WhatsAppButton';
import LoadingScreen from './components/LoadingScreen';

// Below-the-fold sections load in their own chunks so the first paint only needs the navbar,
// hero, plant grid and the sections just beneath it.
const Services = lazy(() => import('./components/Services'));
const PlantCare = lazy(() => import('./components/PlantCare'));
const LivingArchive = lazy(() => import('./components/LivingArchive'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

// Once a lazy section mounts, scroll-trigger positions of everything below it have moved.
function RefreshTriggers() {
  useEffect(() => { ScrollTrigger.refresh(); }, []);
  return null;
}

// Reserve roughly the section's height in its own base colour while the chunk loads, so the page
// neither jumps nor flashes.
function LazySection({ height, color, children }) {
  return (
    <Suspense fallback={<div style={{ minHeight: height, background: color }} aria-hidden="true" />}>
      {children}
      <RefreshTriggers />
    </Suspense>
  );
}

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);

  // Arriving from another page with /?section=<id>: once the loader hands over, scroll there. The
  // lower sections are lazy chunks, so wait (briefly) for the target to exist.
  useEffect(() => {
    if (loading) return undefined;
    const id = new URLSearchParams(window.location.search).get('section');
    if (!id) return undefined;
    window.history.replaceState(null, '', '/');
    let tries = 0;
    const tid = setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 40) {
        clearInterval(tid);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 75);
    return () => clearInterval(tid);
  }, [loading]);

  useEffect(() => {
    // Recalculate scroll positions once hero images have had a moment to lay out
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="app-container" style={{ backgroundColor: 'var(--color-sage-green)', position: 'relative' }}>
      <Navbar />
      <Hero />
      {/* sections follow the navbar: Home, About, Plants, Services, Pots, Gallery (then Contact) */}
      <VineDivider />
      <AboutNursery />
      <StorySection />
      <NurseryMarquee />
      <Collection />
      <VineDivider variant="bottom" />
      <LazySection height="120vh" color="#d4e2ca"><Services /></LazySection>
      <LazySection height="110vh" color="#cbdcc1"><PlantCare /></LazySection>
      <VineDivider variant="care" />
      <PotsCollection />
      <VineDivider variant="pots" />
      <LazySection height="120vh" color="#F7F3EA"><LivingArchive /></LazySection>
      <VineDivider variant="contact" />
      <LazySection height="70vh" color="#c4d6bb"><Contact /></LazySection>
      <LazySection height="460px" color="#0f2d1b"><Footer /></LazySection>
      <WhatsAppButton />
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
    </div>
  );
}

export default App;
