import { useMemo } from 'react'
import employees from './employees'

const DEPT_PALETTE = {
  Engineering:       '#3b82d4',
  Marketing:         '#f59e0b',
  Finance:           '#10b981',
  Sales:             '#8b5cf6',
  Design:            '#ec4899',
  'Human Resources': '#06b6d4',
}

const LOCATION_PALETTE = ['#3b82d4','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#f97316']

// ── Mini SVG Bar Chart ────────────────────────────────────────────────
function BarChart({ data, color = '#3b82d4', height = 120 }) {
  const max = Math.max(...data.map(d => d.value))
  const barW = 36
  const gap = 12
  const topPad = 20  // room above tallest bar for its label
  const width = data.length * (barW + gap) - gap + 48
  return (
    <svg viewBox={`0 0 ${width} ${height + topPad + 40}`} width="100%" style={{ overflow: 'visible' }}>
      {data.map((d, i) => {
        const barH = max ? (d.value / max) * height : 0
        const x = 24 + i * (barW + gap)
        const y = topPad + (height - barH)   // shift everything down by topPad
        const barBottom = topPad + height     // baseline for labels and animation origin
        const c = typeof color === 'object' ? (color[d.label] || '#3b82d4') : color
        return (
          <g key={d.label}>
            <defs>
              <style>{`
                @keyframes barGrow${i} {
                  from { transform: scaleY(0); transform-origin: ${x + barW/2}px ${barBottom}px; }
                  to   { transform: scaleY(1); transform-origin: ${x + barW/2}px ${barBottom}px; }
                }
              `}</style>
            </defs>
            <rect
              x={x} y={y} width={barW} height={barH} fill={c} rx={4} opacity={0.9}
              style={{
                transformOrigin: `${x + barW/2}px ${barBottom}px`,
                animation: `barGrow${i} 0.55s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s both`,
              }}
            />
            <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize={11} fill="var(--muted)"
              style={{ animation: `barGrow${i} 0.55s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s both` }}>
              {d.value}
            </text>
            <text x={x + barW / 2} y={barBottom + 16} textAnchor="middle" fontSize={10} fill="var(--muted)">
              {d.label.length > 6 ? d.label.slice(0, 6) + '…' : d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Mini SVG Pie/Donut Chart ──────────────────────────────────────────
function DonutChart({ data, size = 180 }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const cx = size / 2, cy = size / 2, r = size * 0.38, inner = size * 0.22
  let angle = -Math.PI / 2
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 2 * Math.PI
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle)
    angle += sweep
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle)
    const large = sweep > Math.PI ? 1 : 0
    const xi1 = cx + inner * Math.cos(angle - sweep), yi1 = cy + inner * Math.sin(angle - sweep)
    const xi2 = cx + inner * Math.cos(angle), yi2 = cy + inner * Math.sin(angle)
    return {
      ...d,
      path: `M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${xi2},${yi2} A${inner},${inner} 0 ${large},0 ${xi1},${yi1} Z`,
      color: d.color || LOCATION_PALETTE[i % LOCATION_PALETTE.length],
      delay: i * 0.06,
    }
  })
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {slices.map(s => (
        <path
          key={s.label}
          d={s.path}
          fill={s.color}
          opacity={0.92}
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: `scaleIn 0.5s cubic-bezier(0.4,0,0.2,1) ${s.delay}s both`,
            transition: 'opacity 0.2s, transform 0.2s',
            cursor: 'default',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.06)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'scale(1)' }}
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={13} fontWeight="700" fill="var(--text)">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={10} fill="var(--muted)">total</text>
    </svg>
  )
}

// ── Horizontal Bar ────────────────────────────────────────────────────
function HBar({ label, value, max, color }) {
  const pct = max ? (value / max) * 100 : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
        <span style={{ color: 'var(--text)' }}>{label}</span>
        <span style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>${value.toLocaleString()}</span>
      </div>
      <div style={{ background: 'var(--border)', borderRadius: 4, height: 8 }}>
        <div style={{
          width: `${pct}%`, background: color, height: 8, borderRadius: 4,
          transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
          animation: 'hBarGrow 0.7s cubic-bezier(0.4,0,0.2,1) both',
        }} />
      </div>
    </div>
  )
}

// ── KPI Card ──────────────────────────────────────────────────────────
function KPICard({ label, value, sub, accent = '#3b82d4' }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ color: accent }}>{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  )
}

// ── Chart Card wrapper ─────────────────────────────────────────────────
function Card({ title, children, style }) {
  return (
    <div className="dash-card" style={style}>
      <div className="dash-card-title">{title}</div>
      {children}
    </div>
  )
}

