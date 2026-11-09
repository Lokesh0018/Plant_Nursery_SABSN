import { logo } from '../data/content'

export default function Logo() {
  return (
    <a href="#home" className="flex items-center gap-space-md rounded-lg" aria-label="SABSN — back to top">
      <img src={logo} alt="" className="h-8 w-auto object-contain" />
      <span className="flex flex-col">
        <span className="font-headline-sm text-headline-sm leading-none tracking-tight text-primary">SABSN</span>
        <span className="hidden font-label-caps text-[0.65rem] uppercase tracking-widest text-secondary sm:block">
          Sri Ayyappa Bala Sai Nursery
        </span>
      </span>
    </a>
  )
}
