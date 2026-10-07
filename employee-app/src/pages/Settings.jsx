import { useState } from 'react'

function Toggle({ label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="setting-row">
      <div>
        <div className="setting-label">{label}</div>
      </div>
      <button
        className={`s-toggle ${on ? 'on' : ''}`}
        onClick={() => setOn(v => !v)}
        aria-label={label}
      >
        <span className="s-thumb" />
      </button>
    </div>
  )
}

function Select({ label, options, defaultValue }) {
  const [val, setVal] = useState(defaultValue)
  return (
    <div className="setting-row">
      <div className="setting-label">{label}</div>
      <select className="dept-select" value={val} onChange={e => setVal(e.target.value)}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function Settings() {
  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
        <p className="page-sub">Manage your preferences</p>
      </div>

      <div className="settings-group">
        <div className="settings-group-title">Appearance</div>
        <Toggle label="Show row striping on table" defaultOn={true} />
        <Toggle label="Compact table rows" defaultOn={false} />
        <Select label="Default sort column" options={['ID', 'First Name', 'Last Name', 'Salary', 'Department']} defaultValue="ID" />
        <Select label="Rows per page" options={['10', '25', '50', 'All']} defaultValue="All" />
      </div>

      <div className="settings-group">
        <div className="settings-group-title">Notifications</div>
        <Toggle label="Email notifications" defaultOn={true} />
        <Toggle label="New employee alerts" defaultOn={true} />
        <Toggle label="Salary change alerts" defaultOn={false} />
      </div>

      <div className="settings-group">
        <div className="settings-group-title">Data</div>
        <Toggle label="Auto-refresh data every 5 min" defaultOn={false} />
        <Select label="Default currency" options={['USD', 'EUR', 'GBP', 'INR']} defaultValue="USD" />
      </div>
    </div>
  )
}
