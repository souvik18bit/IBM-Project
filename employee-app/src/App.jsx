import { useState, useMemo, useEffect } from 'react'
import employees from './employees'
import Dashboard from './Dashboard'
import Sidebar from './Sidebar'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import About from './pages/About'
import Contact from './pages/Contact'
import Chatbot from './Chatbot'
import './App.css'

// ── Theme Toggle ───────────────────────────────────────────────────────
function ThemeToggle({ dark, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle} aria-label="Toggle theme">
      <span className="toggle-track">
        <span className="toggle-thumb">{dark ? '🌙' : '☀️'}</span>
      </span>
      {dark ? 'Dark' : 'Light'}
    </button>
  )
}

// ── Dept badge colors ──────────────────────────────────────────────────
const DEPT_COLORS = {
  Engineering:      { bg: '#dbeafe', color: '#1e40af' },
  Marketing:        { bg: '#fef3c7', color: '#92400e' },
  Finance:          { bg: '#d1fae5', color: '#065f46' },
  Sales:            { bg: '#ede9fe', color: '#5b21b6' },
  Design:           { bg: '#fce7f3', color: '#9d174d' },
  'Human Resources':{ bg: '#e0f2fe', color: '#0c4a6e' },
}

const COLUMNS = [
  { key: 'id',         label: '#' },
  { key: 'firstName',  label: 'First Name' },
  { key: 'lastName',   label: 'Last Name' },
  { key: 'department', label: 'Department' },
  { key: 'jobTitle',   label: 'Job Title' },
  { key: 'salary',     label: 'Salary' },
  { key: 'email',      label: 'Email' },
  { key: 'location',   label: 'Location' },
]

// ── Sort Icon ──────────────────────────────────────────────────────────
function SortIcon({ direction }) {
  if (!direction) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>
  return <span style={{ marginLeft: 4 }}>{direction === 'asc' ? '↑' : '↓'}</span>
}

// ── Employee Table ─────────────────────────────────────────────────────
function EmployeeTable() {
  const [search, setSearch]         = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [sortKey, setSortKey]       = useState('id')
  const [sortDir, setSortDir]       = useState('asc')

  const departments = useMemo(() => ['All', ...new Set(employees.map(e => e.department)).values()].sort(), [])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return employees
      .filter(e => deptFilter === 'All' || e.department === deptFilter)
      .filter(e =>
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.jobTitle.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const va = a[sortKey]
        const vb = b[sortKey]
        const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb))
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [search, deptFilter, sortKey, sortDir])

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Employees</h2>
        <p className="page-sub">All staff records</p>
      </div>
      <div className="controls">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name, title, email, location…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="dept-select"
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
        >
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
        <span className="result-count">Showing {filtered.length} of {employees.length}</span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)} className="sortable">
                  {col.label}
                  <SortIcon direction={sortKey === col.key ? sortDir : null} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px' }}>No employees found.</td></tr>
            ) : filtered.map(e => {
              const badge = DEPT_COLORS[e.department] || { bg: '#f3f4f6', color: '#374151' }
              return (
                <tr key={e.id}>
                  <td className="td-id">{e.id}</td>
                  <td>{e.firstName}</td>
                  <td>{e.lastName}</td>
                  <td>
                    <span className="badge" style={{ background: badge.bg, color: badge.color }}>
                      {e.department}
                    </span>
                  </td>
                  <td>{e.jobTitle}</td>
                  <td className="td-salary">${e.salary.toLocaleString()}</td>
                  <td className="td-email">{e.email}</td>
                  <td>{e.location}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Page title map ─────────────────────────────────────────────────────
const PAGE_TITLES = {
  dashboard: 'Dashboard',
  table:     'Employees',
  profile:   'Profile',
  settings:  'Settings',
  about:     'About Us',
  contact:   'Contact Us',
}

// ── Root App ───────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]             = useState('dashboard')
  const [dark, setDark]             = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />
      case 'table':     return <EmployeeTable />
      case 'profile':   return <Profile />
      case 'settings':  return <Settings />
      case 'about':     return <About />
      case 'contact':   return <Contact />
      default:          return <Dashboard />
    }
  }

  return (
    <div className={`shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        active={page}
        onNavigate={setPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
      />

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title">{PAGE_TITLES[page]}</div>
          <div className="header-right">
            <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)} />
          </div>
        </header>

        <main className="content">
          {renderPage()}
        </main>
      </div>

      {/* Floating chatbot — available on every page */}
      <Chatbot />
    </div>
  )
}
