import { useEffect, useState } from 'react'
import { navItems } from '../data/content'
import useActiveSection from '../hooks/useActiveSection'
import Icon from './Icon'
import Logo from './Logo'

const sectionIds = navItems.map((item) => item.id)

export default function Header() {
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed top-0 z-50 w-full bg-surface/85 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-gutter">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-space-lg lg:flex">
          {navItems.map(({ id, label }) => {
            const isActive = active === id
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={isActive ? 'page' : undefined}
                className={`border-b-2 py-space-xs font-label-caps text-label-caps uppercase transition-colors duration-200 ${
                  isActive
                    ? 'border-secondary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {label}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-space-md">
          <a
            href="#contact"
            className="hidden min-h-[44px] items-center justify-center rounded-full bg-primary-container px-space-lg py-space-sm font-label-caps text-label-caps uppercase tracking-wider text-surface transition-colors duration-200 hover:bg-tertiary sm:inline-flex"
          >
            Enquire Now
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary lg:hidden"
          >
            <Icon name={open ? 'close' : 'menu'} className="text-[22px]" />
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-outline-variant/60 bg-surface lg:hidden"
        >
          <ul className="container-page flex flex-col py-space-sm">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === id ? 'page' : undefined}
                  className={`flex min-h-[48px] items-center font-label-caps text-label-caps uppercase ${
                    active === id ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="pb-space-sm pt-space-xs sm:hidden">
              <a href="#contact" onClick={() => setOpen(false)} className="btn-primary w-full">
                Enquire Now
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
