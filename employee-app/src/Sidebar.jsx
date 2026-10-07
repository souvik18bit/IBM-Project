import Logo from './Logo'

const NAV_ITEMS = [
  {
    group: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard',   icon: '▦' },
      { id: 'table',     label: 'Employees',   icon: '☰' },
    ],
  },
  {
    group: 'Account',
    items: [
      { id: 'profile',   label: 'Profile',     icon: '◯' },
      { id: 'settings',  label: 'Settings',    icon: '⚙' },
    ],
  },
  {
    group: 'Company',
    items: [
      { id: 'about',     label: 'About Us',    icon: '🏢' },
      { id: 'contact',   label: 'Contact Us',  icon: '✉' },
    ],
  },
]

export default function Sidebar({ active, onNavigate, collapsed, onToggleCollapse }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo / Brand */}
      <div className="sidebar-brand">
        <Logo collapsed={collapsed} size={32} />
      </div>

      {/* Collapse toggle */}
      <button className="collapse-btn" onClick={onToggleCollapse} title={collapsed ? 'Expand' : 'Collapse'}>
        {collapsed ? '»' : '«'}
      </button>

      {/* Nav groups */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(group => (
          <div key={group.group} className="nav-group">
            {!collapsed && <div className="nav-group-label">{group.group}</div>}
            {group.items.map(item => (
              <button
                key={item.id}
                className={`nav-item ${active === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-footer-text">Nexvora HQ</div>
          <div className="sidebar-footer-version">v1.0.0</div>
        </div>
      )}
    </aside>
  )
}
