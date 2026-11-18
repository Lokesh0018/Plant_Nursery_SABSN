import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import { ROUTES, headBlock, locationShell, SHELL_STYLE, sitemapXml } from './seo/build-seo.js'

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

// `virtual:plant-index`: each catalogue category's slug, title and plant count, a few hundred bytes. The Plants
// page header, filter chips and counts read this, so the full catalogue (a separate chunk) is only needed for the grid.
const PLANT_INDEX_ID = 'virtual:plant-index'
function plantIndex() {
  const file = new URL('./src/data/plantCatalogue.json', import.meta.url)
  return {
    name: 'plant-index',
    resolveId(id) { return id === PLANT_INDEX_ID ? '\0' + PLANT_INDEX_ID : null },
    load(id) {
      if (id !== '\0' + PLANT_INDEX_ID) return null
      this.addWatchFile(file.pathname.replace(/^\/([A-Za-z]:)/, '$1'))
      const groups = JSON.parse(readFileSync(file, 'utf8'))
      const index = groups.map((g) => ({ slug: g.slug, title: g.title, count: g.items.length }))
      return `export default ${JSON.stringify(index)}`
    },
  }
}

// Static SEO for every page. index.html carries the home page's head between the <!-- seo:start/end --> markers
// (title, description, canonical, Open Graph, Twitter, JSON-LD). After the build, each other route gets its own
// dist/<route>/index.html with its own head, the location pages also get their key content as plain HTML inside
// #root, and the build writes a real 404.html and sitemap.xml. All of it comes from src/data (see seo/build-seo.js).
const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/
// the home page's loading screen and hero preloads: stripped from every other page's copy (they only run on /)
const HOME_ONLY = /\s*<!-- (boot-loader|hero-preload):start -->[\s\S]*?<!-- \1:end -->/g
const seoBlock = (route, opts) => `<!-- seo:start -->
${headBlock(route, opts)}
    <!-- seo:end -->`
function seoPages() {
  let outDir = 'dist'
  return {
    name: 'seo-pages',
    configResolved(config) { outDir = config.build.outDir },
    transformIndexHtml(html) {
      return html.replace(SEO_BLOCK, seoBlock(ROUTES[0]))
    },
    closeBundle() {
      const indexFile = join(outDir, 'index.html')
      let html
      try { html = readFileSync(indexFile, 'utf8') } catch { return } // not a client build
      for (const route of ROUTES.slice(1)) {
        let page = html.replace(SEO_BLOCK, seoBlock(route)).replace(HOME_ONLY, '')
        if (route.location) {
          page = page.replace('</head>', `    ${SHELL_STYLE}
  </head>`).replace('<div id="root"></div>', `<div id="root">${locationShell(route)}</div>`)
        }
        const dir = join(outDir, route.path)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), page)
      }
      const notFound = { path: '/404/', title: 'Page not found | SABSN – Sri Ayyappa Bala Sai Nursery', description: 'This page could not be found. Browse the SABSN plant catalogue, our nursery locations or contact the nursery.' }
      writeFileSync(join(outDir, '404.html'), html.replace(SEO_BLOCK, seoBlock(notFound, { noindex: true })).replace(HOME_ONLY, ''))
      writeFileSync(join(outDir, 'sitemap.xml'), sitemapXml(new Date().toISOString().slice(0, 10)))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), slimPlantCatalogue(), plantIndex(), seoPages()],
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
