import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { faqJsonLd } from './src/data/faqs.js'

const BACKSLASH = String.fromCharCode(92)

// The plant catalogue carries review notes for each image (reviewReason, identityStatus, maturity, ...)
// that the site never shows. Keep only the image fields the Plants page reads, so they stay out of the bundle.
const CATALOGUE_IMAGE_FIELDS = ['label', 'growthForm', 'cellAspectRatio']
function slimPlantCatalogue() {
  return {
    name: 'slim-plant-catalogue',
    enforce: 'pre',
    transform(code, id) {
      if (!id.split('?')[0].endsWith('plantCatalogue.json')) return null
      const groups = JSON.parse(code)
      for (const group of groups) {
        for (const item of group.items) {
          const ip = item.imagePresentation
          if (!ip) continue
          item.imagePresentation = Object.fromEntries(CATALOGUE_IMAGE_FIELDS.filter((k) => k in ip).map((k) => [k, ip[k]]))
        }
      }
      return { code: JSON.stringify(groups), map: null }
    },
  }
}

// The home-page FAQ as schema.org FAQPage JSON-LD in the static HTML, so answer engines and crawlers
// that do not run JavaScript still read the questions and answers (same source as Faq.jsx)
function faqStructuredData() {
  return {
    name: 'faq-structured-data',
    transformIndexHtml() {
      return [{ tag: 'script', attrs: { type: 'application/ld+json', 'data-faq': '' }, children: JSON.stringify(faqJsonLd()), injectTo: 'head' }]
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), slimPlantCatalogue(), faqStructuredData()],
  build: {
    target: 'es2020', // no legacy transforms; every supported browser handles this natively
    rollupOptions: {
      output: {
        // vendor code in its own hashed chunks so it stays cached across app deploys
        manualChunks(id) {
          const path = id.split(BACKSLASH).join('/')
          if (!path.includes('/node_modules/')) return undefined
          if (
            path.includes('/node_modules/react/') ||
            path.includes('/node_modules/react-dom/') ||
            path.includes('/node_modules/scheduler/')
          ) return 'react'
          if (path.includes('/node_modules/gsap/')) return 'gsap'
          return 'vendor'
        },
      },
    },
  },
})
