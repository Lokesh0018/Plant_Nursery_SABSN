import { gallery } from '../data/content'
import Icon from './Icon'

export default function Gallery() {
  return (
    <section id="gallery" className="w-full bg-surface-container-low py-space-3xl">
      <div className="container-page">
        <div className="mb-space-2xl flex flex-col items-start justify-between gap-space-md sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">The Living Archive</span>
            <h2 className="section-title mt-space-xs">Glimpses of Greenery</h2>
            <p className="mt-space-xs max-w-lg font-body-md text-body-md text-on-surface-variant">
              A window into our everyday cultivation, greenhouse sunlight, and acclimatized field stock.
            </p>
          </div>
          <div className="flex items-center gap-space-xs font-label-caps text-label-caps uppercase text-secondary">
            <span>Kadiam, Andhra Pradesh</span>
            <Icon name="photo_library" className="text-[16px]" />
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-12">
          {gallery.map((item) => (
            <li key={item.caption} className={`group relative overflow-hidden rounded-xl bg-surface shadow-sm ${item.span}`}>
              <figure className="h-full">
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Captions always visible on touch screens; revealed on hover for large pointers */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100"
                  aria-hidden="true"
                />
                <figcaption className="absolute bottom-space-md left-space-md right-space-md text-surface transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
                  <span className="font-label-caps text-label-caps uppercase text-secondary-fixed">{item.tag}</span>
                  <p className="font-title-md text-title-md text-surface">{item.caption}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
