import { categories } from '../data/content'
import Icon from './Icon'

export default function Collections({ onEnquire }) {
  return (
    <section id="collections" className="w-full bg-surface-container-low py-space-3xl">
      <div className="container-page">
        <div className="mb-space-2xl flex flex-col items-start justify-between gap-space-md md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Curated Taxonomy</span>
            <h2 className="section-title mt-space-xs">Find Your Perfect Green.</h2>
            <p className="mt-space-xs max-w-lg font-body-md text-body-md text-on-surface-variant">
              Six foundational cultivation streams cultivated under specialized microclimates, available for wholesale
              landscaping and individual estates.
            </p>
          </div>
          <div className="hidden items-center gap-space-xs font-label-caps text-label-caps uppercase text-secondary lg:flex">
            <span>Explore 6 Categories</span>
            <Icon name="arrow_downward" className="text-[16px]" />
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <li
              key={cat.title}
              className="group flex flex-col overflow-hidden rounded-xl bg-surface p-space-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-64 w-full overflow-hidden rounded-lg bg-surface-container">
                <img
                  src={cat.src}
                  alt={cat.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-space-md top-space-md rounded-md bg-surface/90 px-space-sm py-space-xs font-label-caps text-label-caps font-semibold text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="mt-space-md flex flex-1 flex-col justify-between">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary">{cat.tag}</span>
                  <h3 className="mt-space-xs font-headline-sm text-headline-sm text-primary">{cat.title}</h3>
                  <p className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant">{cat.desc}</p>
                </div>
                <a
                  href="#contact"
                  onClick={() => onEnquire(cat.enquiry)}
                  aria-label={`Enquire about ${cat.title}`}
                  className="mt-space-md inline-flex min-h-[44px] items-center gap-space-xs self-start font-label-caps text-label-caps uppercase tracking-wider text-primary transition-colors group-hover:text-secondary"
                >
                  <span>Enquire Variety</span>
                  <Icon name="arrow_forward" className="text-[16px] transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
