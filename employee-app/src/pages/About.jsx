const TEAM = [
  { name: 'Alice Morgan',   role: 'CEO & Founder',      dept: 'Executive'  },
  { name: 'Brian Cole',     role: 'CTO',                dept: 'Engineering'},
  { name: 'Clara Hayes',    role: 'Head of HR',         dept: 'HR'         },
  { name: 'Daniel Park',    role: 'Head of Finance',    dept: 'Finance'    },
]

const STATS = [
  { label: 'Founded',       value: '2015'     },
  { label: 'Employees',     value: '15+'      },
  { label: 'Offices',       value: '6 cities' },
  { label: 'Departments',   value: '6'        },
]

export default function About() {
  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">About Nexvora</h2>
        <p className="page-sub">Who we are and what we stand for</p>
      </div>

      {/* Mission */}
      <div className="about-card">
        <div className="about-card-title">Our Mission</div>
        <p className="about-text">
          Nexvora is a forward-thinking technology company dedicated to building exceptional products
          and fostering a diverse, inclusive workplace. Since 2015, we have grown from a lean startup
          into a multi-city organization with talented people across Engineering, Design, Sales,
          Finance, Marketing, and Human Resources — united by a single goal: make work better.
        </p>
      </div>

      {/* Stats */}
      <div className="about-stats">
        {STATS.map(s => (
          <div key={s.label} className="about-stat">
            <div className="about-stat-value">{s.value}</div>
            <div className="about-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Leadership */}
      <div className="about-card">
        <div className="about-card-title">Leadership Team</div>
        <div className="team-grid">
          {TEAM.map(m => (
            <div key={m.name} className="team-card">
              <div className="team-avatar">{m.name.split(' ').map(n => n[0]).join('')}</div>
              <div className="team-name">{m.name}</div>
              <div className="team-role">{m.role}</div>
              <div className="team-dept">{m.dept}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="about-card">
        <div className="about-card-title">Our Values</div>
        <div className="values-grid">
          {['Innovation', 'Integrity', 'Collaboration', 'Diversity', 'Excellence', 'Growth'].map(v => (
            <div key={v} className="value-chip">{v}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
