import { useEffect, useRef } from 'react'
import { heroStats } from '../data/content'
import Icon from './Icon'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4'

const FADE_SECONDS = 0.5

/**
 * Seamless manual loop: the video fades in over the first 0.5s, fades out over the
 * last 0.5s, and on `ended` is dimmed, rewound after 100ms, then replayed.
 */
function useFadeLoop(videoRef) {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      // Static first frame for users who prefer less motion.
      video.pause()
      video.style.opacity = '1'
      return
    }

    let frame = 0
    let resetTimer = 0

    const tick = () => {
      const { currentTime, duration } = video
      if (Number.isFinite(duration) && duration > 0) {
        let opacity = 1
        if (currentTime < FADE_SECONDS) {
          opacity = currentTime / FADE_SECONDS
        } else if (duration - currentTime < FADE_SECONDS) {
          opacity = Math.max(0, (duration - currentTime) / FADE_SECONDS)
        }
        video.style.opacity = opacity.toFixed(3)
      }
      frame = requestAnimationFrame(tick)
    }

    const onEnded = () => {
      video.style.opacity = '0'
      resetTimer = window.setTimeout(() => {
        video.currentTime = 0
        video.play().catch(() => {})
      }, 100)
    }

    video.addEventListener('ended', onEnded)
    video.play().catch(() => {})
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(resetTimer)
      video.removeEventListener('ended', onEnded)
    }
  }, [videoRef])
}

export default function Hero() {
  const videoRef = useRef(null)
  useFadeLoop(videoRef)

  return (
    <section id="home" className="relative min-h-[calc(100svh-5rem)] w-full overflow-hidden bg-surface">
      {/* Background video layer */}
      <div className="pointer-events-none absolute z-0" style={{ inset: 'auto 0 0 0', top: '300px' }} aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video h-full w-full object-cover opacity-0"
          src={HERO_VIDEO}
          muted
          playsInline
          autoPlay
          preload="metadata"
          disablePictureInPicture
          tabIndex={-1}
        />
        {/* Gradient overlays: ivory at the top (text zone) and bottom (section seam) */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/10 to-transparent" />
      </div>

      {/* Hero content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center px-6 pb-40 text-center"
        style={{ paddingTop: 'calc(8rem - 75px)' }}
      >
        <div className="animate-fade-rise mb-8 inline-flex items-center gap-space-sm rounded-full bg-surface/80 px-space-md py-space-xs shadow-sm ring-1 ring-outline-variant/40 backdrop-blur-md">
          <Icon name="eco" className="text-[15px] text-primary" />
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary">
            Sri Ayyappa Bala Sai Nursery • Kadiam
          </span>
        </div>

        <h1
          className="animate-fade-rise font-display max-w-7xl text-5xl font-normal text-primary sm:text-7xl md:text-8xl"
          style={{ lineHeight: 0.95, letterSpacing: '-2.46px' }}
        >
          Beyond <em className="font-normal italic text-secondary">the soil,</em> we grow{' '}
          <em className="font-normal italic text-secondary">what lasts.</em>
        </h1>

        <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
          Flowering, fruit, ornamental and timber plants, thoughtfully cultivated and acclimated in Kadiam. From a single
          sapling to a full estate landscape, we help brilliant gardens take root.
        </p>

        <div className="animate-fade-rise-delay-2 mt-12 flex flex-wrap items-center justify-center gap-space-md">
          <a
            href="#collections"
            className="inline-flex min-h-[44px] items-center gap-space-sm rounded-full bg-primary-container px-14 py-5 font-label-caps text-base font-medium tracking-wide text-surface shadow-md transition-[transform,background-color,box-shadow] duration-200 hover:scale-[1.03] hover:bg-tertiary hover:shadow-lg motion-reduce:hover:scale-100"
          >
            <span>Explore Our Plants</span>
            <Icon name="arrow_forward" className="text-[18px]" />
          </a>
          <a
            href="#contact"
            className="inline-flex min-h-[44px] items-center gap-space-sm rounded-full bg-surface/80 px-8 py-5 font-label-caps text-base font-medium tracking-wide text-primary shadow-sm ring-1 ring-outline-variant/50 backdrop-blur-md transition-colors duration-200 hover:bg-surface"
          >
            <Icon name="pin_drop" className="text-[18px]" />
            <span>Visit Our Nursery</span>
          </a>
        </div>

        <dl className="animate-fade-rise-delay-3 mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {heroStats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-space-xs">
              <dd className="order-first font-display text-4xl text-primary md:text-5xl">{stat.value}</dd>
              <dt className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
