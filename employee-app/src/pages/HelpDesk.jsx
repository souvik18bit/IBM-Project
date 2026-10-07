import { useState, useRef, useEffect } from 'react'

// ── Sample existing tickets ────────────────────────────────────────────
const INITIAL_TICKETS = [
  {
    id: 'TKT-001',
    subject: 'Unable to access salary reports',
    category: 'Access',
    priority: 'High',
    status: 'Open',
    date: '2025-06-10',
    messages: [
      { from: 'user', name: 'Admin User', text: 'I cannot access the salary report section. It shows a permission error.', time: '10:12 AM' },
      { from: 'support', name: 'Support Team', text: "Thanks for reaching out! We are looking into the permission settings for your account. We'll get back to you shortly.", time: '10:45 AM' },
    ],
  },
  {
    id: 'TKT-002',
    subject: 'New employee onboarding delay',
    category: 'HR',
    priority: 'Medium',
    status: 'In Progress',
    date: '2025-06-08',
    messages: [
      { from: 'user', name: 'Admin User', text: 'The onboarding documents for 3 new employees have not been sent yet.', time: '09:00 AM' },
      { from: 'support', name: 'Support Team', text: 'We have escalated this to the HR team. You will receive the documents within 24 hours.', time: '09:30 AM' },
      { from: 'user', name: 'Admin User', text: 'Thank you! Please expedite if possible.', time: '09:35 AM' },
    ],
  },
  {
    id: 'TKT-003',
    subject: 'Dashboard data not refreshing',
    category: 'Technical',
    priority: 'Low',
    status: 'Resolved',
    date: '2025-06-05',
    messages: [
      { from: 'user', name: 'Admin User', text: 'The dashboard numbers seem outdated. Last refresh was 3 days ago.', time: '02:00 PM' },
      { from: 'support', name: 'Support Team', text: 'This was a caching issue. We have cleared the cache and the dashboard should now reflect live data.', time: '03:15 PM' },
      { from: 'user', name: 'Admin User', text: 'Confirmed, it is working now. Thanks!', time: '03:20 PM' },
    ],
  },
]

const CATEGORIES = ['Technical', 'HR', 'Access', 'Payroll', 'Other']
const PRIORITIES  = ['Low', 'Medium', 'High', 'Urgent']

const STATUS_STYLE = {
  'Open':        { bg: '#dbeafe', color: '#1e40af' },
  'In Progress': { bg: '#fef3c7', color: '#92400e' },
  'Resolved':    { bg: '#d1fae5', color: '#065f46' },
  'Closed':      { bg: '#f3f4f6', color: '#6b7280' },
}

const PRIORITY_STYLE = {
  'Low':    { color: '#6b7280' },
  'Medium': { color: '#d97706' },
  'High':   { color: '#dc2626' },
  'Urgent': { color: '#7c3aed' },
}

// ── Status badge ──────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE['Closed']
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 999,
      fontSize: 11.5, fontWeight: 600,
      background: s.bg, color: s.color,
    }}>{status}</span>
  )
}

// ── New Ticket Form ───────────────────────────────────────────────────
function NewTicketForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ subject: '', category: 'Technical', priority: 'Medium', description: '' })
  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    if (!form.subject.trim() || !form.description.trim()) return
    onSubmit(form)
  }

  return (
    <div className="hd-new-form">
      <div className="hd-form-title">New Support Ticket</div>
      <form onSubmit={submit} className="hd-form">
        <label className="form-label">Subject
          <input className="form-input" name="subject" value={form.subject} onChange={set} placeholder="Brief summary of your issue" required />
        </label>
        <div className="hd-form-row">
          <label className="form-label" style={{ flex: 1 }}>Category
            <select className="dept-select" name="category" value={form.category} onChange={set}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="form-label" style={{ flex: 1 }}>Priority
            <select className="dept-select" name="priority" value={form.priority} onChange={set}>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </label>
        </div>
        <label className="form-label">Description
          <textarea
            className="form-input form-textarea"
            name="description"
            value={form.description}
            onChange={set}
            placeholder="Describe your issue in detail…"
            required
          />
        </label>
        <div className="hd-form-actions">
          <button type="button" className="crop-btn-cancel" onClick={onCancel}>Cancel</button>
          <button type="submit" className="crop-btn-confirm">Submit Ticket</button>
        </div>
      </form>
    </div>
  )
}

