/**
 * Nexvora — SVG logo
 * Mark: a stylised hexagon with an inner "N" formed by two diagonal strokes
 * Wordmark: "Nexvora" in a clean sans-serif weight
 */
export default function Logo({ collapsed = false, size = 32 }) {
  return (
    <div className="logo-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* ── Hex mark ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Hexagon background */}
        <polygon
          points="20,2 36,11 36,29 20,38 4,29 4,11"
          fill="var(--accent)"
          opacity="0.95"
        />
        {/* Inner "N" mark — two diagonals + left & right verticals */}
        <line x1="12" y1="27" x2="12" y2="13" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="12" y1="13" x2="28" y2="27" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="28" y1="27" x2="28" y2="13" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      </svg>

      {/* ── Wordmark ── */}
      {!collapsed && (
        <svg
          width="76"
          height={size}
          viewBox="0 0 76 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          <text
            x="0"
            y="22"
            fontFamily="-apple-system, 'Segoe UI', system-ui, sans-serif"
            fontSize="18"
            fontWeight="700"
            letterSpacing="-0.5"
            fill="var(--text)"
          >
            Nex
          </text>
          <text
            x="36"
            y="22"
            fontFamily="-apple-system, 'Segoe UI', system-ui, sans-serif"
            fontSize="18"
            fontWeight="400"
            letterSpacing="-0.3"
            fill="var(--accent)"
          >
            vora
          </text>
        </svg>
      )}
    </div>
  )
}
