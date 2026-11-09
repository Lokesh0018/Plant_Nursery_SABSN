import Icon from './Icon'

export default function StatementBand() {
  return (
    <section aria-label="Our philosophy" className="w-full bg-primary-container py-space-lg text-surface shadow-inner">
      <div className="container-page flex items-center justify-center gap-space-lg text-center md:justify-between">
        <span className="hidden items-center gap-space-xs font-label-caps text-label-caps uppercase tracking-widest text-on-primary-container md:inline-flex">
          <Icon name="park" className="text-[16px]" />
          Horticultural Tradition
        </span>
        <p className="font-headline-sm text-title-lg italic tracking-wide text-surface md:text-headline-sm">
          “Nurturing Botanical Excellence Across Generations.”
        </p>
        <span className="hidden items-center gap-space-xs font-label-caps text-label-caps uppercase tracking-widest text-on-primary-container md:inline-flex">
          Andhra Pradesh, India
          <Icon name="south_east" className="text-[16px]" />
        </span>
      </div>
    </section>
  )
}
