import { founder } from '../data/content'

export default function Founder() {
  return (
    <section aria-labelledby="founder-title" className="w-full bg-surface py-space-3xl">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12 lg:gap-gutter">
          <div className="flex flex-col gap-space-md lg:col-span-7">
            <span className="eyebrow">Founder &amp; Stewardship</span>
            <h2 id="founder-title" className="section-title">
              Every Plant Begins <br />
              <span className="font-normal italic text-secondary">with Care.</span>
            </h2>
            <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              A warm welcome from Sri Ayyappa Bala Sai Nursery. We believe in nurturing nature and helping every garden
              grow beautifully. Based in Kadiam — South India’s nursery capital — our focus has always been steadfast:
              healthy root systems, genuine varieties, and sincere customer guidance.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Whether you are planting a single fruiting tree for your home or acquiring saplings for acres of land, we
              dedicate ourselves to sharing robust, living botanicals that thrive for decades to come.
            </p>

            <figure className="mt-space-xs rounded-xl bg-surface-container-low p-space-md">
              <blockquote className="font-headline-sm text-title-lg italic text-primary md:text-headline-sm">
                “When you nurture soil and sapling with patience, nature returns the blessing a thousandfold.”
              </blockquote>
              <figcaption className="mt-space-xs flex flex-wrap items-center justify-between gap-space-sm">
                <span className="font-label-caps text-label-caps uppercase text-secondary">{founder.name} • Nursery Steward</span>
                <span className="font-headline-sm italic text-primary" aria-hidden="true">SABSN</span>
              </figcaption>
            </figure>
          </div>

          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="relative w-full max-w-[420px]">
              <div className="absolute -inset-3 rotate-1 rounded-2xl bg-secondary-fixed/40" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-xl bg-surface shadow-xl">
                <img src={founder.src} alt={founder.alt} loading="lazy" className="h-[460px] w-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-space-md text-surface">
                  <span className="font-label-caps text-label-caps uppercase text-secondary-fixed">Sri Ayyappa Bala Sai Nursery</span>
                  <p className="font-title-md text-title-md text-surface">Stewardship with Integrity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
