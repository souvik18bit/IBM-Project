import { useState, useRef, useEffect } from 'react'
import employees from './employees'

// ── System context fed to Gemini ──────────────────────────────────────
const SYSTEM_PROMPT = `You are Nex, a friendly and knowledgeable AI assistant for Nexvora — a technology company based in India.

Your job is to help employees and admins with any questions about the company, its people, data, or tools.

Here is the complete Nexvora employee data:
${JSON.stringify(employees, null, 2)}

Company facts:
- Company name: Nexvora
- Founded: 2015
- Mission: Build exceptional products and foster a diverse, inclusive workplace
- Total employees: 15
- Departments: Engineering (5), Marketing (2), Finance (2), Sales (2), Design (2), Human Resources (2)
- Offices: Kolkata HQ (10 Camac Street), Delhi (DLF Cyber City), Mumbai (One BKC), Chennai (RMZ Millenia), Jammu (Rail Head Complex), Bangalore (Prestige Tech Park)
- Email: hello@nexvora.io | Phone: +91 33 4012 5500
- Average salary: $85,400 | Highest: $120,000 (Jane Doe) | Lowest: $60,000 (David Taylor)
- Currency used in system: USD

App features: Dashboard (charts & KPIs), Employees table (sortable/filterable), Profile (photo upload), Settings, About Us, Contact Us, and this chat assistant.

Guidelines:
- Be concise, friendly, and helpful
- Use bullet points and bold text (**text**) where it improves readability
- If asked about a specific employee, provide their details from the data
- If you don't know something, say so honestly and suggest contacting hello@nexvora.io
- Do not make up data not present above
- Keep responses under 200 words unless the question requires more detail`

