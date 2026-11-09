import { aboutImage, pillars } from '../data/content'
import Icon from './Icon'

export default function About() {
  return (
    <section id="about" className="w-full bg-primary py-space-3xl text-surface">
      <div className="container-page">
        <div className="grid grid-cols-1 items-stretch gap-gutter lg:grid-cols-12">
          <div className="relative min-h-[420px] overflow-hidden rounded-2xl shadow-2xl lg:col-span-5">
            <img src={aboutImage.src} alt={aboutImage.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute bottom-space-lg left-space-lg right-space-lg">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary-fixed">Kadiam Botanical Belt</span>
              <p className="font-headline-sm text-headline-sm text-surface">Rooted in Andhra’s Floriculture Heritage</p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-space-lg lg:col-span-7 lg:pl-space-md">
            <div>
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary-fixed">Rooted in Nature</span>
              <h2 className="mt-space-xs font-headline-lg text-headline-lg-mobile text-surface md:text-headline-lg">
                Growing More Than Plants. <br />
                <span className="font-normal italic text-on-primary-container">Growing Possibilities.</span>
              </h2>
              <p className="mt-space-md font-body-lg text-body-lg leading-relaxed text-surface-container-high">
                Sri Ayyappa Bala Sai Nursery is dedicated to growing and supplying quality varieties of flowers, fruit
                plants, natural trees, and lush greenery for homes, estates, agricultural landscapes, and institutional
                developments.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-space-md pt-space-xs sm:grid-cols-2">
              {pillars.map((p) => (
                <li key={p.title} className="rounded-xl bg-tertiary-container/60 p-space-lg shadow-inner">
                  <div className="mb-space-xs flex items-center gap-space-sm">
                    <Icon name={p.icon} className="text-[20px] text-secondary-fixed" />
                    <h3 className="font-title-md text-title-md text-surface">{p.title}</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-surface-container-high">{p.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