// ── Legend ─────────────────────────────────────────────────────────────
function Legend({ items }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 12 }}>
      {items.map(it => (
        <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: it.color, display: 'inline-block' }} />
          <span style={{ color: '#57606a' }}>{it.label}</span>
          <span style={{ color: '#1f2328', fontWeight: 600 }}>{it.value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────
export default function Dashboard() {
  const stats = useMemo(() => {
    const total = employees.length
    const salaries = employees.map(e => e.salary)
    const totalSalary = salaries.reduce((a, b) => a + b, 0)
    const avgSalary = Math.round(totalSalary / total)
    const maxSalary = Math.max(...salaries)
    const minSalary = Math.min(...salaries)

    // By department
    const byDept = {}
    employees.forEach(e => {
      if (!byDept[e.department]) byDept[e.department] = { count: 0, totalSalary: 0 }
      byDept[e.department].count++
      byDept[e.department].totalSalary += e.salary
    })

    // By location
    const byLocation = {}
    employees.forEach(e => {
      byLocation[e.location] = (byLocation[e.location] || 0) + 1
    })

    // Top earners
    const topEarners = [...employees].sort((a, b) => b.salary - a.salary).slice(0, 5)

    // Salary ranges
    const ranges = [
      { label: '$50k–$70k', min: 50000, max: 70000 },
      { label: '$70k–$90k', min: 70000, max: 90000 },
      { label: '$90k–$110k', min: 90000, max: 110000 },
      { label: '$110k+',   min: 110000, max: Infinity },
    ]
    const salaryBuckets = ranges.map(r => ({
      label: r.label,
      value: employees.filter(e => e.salary >= r.min && e.salary < r.max).length,
    }))

    return { total, avgSalary, maxSalary, minSalary, totalSalary, byDept, byLocation, topEarners, salaryBuckets }
  }, [])

  const deptBarData = Object.entries(stats.byDept).map(([label, d]) => ({ label, value: d.count }))
  const deptDonutData = Object.entries(stats.byDept).map(([label, d]) => ({ label, value: d.count, color: DEPT_PALETTE[label] }))
  const locationData = Object.entries(stats.byLocation)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({ label, value, color: LOCATION_PALETTE[i % LOCATION_PALETTE.length] }))

  const avgByDept = Object.entries(stats.byDept)
    .map(([dept, d]) => ({ dept, avg: Math.round(d.totalSalary / d.count), color: DEPT_PALETTE[dept] }))
    .sort((a, b) => b.avg - a.avg)

  const maxAvg = Math.max(...avgByDept.map(d => d.avg))

  return (
    <div className="dashboard">
      {/* KPI Row */}
      <div className="kpi-row">
        <KPICard label="Total Employees" value={stats.total} sub="across 6 departments" accent="#3b82d4" />
        <KPICard label="Average Salary" value={`$${stats.avgSalary.toLocaleString()}`} sub="USD per year" accent="#10b981" />
        <KPICard label="Highest Salary" value={`$${stats.maxSalary.toLocaleString()}`} sub="Jane Doe · Engineering" accent="#8b5cf6" />
        <KPICard label="Lowest Salary" value={`$${stats.minSalary.toLocaleString()}`} sub="David Taylor · Sales" accent="#f59e0b" />
        <KPICard label="Total Payroll" value={`$${(stats.totalSalary / 1000).toFixed(0)}k`} sub="annual cost" accent="#ec4899" />
        <KPICard label="Locations" value={Object.keys(stats.byLocation).length} sub="cities" accent="#06b6d4" />
      </div>

      {/* Row 2: Dept headcount bar + donut */}
      <div className="dash-row">
        <Card title="Headcount by Department" style={{ flex: 2 }}>
          <BarChart data={deptBarData} color={DEPT_PALETTE} height={130} />
        </Card>
        <Card title="Department Split" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <DonutChart data={deptDonutData} size={160} />
          <Legend items={deptDonutData.map(d => ({ label: d.label.split(' ')[0], value: d.value, color: d.color }))} />
        </Card>
      </div>

      {/* Row 3: Salary distribution + Avg salary by dept */}
      <div className="dash-row">
        <Card title="Salary Distribution" style={{ flex: 1 }}>
          <BarChart data={stats.salaryBuckets} color="#3b82d4" height={120} />
        </Card>
        <Card title="Average Salary by Department" style={{ flex: 1.4 }}>
          <div style={{ marginTop: 8 }}>
            {avgByDept.map(d => (
              <HBar key={d.dept} label={d.dept} value={d.avg} max={maxAvg} color={d.color} />
            ))}
          </div>
        </Card>
      </div>

      {/* Row 4: Location distribution + Top earners */}
      <div className="dash-row">
        <Card title="Employees by Location" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <DonutChart data={locationData} size={150} />
            <Legend items={locationData.map(d => ({ label: d.label, value: d.value, color: d.color }))} />
          </div>
        </Card>
        <Card title="Top 5 Earners" style={{ flex: 1 }}>
          <table className="top-earners-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              {stats.topEarners.map((e, i) => (
                <tr key={e.id}>
                  <td>
                    <span className="rank">#{i + 1}</span>
                    {e.firstName} {e.lastName}
                  </td>
                  <td>
                    <span className="badge-sm" style={{ background: DEPT_PALETTE[e.department] + '22', color: DEPT_PALETTE[e.department] }}>
                      {e.department}
                    </span>
                  </td>
                  <td className="salary-cell">${e.salary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
