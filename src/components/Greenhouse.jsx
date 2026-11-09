import { contact, greenhouseImage, whatsappHref } from '../data/content'
import Icon from './Icon'

export default function Greenhouse() {
  return (
    <section aria-labelledby="greenhouse-title" className="relative w-full overflow-hidden py-space-3xl">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${greenhouseImage}')` }}
        role="img"
        aria-label="Greenhouse interior with a glass canopy, sunbeams, hanging ferns and rows of potted plants."
      />
      <div className="absolute inset-0 bg-primary/75 backdrop-blur-[2px]" aria-hidden="true" />

      <div className="container-page relative">
        <div className="max-w-2xl rounded-2xl bg-surface/95 p-space-lg text-on-surface shadow-2xl backdrop-blur-md md:p-space-xl">
          <span className="eyebrow">Conservatory Atmosphere</span>
          <h2 id="greenhouse-title" className="section-title mt-space-xs">Step Into a World of Green.</h2>
          <p className="mt-space-md font-body-lg text-body-lg text-on-surface-variant">
            Explore the sheer wonder of living plants, observe rare botanical varieties, and find peaceful inspiration
            for your estate, garden, or indoor retreat.
          </p>

          <div className="mt-space-xl flex flex-wrap items-center gap-space-md">
            <a href="#contact" className="btn-primary">
              <Icon name="travel_explore" className="text-[18px]" />
              <span>Discover Our Nursery</span>
            </a>
            <a
              href={whatsappHref('Hello SABSN, I would like to plan a visit to the nursery.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-soft"
            >
              <Icon name="calendar_month" className="text-[18px]" />
              <span>Plan Your Visit</span>
            </a>
          </div>

          <div className="mt-space-lg flex flex-wrap items-center gap-x-space-md gap-y-space-xs pt-space-xs font-body-sm text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Icon name="location_on" className="text-[16px] text-secondary" />
              Kadiam Mandalam, AP
            </span>
            <span className="flex items-center gap-1">
              <Icon name="schedule" className="text-[16px] text-secondary" />
              {contact.hours}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
