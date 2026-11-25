import React, { useEffect, useState, lazy, Suspense } from 'react';
import { refreshScrollTriggers } from './lib/gsap';

import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import VineDivider from './components/shared/VineDivider';
import NurseryMarquee from './components/home/NurseryMarquee';
import Collection from './components/home/Collection';
import PotsCollection from './components/home/PotsCollection';
import AboutNursery from './components/home/AboutNursery';
import StorySection from './components/home/StorySection';
import WhatsAppButton from './components/layout/WhatsAppButton';
import LoadingScreen from './components/home/LoadingScreen';

// Below-the-fold sections load in their own chunks so the first paint only needs the navbar,
// hero, plant grid and the sections just beneath it.
const Services = lazy(() => import('./components/home/Services'));
const PlantCare = lazy(() => import('./components/home/PlantCare'));
const LivingArchive = lazy(() => import('./components/home/LivingArchive'));
const Locations = lazy(() => import('./components/home/Locations'));
const Faq = lazy(() => import('./components/home/Faq'));
const Contact = lazy(() => import('./components/home/Contact'));
const Footer = lazy(() => import('./components/layout/Footer'));

// Once a lazy section mounts, scroll-trigger positions of everything below it have moved.
function RefreshTriggers() {
  useEffect(() => { refreshScrollTriggers(); }, []);
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
    const t = setTimeout(refreshScrollTriggers, 300);
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
      {/* both nurseries, linking to their location pages (same ivory as the gallery above) */}
      <LazySection height="90vh" color="#F7F3EA"><Locations /></LazySection>
      {/* the gallery's ivory into the FAQ's light sage; the FAQ eases back to ivory for the contact divider */}
      <VineDivider variant="ramp" id="faq-top" from="#F7F3EA" to="#eef3e4" />
      <LazySection height="100vh" color="#eef3e4"><Faq /></LazySection>
      <VineDivider variant="contact" />
      <LazySection height="70vh" color="#c4d6bb"><Contact /></LazySection>
      <LazySection height="460px" color="#0f2d1b"><Footer /></LazySection>
      <WhatsAppButton />
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
    </div>
  );
}

export default App;