// ── Chat thread ───────────────────────────────────────────────────────
function TicketThread({ ticket, onBack, onReply, onClose }) {
  const [msg, setMsg] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ticket.messages])

  const send = e => {
    e.preventDefault()
    if (!msg.trim()) return
    onReply(ticket.id, msg.trim())
    setMsg('')
  }

  return (
    <div className="hd-thread">
      {/* Thread header */}
      <div className="hd-thread-header">
        <button className="hd-back-btn" onClick={onBack}>← Back</button>
        <div className="hd-thread-meta">
          <div className="hd-thread-subject">{ticket.subject}</div>
          <div className="hd-thread-info">
            <span className="hd-ticket-id">{ticket.id}</span>
            <StatusBadge status={ticket.status} />
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{ticket.date}</span>
          </div>
        </div>
        {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
          <button className="hd-close-btn" onClick={() => onClose(ticket.id)}>Mark Resolved</button>
        )}
      </div>

      {/* Messages */}
      <div className="hd-messages">
        {ticket.messages.map((m, i) => (
          <div key={i} className={`hd-bubble-wrap ${m.from === 'user' ? 'user' : 'support'}`}>
            <div className="hd-bubble-avatar">
              {m.from === 'user' ? 'AD' : 'NX'}
            </div>
            <div className="hd-bubble-body">
              <div className="hd-bubble-name">
                {m.name}
                <span className="hd-bubble-time">{m.time}</span>
              </div>
              <div className={`hd-bubble ${m.from}`}>{m.text}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply box */}
      {ticket.status !== 'Resolved' && ticket.status !== 'Closed' ? (
        <form className="hd-reply-form" onSubmit={send}>
          <textarea
            className="form-input hd-reply-input"
            placeholder="Type your reply…"
            value={msg}
            onChange={e => setMsg(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(e) } }}
            rows={3}
          />
          <button type="submit" className="hd-send-btn" disabled={!msg.trim()}>Send ↑</button>
        </form>
      ) : (
        <div className="hd-resolved-note">✓ This ticket has been resolved. <button className="hd-reopen-btn" onClick={() => onClose(ticket.id, 'reopen')}>Reopen</button></div>
      )}
    </div>
  )
}

// ── Ticket list item ──────────────────────────────────────────────────
function TicketRow({ ticket, onClick }) {
  const pr = PRIORITY_STYLE[ticket.priority] || {}
  return (
    <div className="hd-ticket-row" onClick={onClick}>
      <div className="hd-ticket-left">
        <span className="hd-ticket-id">{ticket.id}</span>
        <div className="hd-ticket-subject">{ticket.subject}</div>
        <div className="hd-ticket-tags">
          <span className="hd-tag">{ticket.category}</span>
          <span className="hd-priority" style={{ color: pr.color }}>● {ticket.priority}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{ticket.date}</span>
        </div>
      </div>
      <div className="hd-ticket-right">
        <StatusBadge status={ticket.status} />
        <span className="hd-msg-count">{ticket.messages.length} msg{ticket.messages.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}

// ── Main HelpDesk Page ────────────────────────────────────────────────
export default function HelpDesk() {
  const [tickets, setTickets]       = useState(INITIAL_TICKETS)
  const [view, setView]             = useState('list')   // 'list' | 'new' | 'thread'
  const [activeId, setActiveId]     = useState(null)
  const [filter, setFilter]         = useState('All')

  const activeTicket = tickets.find(t => t.id === activeId)

  const openTicket = id => { setActiveId(id); setView('thread') }

  const submitTicket = form => {
    const id = `TKT-${String(tickets.length + 1).padStart(3, '0')}`
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const date = now.toISOString().slice(0, 10)
    const newTicket = {
      id, subject: form.subject, category: form.category,
      priority: form.priority, status: 'Open', date,
      messages: [{ from: 'user', name: 'Admin User', text: form.description, time }],
    }
    setTickets(t => [newTicket, ...t])
    setActiveId(id)
    setView('thread')
  }

  const replyToTicket = (id, text) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setTickets(ts => ts.map(t => {
      if (t.id !== id) return t
      const userMsg  = { from: 'user',    name: 'Admin User',   text, time }
      const autoReply = { from: 'support', name: 'Support Team', text: 'Thank you for your message. A support agent will respond shortly.', time }
      return { ...t, messages: [...t.messages, userMsg, autoReply] }
    }))
  }

  const closeTicket = (id, action = 'close') => {
    setTickets(ts => ts.map(t => {
      if (t.id !== id) return t
      return { ...t, status: action === 'reopen' ? 'Open' : 'Resolved' }
    }))
  }

  const filtered = filter === 'All' ? tickets : tickets.filter(t => t.status === filter)

  const counts = {
    All: tickets.length,
    Open: tickets.filter(t => t.status === 'Open').length,
    'In Progress': tickets.filter(t => t.status === 'In Progress').length,
    Resolved: tickets.filter(t => t.status === 'Resolved').length,
  }

  if (view === 'thread' && activeTicket) {
    return (
      <div className="page">
        <TicketThread
          ticket={activeTicket}
          onBack={() => setView('list')}
          onReply={replyToTicket}
          onClose={closeTicket}
        />
      </div>
    )
  }

  if (view === 'new') {
    return (
      <div className="page">
        <div className="page-header">
          <h2 className="page-title">Help Desk</h2>
          <p className="page-sub">Submit and track your support requests</p>
        </div>
        <NewTicketForm onSubmit={submitTicket} onCancel={() => setView('list')} />
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Help Desk</h2>
        <p className="page-sub">Submit and track your support requests</p>
      </div>

      {/* Stats row */}
      <div className="hd-stats-row">
        {Object.entries(counts).map(([label, count]) => (
          <div
            key={label}
            className={`hd-stat-chip ${filter === label ? 'active' : ''}`}
            onClick={() => setFilter(label)}
          >
            <span className="hd-stat-count">{count}</span>
            <span className="hd-stat-label">{label}</span>
          </div>
        ))}
        <button className="hd-new-btn" onClick={() => setView('new')}>+ New Ticket</button>
      </div>

      {/* Ticket list */}
      <div className="hd-list">
        {filtered.length === 0 ? (
          <div className="hd-empty">No {filter !== 'All' ? filter.toLowerCase() : ''} tickets found.</div>
        ) : filtered.map(t => (
          <TicketRow key={t.id} ticket={t} onClick={() => openTicket(t.id)} />
        ))}
      </div>
    </div>
  )
}
