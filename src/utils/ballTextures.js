// Procedurally draws each sport's surface pattern onto a canvas, used as a real texture map on
// a genuine SphereGeometry. No external image or model files — nothing here can 404 or fail to
// load, and the pattern is drawn with the sphere's actual UV layout in mind (not a photo forced
// onto a shape it was never designed for).

function makeCanvas(size = 1024) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size / 2 // equirectangular: 2:1 aspect matches SphereGeometry's default UVs
  return canvas
}

function drawSoccer(ctx, w, h) {
  ctx.fillStyle = '#f2f2f2'
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = '#1a1a1a'
  ctx.lineWidth = w * 0.006
  const pentagonAt = (u, v, r) => {
    const x = u * w
    const y = v * h
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
      const px = x + Math.cos(a) * r
      const py = y + Math.sin(a) * r
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fillStyle = '#141414'
    ctx.fill()
  }
  // rows of black pentagons at classic soccer-ball-ish positions, spaced across the equirect map
  const rows = [
    { v: 0.12, count: 3, r: w * 0.05 },
    { v: 0.38, count: 5, r: w * 0.055 },
    { v: 0.62, count: 5, r: w * 0.055 },
    { v: 0.88, count: 3, r: w * 0.05 },
  ]
  rows.forEach((row, ri) => {
    for (let i = 0; i < row.count; i++) {
      const u = (i + (ri % 2 ? 0.5 : 0)) / row.count
      pentagonAt(u, row.v, row.r)
    }
  })
}

function drawTennis(ctx, w, h) {
  ctx.fillStyle = '#c9e02c'
  ctx.fillRect(0, 0, w, h)
  // subtle fuzzy noise
  for (let i = 0; i < 6000; i++) {
    ctx.fillStyle = `rgba(${180 + Math.random() * 40},${210 + Math.random() * 30},20,${0.05 + Math.random() * 0.08})`
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2)
  }
  // the classic curved seam — two sine-like bands, offset half a turn
  ctx.strokeStyle = '#f4fdf0'
  ctx.lineWidth = h * 0.045
  ctx.lineCap = 'round'
  for (let phase = 0; phase < 2; phase++) {
    ctx.beginPath()
    for (let x = 0; x <= w; x += 4) {
      const u = x / w
      const y = h / 2 + Math.sin(u * Math.PI * 2 + phase * Math.PI) * (h * 0.28)
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

function drawBasketball(ctx, w, h) {
  ctx.fillStyle = '#d9772e'
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = '#2b1408'
  ctx.lineWidth = h * 0.02
  // two vertical seams (visible as sine curves in equirect projection) + one horizontal
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, h)
  ctx.moveTo(w * 0.5, 0)
  ctx.lineTo(w * 0.5, h)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, h / 2)
  ctx.lineTo(w, h / 2)
  ctx.stroke()
  ctx.beginPath()
  for (let x = 0; x <= w; x += 4) {
    const u = x / w
    const y1 = h / 2 + Math.sin(u * Math.PI * 2) * (h * 0.22)
    x === 0 ? ctx.moveTo(x, y1) : ctx.lineTo(x, y1)
  }
  ctx.stroke()
  // pebble texture
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${0.04 + Math.random() * 0.06})`
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5)
  }
}

function drawVolleyball(ctx, w, h) {
  ctx.fillStyle = '#f4f2ea'
  ctx.fillRect(0, 0, w, h)
  const colors = ['#1e3a8a', '#f2b90c', '#f4f2ea']
  const panels = 6
  for (let i = 0; i < panels; i++) {
    ctx.fillStyle = colors[i % colors.length]
    ctx.beginPath()
    ctx.moveTo((i / panels) * w, 0)
    ctx.lineTo(((i + 1) / panels) * w, 0)
    ctx.lineTo(((i + 1) / panels) * w, h)
    ctx.lineTo((i / panels) * w, h)
    ctx.closePath()
    ctx.fill()
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.lineWidth = h * 0.015
  for (let i = 0; i <= panels; i++) {
    ctx.beginPath()
    ctx.moveTo((i / panels) * w, 0)
    ctx.lineTo((i / panels) * w, h)
    ctx.stroke()
  }
}

function drawBaseball(ctx, w, h) {
  ctx.fillStyle = '#f7f3e8'
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = '#c23b3b'
  ctx.lineWidth = h * 0.018
  for (let phase = 0; phase < 2; phase++) {
    const points = []
    for (let x = 0; x <= w; x += 3) {
      const u = x / w
      const y = h / 2 + Math.sin(u * Math.PI * 2 + phase * Math.PI) * (h * 0.24)
      points.push([x, y])
    }
    // stitch marks
    ctx.beginPath()
    points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
    ctx.stroke()
    for (let i = 0; i < points.length; i += 10) {
      const [x, y] = points[i]
      ctx.beginPath()
      ctx.moveTo(x - 5, y - 5)
      ctx.lineTo(x + 5, y + 5)
      ctx.moveTo(x - 5, y + 5)
      ctx.lineTo(x + 5, y - 5)
      ctx.stroke()
    }
  }
}

const DRAWERS = {
  soccer: drawSoccer,
  tennis: drawTennis,
  basketball: drawBasketball,
  volleyball: drawVolleyball,
  baseball: drawBaseball,
}

export function generateBallTexture(THREE, sport) {
  const canvas = makeCanvas(1024)
  const ctx = canvas.getContext('2d')
  const drawer = DRAWERS[sport] || drawSoccer
  drawer(ctx, canvas.width, canvas.height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

// A matching grayscale roughness map so the seams/lines aren't perfectly uniform shininess —
// cheap but effective extra realism on top of the color map.
export function generateRoughnessTexture(THREE, sport) {
  const canvas = makeCanvas(512)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#999999'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < 4000; i++) {
    const v = 120 + Math.random() * 80
    ctx.fillStyle = `rgb(${v},${v},${v})`
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}
