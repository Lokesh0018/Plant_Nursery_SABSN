import { useCallback, useState } from 'react'
import About from './components/About'
import Collections from './components/Collections'
import Contact from './components/Contact'
import Favorites from './components/Favorites'
import Footer from './components/Footer'
import Founder from './components/Founder'
import Gallery from './components/Gallery'
import Greenhouse from './components/Greenhouse'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import StatementBand from './components/StatementBand'

export default function App() {
  // A fresh object each time so repeated clicks on the same card still prefill the form
  const [enquiry, setEnquiry] = useState(null)
  const handleEnquire = useCallback((category, message) => setEnquiry({ category, message }), [])

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-primary px-space-lg py-space-sm text-on-primary focus:not-sr-only focus:fixed focus:left-space-md focus:top-space-md"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="w-full bg-surface pt-20">
        <Hero />
        <StatementBand />
        <Collections onEnquire={handleEnquire} />
        <About />
        <Favorites onEnquire={handleEnquire} />
        <Services />
        <Greenhouse />
        <Founder />
        <Gallery />
        <Contact enquiry={enquiry} />
      </main>
      <Footer />
    </>
  )
}
