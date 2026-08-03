import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { LOGO_POINTS } from '../data/logoPoints'

const SIGNATURE_BLUE = '#00B5FF'
const DIM_COLOR = '#5A6478'
const CENTRAL_COUNT = 3400
const DISPERSE_FRACTION = 0.22
const SATELLITE_COUNT = 4

// The single "moment" — a coherent sphere of points. A fraction of them are flagged as
// "disperse" points: during 'glimpse' they fly outward (the hinted bad outcome), during
// 'rewind' they ease calmly back into formation. Point 0 is the "correction" — it turns the
// signature blue and holds during the 'correct' phase, exactly once.
const LOGO_SCALE = 2.5
const LOGO_Y_OFFSET = 1.3 // shifts the assembled logo upward so it clears the bottom-anchored headline
const HOVER_GLOW_RADIUS = 0.4 // world units — small on purpose, so only nearby points light up

function CentralSphere({ phase, theme }) {
  const pointsRef = useRef(null)
  const materialRef = useRef(null)
  // Real hover position in 3D space (not a global on/off flag) — this is what makes the glow
  // localized to wherever the cursor actually is, instead of lighting up every point at once.
  const hoverPointRef = useRef(null)
  const phaseRef = useRef(phase)
  const settleStartRef = useRef(null)
  useEffect(() => {
    phaseRef.current = phase
    if (phase === 'settle' && settleStartRef.current === null) {
      settleStartRef.current = performance.now()
    }
    if (phase !== 'settle') settleStartRef.current = null
  }, [phase])

  const isLight = theme === 'light'
  // Dark mode keeps its original density (1501) exactly as it was — only light mode gets the
  // denser point cloud (up to CENTRAL_COUNT/3400) it needed for clarity against a white background.
  const activeCount = isLight ? CENTRAL_COUNT : 1501

  const positions = useMemo(() => new Float32Array(CENTRAL_COUNT * 3), [])
  const colors = useMemo(() => new Float32Array(CENTRAL_COUNT * 3), [])

  const points = useMemo(() => {
    const arr = []
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < activeCount; i++) {
      const y = 1 - (i / (activeCount - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = goldenAngle * i
      const home = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(1.6)
      const logoPt = LOGO_POINTS[i] || [0, 0]
      arr.push({
        home,
        logoTarget: new THREE.Vector3(logoPt[0] * LOGO_SCALE, logoPt[1] * LOGO_SCALE + LOGO_Y_OFFSET, 0),
        isDisperse: i > 0 && i % Math.round(1 / DISPERSE_FRACTION) === 0,
        disperseDir: home.clone().normalize().multiplyScalar(2.4 + Math.random() * 1.2),
        seed: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [activeCount])
  // On a light background the dark-mode palette (light-gray body, near-white signal, pale
  // gradient end) nearly disappears — these stay mid/dark blue across the board instead.
  const bodyColor = useMemo(() => new THREE.Color(isLight ? '#264A73' : DIM_COLOR), [isLight])
  const signalColor = useMemo(() => new THREE.Color(isLight ? '#0B3A6B' : '#EAF2F8'), [isLight])
  const correctColor = useMemo(() => new THREE.Color(isLight ? '#0072B5' : SIGNATURE_BLUE), [isLight])
  const gradientDark = useMemo(() => new THREE.Color(isLight ? '#051A34' : '#123A6B'), [isLight])
  const gradientLight = useMemo(() => new THREE.Color(isLight ? '#0B4480' : '#7FB3F0'), [isLight])
  const tmpColor = useMemo(() => new THREE.Color(), [])
  const tmpV = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    const posAttr = pointsRef.current?.geometry?.attributes?.position
    const colAttr = pointsRef.current?.geometry?.attributes?.color
    if (!posAttr) return
    const t = state.clock.elapsedTime
    const phaseNow = phaseRef.current

    let settleOpacity = 1
    if (phaseNow === 'settle' && settleStartRef.current !== null) {
      // Points assemble into the logo shape and STAY as points — no fade-out, no hand-off to
      // a solid image. The dotted formation is the final logo.
      settleOpacity = 1
    }

    if (materialRef.current) {
      materialRef.current.size = isLight ? 0.052 : 0.045
    }

    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      let mix = 0 // 0 = body color, 1 = dispersed/signal color
      tmpV.copy(p.home)

      if (p.isDisperse) {
        if (phaseNow === 'glimpse') {
          mix = 1
          tmpV.lerp(p.disperseDir, 0.85)
        } else if (phaseNow === 'rewind' || phaseNow === 'correct' || phaseNow === 'push' || phaseNow === 'transform' || phaseNow === 'settle') {
          mix = 0
        }
      }

      if (phaseNow === 'settle' && settleStartRef.current !== null) {
        const localT = (performance.now() - settleStartRef.current) / 1000 // seconds into settle
        const formProgress = Math.min(1, localT / 0.7) // 0.7s to assemble into the logo shape
        const formEase = 1 - Math.pow(1 - formProgress, 3)
        tmpV.copy(p.home).lerp(p.logoTarget, formEase)
        mix = formEase * 0.6
      }

      const wobbleAmp = phaseNow === 'settle' ? 0.045 : 0.02
      const wobble = Math.sin(t * 0.6 + p.seed) * wobbleAmp
      posAttr.array[i * 3] = tmpV.x + wobble
      posAttr.array[i * 3 + 1] = tmpV.y + Math.cos(t * 0.5 + p.seed) * wobbleAmp
      posAttr.array[i * 3 + 2] = tmpV.z + wobble

      const isCorrectionPoint = i === 0 && phaseNow === 'correct'
      // Local glow: only points genuinely close to the cursor's 3D position brighten — computed
      // fresh per point, per frame, from real distance. This is what "hover" is supposed to mean;
      // the old version just flipped one shared value for every point at once.
      let localGlow = 0
      if (phaseNow === 'settle' && hoverPointRef.current) {
        const dist = tmpV.distanceTo(hoverPointRef.current)
        if (dist < HOVER_GLOW_RADIUS) localGlow = 1 - dist / HOVER_GLOW_RADIUS
      }
      if (phaseNow === 'settle' && settleStartRef.current !== null) {
        // gradient across the assembled logo shape (deep blue -> lighter blue, left to right),
        // for the same visual richness as a two-tone dot-matrix mark, while staying on-brand.
        const gradT = THREE.MathUtils.clamp((p.logoTarget.x / LOGO_SCALE + 1) / 2, 0, 1)
        tmpColor.copy(gradientDark).lerp(gradientLight, gradT)
        tmpColor.lerp(isLight ? new THREE.Color(SIGNATURE_BLUE) : new THREE.Color('#FFFFFF'), localGlow * (isLight ? 1 : 0.85))
      } else {
        tmpColor.copy(bodyColor).lerp(signalColor, mix)
      }
      if (isCorrectionPoint) tmpColor.copy(correctColor)

      colAttr.array[i * 3] = tmpColor.r
      colAttr.array[i * 3 + 1] = tmpColor.g
      colAttr.array[i * 3 + 2] = tmpColor.b
    }
    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
    if (pointsRef.current.material) {
      pointsRef.current.material.opacity = THREE.MathUtils.lerp(pointsRef.current.material.opacity, 0.9 * settleOpacity, 0.15)
    }

    if (pointsRef.current && phaseNow !== 'settle') {
      pointsRef.current.rotation.y += 0.0015
    } else if (pointsRef.current) {
      // ease rotation back to facing the camera flat, so the logo formation reads correctly
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, 0, 0.05)
    }
  })

  return (
    <group>
      {/* invisible hit-area, larger and easier to hover than the sparse points themselves */}
      <mesh
        position={[0, 0.25, 0.1]}
        onPointerMove={(e) => {
          hoverPointRef.current = e.point.clone()
        }}
        onPointerOut={() => {
          hoverPointRef.current = null
        }}
      >
        <planeGeometry args={[6, 4.2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={activeCount} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={activeCount} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial ref={materialRef} size={0.045} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  )
}

// Four satellite clusters revealed only once the camera pulls back (push/transform/settle) —
// "the moment is part of a wider system." Each is a small point cluster + a connecting line back
// to the center, fading in together.
function Satellites({ phase }) {
  const groupRef = useRef(null)
  const lineRefs = useRef([])
  const phaseRef = useRef(phase)
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  const satellites = useMemo(() => {
    const arr = []
    for (let i = 0; i < SATELLITE_COUNT; i++) {
      const angle = (i / SATELLITE_COUNT) * Math.PI * 2 + Math.PI / 4
      const pos = new THREE.Vector3(Math.cos(angle) * 3.6, Math.sin(i * 1.7) * 0.6, Math.sin(angle) * 3.6)
      arr.push({ pos })
    }
    return arr
  }, [])

  useFrame(() => {
    const phaseNow = phaseRef.current
    const visible = phaseNow === 'push' || phaseNow === 'transform' || phaseNow === 'settle'
    const targetOpacity = visible ? (phaseNow === 'settle' ? 0 : 0.55) : 0

    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        if (child.material) {
          child.material.opacity = THREE.MathUtils.lerp(child.material.opacity ?? 0, targetOpacity, 0.05)
        }
      })
    }
    lineRefs.current.forEach((line) => {
      if (!line) return
      const lineTargetOpacity = phaseNow === 'transform' ? 0.4 : phaseNow === 'settle' ? 0 : 0
      line.material.opacity = THREE.MathUtils.lerp(line.material.opacity, lineTargetOpacity, 0.05)
    })
  })

  return (
    <group ref={groupRef}>
      {satellites.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshBasicMaterial color={DIM_COLOR} transparent opacity={0} />
        </mesh>
      ))}
      {satellites.map((s, i) => (
        <line key={`line-${i}`} ref={(el) => (lineRefs.current[i] = el)}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, s.pos.x, s.pos.y, s.pos.z])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={SIGNATURE_BLUE} transparent opacity={0} />
        </line>
      ))}
    </group>
  )
}

function CameraRig({ phase }) {
  const { camera } = useThree()
  const targetZ = useRef(5.5)

  useEffect(() => {
    if (phase === 'freeze' || phase === 'glimpse' || phase === 'rewind' || phase === 'correct') targetZ.current = 5.5
    else if (phase === 'push') targetZ.current = 8.5
    else if (phase === 'transform') targetZ.current = 9.5
    else if (phase === 'settle') targetZ.current = 8
  }, [phase])

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.03)
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default function Hero3DScene({ phase, theme }) {
  return (
    <>
      <CameraRig phase={phase} />
      <CentralSphere phase={phase} theme={theme} />
      <Satellites phase={phase} />
    </>
  )
}
