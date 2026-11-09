// Decorative Material Symbol; pair with visible text or an aria-label on the parent.
export default function Icon({ name, className = '' }) {
  return (
    <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>
      {name}
    </span>
  )
}
