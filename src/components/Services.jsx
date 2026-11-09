import { services } from '../data/content'
import Icon from './Icon'

export default function Services() {
  return (
    <section id="services" className="w-full bg-surface py-space-3xl">
      <div className="container-page">
        <div className="mb-space-2xl max-w-2xl">
          <span className="eyebrow">Comprehensive Horticultural Expertise</span>
          <h2 className="section-title mt-space-xs">Bringing Nature to Every Space.</h2>
          <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">
            Comprehensive botanical propagation, specialized commercial supply, and bespoke green development tailored
            to your geographical requirements.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-gutter md:grid-cols-2">
          {services.map((s, i) => (
            <li key={s.title} className="flex items-start gap-space-md rounded-xl bg-surface-container-low p-space-lg shadow-sm">
              <span className="font-display-lg text-headline-sm font-medium text-secondary" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-primary">{s.title}</h3>
                <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">{s.desc}</p>
                <p className="mt-space-sm flex items-start gap-space-xs font-label-sm text-label-sm text-secondary">
                  <Icon name="check_circle" className="text-[16px]" />
                  <span>{s.highlight}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
