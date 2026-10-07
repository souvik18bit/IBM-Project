import { useState, useRef, useCallback, useEffect } from 'react'

// ── Avatar component — shows photo or initials ─────────────────────────
function Avatar({ src, size = 80 }) {
  if (src) {
    return (
      <img
        src={src}
        alt="Profile"
        style={{
          width: size, height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          border: '3px solid var(--accent)',
          display: 'block',
        }}
      />
    )
  }
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.3 }}>AD</div>
  )
}

// ── 1:1 Crop Modal ─────────────────────────────────────────────────────
function CropModal({ imageSrc, onConfirm, onCancel }) {
  const canvasRef   = useRef(null)
  const [offset, setOffset]     = useState({ x: 0, y: 0 })
  const [scale, setScale]       = useState(1)
  const [dragging, setDragging] = useState(false)
  const [start, setStart]       = useState({ x: 0, y: 0 })
  const imgRef = useRef(new Image())

  const SIZE = 300   // crop box px

  // Load image once
  useEffect(() => {
    const img = imgRef.current
    img.onload = () => {
      // Fit image inside crop box initially
      const fit = Math.max(SIZE / img.naturalWidth, SIZE / img.naturalHeight)
      setScale(fit)
      setOffset({ x: 0, y: 0 })
    }
    img.src = imageSrc
  }, [imageSrc])

  // Redraw canvas when state changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const img = imgRef.current
    if (!img.complete) return
    ctx.clearRect(0, 0, SIZE, SIZE)
    const w = img.naturalWidth  * scale
    const h = img.naturalHeight * scale
    ctx.drawImage(img, offset.x, offset.y, w, h)
  }, [offset, scale])

  // Mouse drag
  const onMouseDown = e => {
    setDragging(true)
    setStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }
  const onMouseMove = useCallback(e => {
    if (!dragging) return
    setOffset({ x: e.clientX - start.x, y: e.clientY - start.y })
  }, [dragging, start])
  const onMouseUp = () => setDragging(false)

  // Touch drag
  const onTouchStart = e => {
    const t = e.touches[0]
    setDragging(true)
    setStart({ x: t.clientX - offset.x, y: t.clientY - offset.y })
  }
  const onTouchMove = e => {
    if (!dragging) return
    const t = e.touches[0]
    setOffset({ x: t.clientX - start.x, y: t.clientY - start.y })
  }

  // Scroll to zoom
  const onWheel = e => {
    e.preventDefault()
    setScale(s => Math.min(4, Math.max(0.3, s - e.deltaY * 0.001)))
  }

  // Export cropped result as dataURL
  const confirm = () => {
    const out = document.createElement('canvas')
    out.width = out.height = SIZE
    const ctx = out.getContext('2d')
    const img = imgRef.current
    ctx.drawImage(img, offset.x, offset.y, img.naturalWidth * scale, img.naturalHeight * scale)
    onConfirm(out.toDataURL('image/jpeg', 0.92))
  }

  return (
    <div className="crop-overlay">
      <div className="crop-modal">
        <div className="crop-modal-header">
          <span className="crop-title">Adjust Photo</span>
          <span className="crop-hint">Drag to move · Scroll to zoom</span>
        </div>

        {/* Canvas crop area */}
        <div className="crop-frame"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onMouseUp}
          onWheel={onWheel}
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        >
          <canvas ref={canvasRef} width={SIZE} height={SIZE} className="crop-canvas" />
          {/* Circle overlay guide */}
          <div className="crop-circle-guide" />
        </div>

        {/* Zoom slider */}
        <div className="crop-zoom-row">
          <span className="crop-zoom-label">Zoom</span>
          <input
            type="range" min="0.3" max="4" step="0.01"
            value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
            className="crop-zoom-slider"
          />
          <span className="crop-zoom-val">{(scale * 100).toFixed(0)}%</span>
        </div>

        <div className="crop-actions">
          <button className="crop-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="crop-btn-confirm" onClick={confirm}>Apply Photo</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Profile Page ──────────────────────────────────────────────────
export default function Profile() {
  // Load saved photo from localStorage so it survives page reloads
  const [photo, setPhoto]       = useState(() => localStorage.getItem('nexvora_profile_photo') || null)
  const [rawSrc, setRawSrc]     = useState(null)
  const [showCrop, setShowCrop] = useState(false)
  const fileInputRef            = useRef(null)

  const onFileChange = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setRawSrc(ev.target.result)
      setShowCrop(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const onCropConfirm = dataUrl => {
    setPhoto(dataUrl)
    localStorage.setItem('nexvora_profile_photo', dataUrl)  // save permanently
    setShowCrop(false)
    setRawSrc(null)
  }

  const onCropCancel = () => {
    setShowCrop(false)
    setRawSrc(null)
  }

  const removePhoto = () => {
    setPhoto(null)
    localStorage.removeItem('nexvora_profile_photo')  // clear from storage
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Profile</h2>
        <p className="page-sub">Your personal account details</p>
      </div>

      <div className="profile-card">
        {/* Avatar + upload controls */}
        <div className="avatar-upload-wrap">
          <div className="avatar-preview-ring">
            <Avatar src={photo} size={84} />
          </div>
          <div className="avatar-upload-btns">
            <button className="upload-btn primary" onClick={() => fileInputRef.current.click()}>
              📁 Change Photo
            </button>
            {photo && (
              <button className="upload-btn danger" onClick={removePhoto}>
                ✕ Remove Photo
              </button>
            )}
          </div>
          {/* Hidden file input — device gallery only */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onFileChange}
          />
        </div>

        <div>
          <div className="profile-name">Admin User</div>
          <div className="profile-role">HR Administrator</div>
          <div className="profile-email">admin@nexvora.io</div>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-section">
          <div className="info-section-title">Personal Information</div>
          <div className="info-row"><span className="info-label">Full Name</span><span className="info-value">Admin User</span></div>
          <div className="info-row"><span className="info-label">Email</span><span className="info-value">admin@nexvora.io</span></div>
          <div className="info-row"><span className="info-label">Phone</span><span className="info-value">+91 33 4012 5500</span></div>
          <div className="info-row"><span className="info-label">Location</span><span className="info-value">Kolkata, India</span></div>
        </div>
        <div className="info-section">
          <div className="info-section-title">Work Information</div>
          <div className="info-row"><span className="info-label">Department</span><span className="info-value">Human Resources</span></div>
          <div className="info-row"><span className="info-label">Job Title</span><span className="info-value">HR Administrator</span></div>
          <div className="info-row"><span className="info-label">Employee ID</span><span className="info-value">#EMP-001</span></div>
          <div className="info-row"><span className="info-label">Joined</span><span className="info-value">January 2020</span></div>
        </div>
      </div>

      {/* Crop modal */}
      {showCrop && rawSrc && (
        <CropModal
          imageSrc={rawSrc}
          onConfirm={onCropConfirm}
          onCancel={onCropCancel}
        />
      )}
    </div>
  )
}
