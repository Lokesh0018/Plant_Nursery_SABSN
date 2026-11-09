import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from './hooks/useSmoothScroll';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VineDivider from './components/VineDivider';
import Collection from './components/Collection';
import PotsHero from './components/PotsHero';
import PotsCollection from './components/PotsCollection';
import StorySection from './components/StorySection';
import PlantCare from './components/PlantCare';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useSmoothScroll();

  useEffect(() => {
    // Recalculate scroll positions once hero images have had a moment to lay out
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="app-container" style={{ backgroundColor: 'var(--color-sage-green)', position: 'relative' }}>
      <Navbar />
      <Hero />
      <VineDivider />
      <Collection />
      <PotsHero />
      <PotsCollection />
      <StorySection />
      <PlantCare />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;
