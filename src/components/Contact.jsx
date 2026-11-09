import { useEffect, useRef, useState } from 'react'
import { contact, enquiryOptions, telHref, whatsappHref } from '../data/content'
import Icon from './Icon'

const emptyForm = { name: '', phone: '', category: enquiryOptions[0].value, message: '' }

function ContactRow({ icon, label, children }) {
  return (
    <div className="flex items-center gap-space-sm rounded-xl bg-tertiary-container/70 p-space-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
        <Icon name={icon} className="text-[20px]" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="font-label-caps text-label-caps uppercase text-on-primary-container">{label}</span>
        {children}
      </div>
    </div>
  )
}

export default function Contact({ enquiry }) {
  const [form, setForm] = useState(emptyForm)
  const [sent, setSent] = useState(false)
  const timer = useRef()

  // Prefill when a visitor clicks "Enquire" / "Reserve" elsewhere on the page
  useEffect(() => {
    if (!enquiry) return
    setForm((f) => ({
      ...f,
      category: enquiry.category ?? f.category,
      message: enquiry.message ?? f.message,
    }))
  }, [enquiry])

  useEffect(() => () => clearTimeout(timer.current), [])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = [
      'Hello SABSN, I have an enquiry.',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Interested in: ${form.category}`,
      form.message && `Requirements: ${form.message}`,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(whatsappHref(text), '_blank', 'noopener,noreferrer')
    setForm(emptyForm)
    setSent(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setSent(false), 7000)
  }

  return (
    <section id="contact" className="w-full bg-primary-container py-space-3xl text-surface">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-space-xl lg:col-span-5">
            <div className="flex flex-col gap-space-md">
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-primary-container">
                Let’s Grow Together
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile text-surface md:text-headline-lg">
                Bring a Little More Green Into Your Life.
              </h2>
              <p className="font-body-lg text-body-lg text-surface-container-high">
                Looking for quality plants, orchard saplings, or wholesale landscape solutions? Get in touch directly
                with our nursery team.
              </p>

              <address className="mt-space-sm flex flex-col gap-space-sm not-italic">
                <ContactRow icon="phone" label="Phone Numbers">
                  <div className="flex flex-wrap gap-x-3 font-body-md font-medium text-surface">
                    {contact.phones.map((phone, i) => (
                      <span key={phone} className="flex gap-x-3">
                        {i > 0 && <span aria-hidden="true">/</span>}
                        <a href={telHref(phone)} className="transition-colors hover:text-secondary-fixed">
                          {phone}
                        </a>
                      </span>
                    ))}
                  </div>
                </ContactRow>
                <ContactRow icon="mail" label="Email Address">
                  <a
                    href={`mailto:${contact.email}`}
                    className="break-all font-body-md font-medium text-surface transition-colors hover:text-secondary-fixed"
                  >
                    {contact.email}
                  </a>
                </ContactRow>
                <ContactRow icon="location_on" label="Sanctuary Location">
                  <span className="font-body-sm text-body-sm text-surface-container-high">{contact.address}</span>
                </ContactRow>
              </address>
            </div>

            <div className="flex flex-wrap gap-space-sm pt-space-xs">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#25D366] py-space-sm font-bold text-[#072412] shadow-md hover:brightness-105"
              >
                <Icon name="chat" className="text-[18px]" />
                <span>WhatsApp Enquiry</span>
              </a>
              <a
                href={telHref(contact.phones[0])}
                className="btn bg-surface py-space-sm text-primary shadow-sm hover:bg-surface-container-low"
              >
                <Icon name="call" className="text-[18px]" />
                <span>Call the Nursery</span>
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-surface p-space-lg text-on-surface shadow-2xl md:p-space-xl lg:col-span-7">
            <div className="mb-space-lg">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary">Direct Dispatch</span>
              <h3 className="mt-space-xs font-headline-sm text-headline-sm text-primary">Send Botanical Enquiry</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                We respond with availability, photos, and transport quotations within 24 hours.
              </p>
            </div>

            <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
                <div className="flex flex-col gap-space-xs">
                  <label htmlFor="contact-name" className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Your Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={update('name')}
                    placeholder="e.g. Rajesh Varma"
                    className="field"
                  />
                </div>
                <div className="flex flex-col gap-space-xs">
                  <label htmlFor="contact-phone" className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Phone Number / WhatsApp
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    pattern="[+0-9\s\-]{10,16}"
                    title="Enter a 10-digit mobile number, optionally with +91"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="e.g. +91 98499 00000"
                    className="field"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label htmlFor="contact-category" className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                  Interested Category / Service
                </label>
                <select id="contact-category" value={form.category} onChange={update('category')} className="field">
                  {enquiryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label htmlFor="contact-message" className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                  Message &amp; Requirements
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Tell us about the varieties you are seeking, quantity needed, or destination city..."
                  className="field"
                />
              </div>

              <button type="submit" className="btn-primary mt-space-sm">
                <Icon name="send" className="text-[18px]" />
                <span>Send Botanical Enquiry</span>
              </button>
            </form>

            <div role="status" aria-live="polite">
              {sent && (
                <div className="mt-space-md flex items-center gap-space-sm rounded-xl bg-secondary-container/60 p-space-md text-on-secondary-fixed-variant">
                  <Icon name="check_circle" className="text-[20px]" />
                  <span className="font-body-md font-medium">
                    Thank you! WhatsApp has opened with your enquiry — tap send and our nursery manager will reach out
                    shortly.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
