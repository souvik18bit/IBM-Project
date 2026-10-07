import { useState } from 'react'

const OFFICES = [
  { city: 'Kolkata (HQ)',  address: '10 Camac Street, Block A, 3rd Floor', phone: '+91 33 4012 5500', main: true },
  { city: 'Delhi',         address: 'Tower B, DLF Cyber City, Gurugram',   phone: '+91 11 4567 8900' },
  { city: 'Mumbai',        address: 'One BKC, G Block, Bandra Kurla Complex', phone: '+91 22 6789 0100' },
  { city: 'Chennai',       address: 'RMZ Millenia, Campus 4B, OMR',        phone: '+91 44 4321 0099' },
  { city: 'Jammu',         address: 'Rail Head Complex, Sector 5, J&K',    phone: '+91 191 246 7800' },
  { city: 'Bangalore',     address: 'Prestige Tech Park, Outer Ring Road',  phone: '+91 80 6712 3400' },
]

export default function Contact() {
  const [form, setForm]   = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent]   = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = e => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Contact Us</h2>
        <p className="page-sub">Get in touch with our team</p>
      </div>

      <div className="contact-layout">
        {/* Form */}
        <div className="contact-form-card">
          <div className="info-section-title" style={{ marginBottom: 16 }}>Send a Message</div>
          {sent ? (
            <div className="sent-banner">
              ✓ Message sent! We'll get back to you within 1–2 business days.
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <label className="form-label">Full Name
                <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="John Smith" required />
              </label>
              <label className="form-label">Email Address
                <input className="form-input" name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
              </label>
              <label className="form-label">Subject
                <input className="form-input" name="subject" value={form.subject} onChange={handle} placeholder="How can we help?" required />
              </label>
              <label className="form-label">Message
                <textarea className="form-input form-textarea" name="message" value={form.message} onChange={handle} placeholder="Write your message here…" required />
              </label>
              <button className="form-submit" type="submit">Send Message</button>
            </form>
          )}
        </div>

        {/* Office info */}
        <div className="offices">
          <div className="info-section-title" style={{ marginBottom: 16 }}>Our Offices</div>
          {OFFICES.map(o => (
            <div key={o.city} className={`office-card ${o.main ? 'office-hq' : ''}`}>
              <div className="office-city-row">
                <span className="office-city">{o.city}</span>
                {o.main && <span className="hq-badge">HQ</span>}
              </div>
              <div className="office-detail">{o.address}</div>
              <div className="office-detail" style={{ color: 'var(--accent)' }}>{o.phone}</div>
            </div>
          ))}
          <div className="office-card">
            <div className="office-city">General Enquiries</div>
            <div className="office-detail" style={{ color: 'var(--accent)' }}>hello@nexvora.io</div>
            <div className="office-detail">Mon – Fri, 9 AM – 6 PM IST</div>
          </div>
        </div>
      </div>
    </div>
  )
}
