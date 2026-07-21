'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useIsMobile } from '@/hooks/use-mobile'

/**
 * Subtle floating particle field + grid lines for the hero background.
 * Designed for cinematic ambiance, not visual noise.
 * Particle count is driven by the admin-controlled theme settings.
 */

function Particles({ count = 600, accentColor = '#00D084', isMobile = false }: { count?: number; accentColor?: string; isMobile?: boolean }) {
  const ref = useRef<THREE.Points>(null)

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const emerald = new THREE.Color(accentColor)
    const white = new THREE.Color('#FFFFFF')

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Spread in a wide sphere
      const r = 6 + Math.random() * 14
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6
      positions[i3 + 2] = r * Math.cos(phi)

      // 30% emerald, 70% white
      const c = Math.random() > 0.7 ? emerald : white
      const intensity = 0.3 + Math.random() * 0.7
      colors[i3] = c.r * intensity
      colors[i3 + 1] = c.g * intensity
      colors[i3 + 2] = c.b * intensity

      sizes[i] = Math.random() * 1.5 + 0.3
    }
    return { positions, colors, sizes }
  }, [count, accentColor])

  useFrame((state, delta) => {
    if (!ref.current) return
    const speedMult = isMobile ? 0.3 : 1
    // Slow rotation
    ref.current.rotation.y += delta * 0.03 * speedMult
    ref.current.rotation.x += delta * 0.01 * speedMult
    // Subtle bobbing
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3 * speedMult) * 0.2
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={sizes.length}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function GridLines({ accentColor = '#00D084', isMobile = false }: { accentColor?: string; isMobile?: boolean }) {
  const ref = useRef<THREE.GridHelper>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const speedMult = isMobile ? 0.3 : 1
    ref.current.position.z = (t * 0.5 * speedMult) % 2
    const mat = ref.current.material as THREE.Material & { opacity: number }
    mat.opacity = 0.15 + Math.sin(t * 0.5 * speedMult) * 0.05
  })

  return (
    <group rotation={[Math.PI / 2.2, 0, 0]} position={[0, -2, -2]}>
      <gridHelper
        ref={ref}
        args={[40, 40, accentColor, '#1a1a1a']}
      >
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </gridHelper>
    </group>
  )
}



export function ParticleBackground({
  particleCount = 600,
  accent = '#00D084',
  background = '#0B0B0B',
  mode = 'dark',
}: {
  particleCount?: number
  accent?: string
  background?: string
  mode?: 'dark' | 'light'
}) {
  const isMobile = useIsMobile()

  return (
    <div className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2) : 1}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={mode === 'dark' ? (isMobile ? 0.2 : 0.4) : (isMobile ? 0.6 : 0.8)} />
        <Particles count={isMobile ? Math.floor(particleCount / 3) : particleCount} accentColor={accent} isMobile={isMobile} />
        <GridLines accentColor={accent} isMobile={isMobile} />
        <fog attach="fog" args={[background, 8, 25]} />
      </Canvas>
    </div>
  )
}
