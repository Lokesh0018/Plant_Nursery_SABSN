import { useState } from 'react'
import { favorites } from '../data/content'
import Icon from './Icon'

const specs = [
  ['Family', 'family'],
  ['Sunlight', 'sun'],
  ['Soil Type', 'soil'],
  ['Growth Habit', 'growth'],
]

export default function Favorites({ onEnquire }) {
  const [index, setIndex] = useState(0)
  const current = favorites[index]

  return (
    <section aria-labelledby="favorites-title" className="w-full bg-surface-container-low py-space-3xl">
      <div className="container-page">
        <div className="mb-space-xl flex flex-col items-center text-center">
          <span className="eyebrow">Seasonal Botanical Spotlight</span>
          <h2 id="favorites-title" className="section-title mt-space-xs">Nursery Favorites</h2>
          <p className="mt-space-xs max-w-lg font-body-md text-body-md text-on-surface-variant">
            Standout cultivars and specimens currently flourishing in our main greenhouses.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-gutter rounded-2xl bg-surface p-space-lg shadow-md md:p-space-xl lg:grid-cols-12">
          <div className="flex flex-col gap-space-lg lg:col-span-6" aria-live="polite">
            <div className="flex flex-wrap items-center gap-space-sm">
              <span className="rounded-full bg-secondary-container px-space-sm py-space-xs font-label-caps text-label-caps uppercase text-on-secondary-container">
                Botanical Specimen
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">• High Demand Stock</span>
            </div>

            <h3 className="font-display-lg text-headline-lg-mobile text-primary md:text-headline-lg">{current.name}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">{current.desc}</p>

            <dl className="grid grid-cols-2 gap-x-space-sm gap-y-space-md rounded-xl bg-surface-container-low p-space-md">
              {specs.map(([label, key]) => (
                <div key={key} className="flex flex-col">
                  <dt className="font-label-caps text-label-caps uppercase text-secondary">{label}</dt>
                  <dd className="font-body-md font-medium text-primary">{current[key]}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
              <a href="#contact" onClick={() => onEnquire(current.enquiry, `I would like to reserve: ${current.name}`)} className="btn-primary">
                <Icon name="shopping_bag" className="text-[18px]" />
                <span>Reserve Specimen</span>
              </a>
              <span className="font-label-caps text-label-caps text-secondary">Fresh Stock Ready</span>
            </div>
          </div>

          <div className="flex flex-col gap-space-md lg:col-span-6">
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-surface-container shadow-md sm:h-[380px]">
              <img
                key={index}
                src={current.image ?? current.thumb}
                alt={current.alt}
                loading="lazy"
                className="h-full w-full animate-[fadeIn_400ms_ease-out] object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-space-sm" role="group" aria-label="Choose a specimen">
              {favorites.map((fav, i) => {
                const selected = i === index
                return (
                  <button
                    key={fav.short}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-pressed={selected}
                    className={`overflow-hidden rounded-lg bg-surface-container-high p-1 text-left transition-all duration-200 hover:bg-surface-container-highest ${
                      selected ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <div className="h-16 w-full overflow-hidden rounded">
                      <img src={fav.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <span className={`mt-1 block truncate font-label-sm text-label-sm ${selected ? 'text-primary' : 'text-on-surface'}`}>
                      {fav.short}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