// ── Call Gemini API (tries v1beta with key, falls back to v1 with Bearer) ───
async function callGemini(history, userMessage) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('NO_KEY')

  const contents = [
    { role: 'user',  parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: "Understood! I'm Nex, Nexvora's AI assistant. Ready to help!" }] },
    ...history.map(m => ({
      role: m.from === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ]

  // Try 1: API key in query param (works for AIza keys)
  const urls = [
    { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, auth: null },
    { url: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, auth: null },
    // Try 2: OAuth Bearer token (works for AQ. keys)
    { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, auth: `Bearer ${apiKey}` },
    { url: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`, auth: `Bearer ${apiKey}` },
  ]

  let lastErr = null
  for (const { url, auth } of urls) {
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (auth) headers['Authorization'] = auth
      const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ contents }) })
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        lastErr = errBody?.error?.message || `HTTP ${res.status}`
        continue
      }
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) return text
    } catch (e) {
      lastErr = e.message
    }
  }
  throw new Error(lastErr || 'All endpoints failed')
}

// ── Fallback KB (used when no API key is set) ─────────────────────────
const KB = [
  { keys: ['hello','hi','hey'], answer: "Hello! 👋 I'm **Nex**, your Nexvora assistant.\n\nAsk me anything about employees, salaries, offices, or the app!" },
  { keys: ['employee','staff','how many'], answer: "Nexvora has **15 employees** across 6 departments.\n\nCheck the **Employees** page for the full table." },
  { keys: ['salary','pay','wage'], answer: "Salary range at Nexvora:\n• **Highest:** $120,000 — Jane Doe\n• **Lowest:** $60,000 — David Taylor\n• **Average:** $85,400" },
  { keys: ['office','location','city'], answer: "Nexvora has **6 offices**:\n🏢 Kolkata HQ, Delhi, Mumbai, Chennai, Jammu, Bangalore" },
  { keys: ['contact','email'], answer: "📧 **hello@nexvora.io**\n📞 +91 33 4012 5500" },
  { keys: ['thank','thanks','bye'], answer: "You're welcome! 😊 Feel free to ask anything else." },
]

function fallback(input) {
  const q = input.toLowerCase()
  for (const e of KB) { if (e.keys.some(k => q.includes(k))) return e.answer }
  return "I'm not connected to AI right now.\n\nTo enable the full AI assistant, add your **Gemini API key** to `.env`:\n```\nVITE_GEMINI_API_KEY=your_key_here\n```\nGet a free key at **aistudio.google.com**"
}

// ── Render message text (bold + newlines) ─────────────────────────────
function MsgText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : p.split('\n').map((line, j, arr) => (
              <span key={`${i}-${j}`}>{line}{j < arr.length - 1 && <br />}</span>
            ))
      )}
    </span>
  )
}

// ── Typing indicator ──────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="cb-bubble bot">
      <span className="cb-typing"><span /><span /><span /></span>
    </div>
  )
}

// ── Stylish chat icon SVG ─────────────────────────────────────────────
function ChatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 2C7.477 2 3 6.03 3 11c0 2.56 1.11 4.87 2.9 6.54L5 22l4.8-2.4A11.3 11.3 0 0013 20c5.523 0 10-4.03 10-9S18.523 2 13 2z"
        fill="white"
        opacity="0.95"
      />
      <circle cx="9" cy="11" r="1.5" fill="#3b82d4" />
      <circle cx="13" cy="11" r="1.5" fill="#3b82d4" />
      <circle cx="17" cy="11" r="1.5" fill="#3b82d4" />
    </svg>
  )
}

const SUGGESTIONS = [
  'Who earns the most?',
  'List all departments',
  'Kolkata office address',
  'Average salary?',
  'Who works in Design?',
  'Total payroll cost?',
]

// ── Main Chatbot Widget ───────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen]     = useState(false)
  const [msgs, setMsgs]     = useState([
    { from: 'bot', text: "Hi! 👋 I'm **Nex**, your Nexvora AI assistant.\n\nI know everything about this company — employees, salaries, offices, and more. Ask me anything!" }
  ])
  const [input, setInput]   = useState('')
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const [hasKey]            = useState(() => !!import.meta.env.VITE_GEMINI_API_KEY)
  const bottomRef           = useRef(null)
  const inputRef            = useRef(null)
  const historyRef          = useRef([])   // conversation history for Gemini context

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 150) }
  }, [open])

  const sendMessage = async (text = input.trim()) => {
    if (!text || typing) return
    const userMsg = { from: 'user', text }
    setMsgs(m => [...m, userMsg])
    setInput('')
    setTyping(true)
    historyRef.current = [...historyRef.current, userMsg]

    try {
      let reply
      if (hasKey) {
        reply = await callGemini(historyRef.current.slice(0, -1), text)
      } else {
        await new Promise(r => setTimeout(r, 800))
        reply = fallback(text)
      }
      const botMsg = { from: 'bot', text: reply }
      historyRef.current = [...historyRef.current, botMsg]
      setTyping(false)
      setMsgs(m => [...m, botMsg])
      if (!open) setUnread(u => u + 1)
    } catch (err) {
      setTyping(false)
      let errMsg
      if (err.message === 'NO_KEY') {
        errMsg = "Please set `VITE_GEMINI_API_KEY` in your `.env.local` file."
      } else {
        errMsg = `⚠️ API Error: ${err.message}\n\nThe API key may be invalid. Please get a fresh key from **aistudio.google.com** — it should start with **AIza**.`
      }
      setMsgs(m => [...m, { from: 'bot', text: errMsg }])
    }
  }

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <>
      {open && (
        <div className="cb-window">
          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-bot-avatar">
                <svg width="18" height="18" viewBox="0 0 26 26" fill="none">
                  <path d="M13 2C7.477 2 3 6.03 3 11c0 2.56 1.11 4.87 2.9 6.54L5 22l4.8-2.4A11.3 11.3 0 0013 20c5.523 0 10-4.03 10-9S18.523 2 13 2z" fill="white" opacity="0.9"/>
                  <circle cx="9" cy="11" r="1.4" fill="#3b82d4"/>
                  <circle cx="13" cy="11" r="1.4" fill="#3b82d4"/>
                  <circle cx="17" cy="11" r="1.4" fill="#3b82d4"/>
                </svg>
              </div>
              <div>
                <div className="cb-bot-name">Nex {hasKey && <span className="cb-ai-badge">AI</span>}</div>
                <div className="cb-bot-status"><span className="cb-online-dot" />Always online</div>
              </div>
            </div>
            <button className="cb-close-btn" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="cb-messages">
            {msgs.map((m, i) => (
              <div key={i} className={`cb-row ${m.from}`}>
                {m.from === 'bot' && <div className="cb-avatar-sm">NX</div>}
                <div className={`cb-bubble ${m.from}`}><MsgText text={m.text} /></div>
              </div>
            ))}
            {typing && (
              <div className="cb-row bot">
                <div className="cb-avatar-sm">NX</div>
                <TypingDots />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="cb-suggestions">
            {SUGGESTIONS.map(s => (
              <button key={s} className="cb-chip" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>

          {/* Input */}
          <div className="cb-input-row">
            <textarea
              ref={inputRef}
              className="cb-input"
              placeholder={hasKey ? 'Ask anything about Nexvora…' : 'Ask a question…'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
            />
            <button className="cb-send-btn" onClick={() => sendMessage()} disabled={!input.trim() || typing}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12l7-7 7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Stylish FAB ── */}
      <button className="cb-fab" onClick={() => setOpen(o => !o)} title="Chat with Nex">
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          : <ChatIcon />
        }
        {!open && unread > 0 && <span className="cb-badge">{unread}</span>}
        {!open && <span className="cb-fab-pulse" />}
      </button>
    </>
  )
}
