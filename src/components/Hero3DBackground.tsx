import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Subtle 3D background for the hero section.
 * Renders a slowly-rotating wireframe icosahedron with floating particles
 * in a cybersecurity-inspired color palette (navy + emerald).
 *
 * - Lightweight: low-poly geometry, no post-processing
 * - Mobile: simplified (fewer particles, lower pixel ratio)
 * - Pauses rendering when tab is hidden to save battery
 */
export default function Hero3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isMobile = window.innerWidth < 768
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2))
    container.appendChild(renderer.domElement)

    // --- Wireframe icosahedron (abstract "shield/network" shape) ---
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 1)
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    })
    const ico = new THREE.Mesh(icoGeo, icoMat)
    ico.position.set(2.4, 0.2, -1)
    scene.add(ico)

    // Inner solid core for depth
    const coreGeo = new THREE.IcosahedronGeometry(0.55, 0)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.08,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    core.position.copy(ico.position)
    scene.add(core)

    // --- Floating particles (network nodes) ---
    const particleCount = isMobile ? 40 : 90
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12
      positions[i + 1] = (Math.random() - 0.5) * 7
      positions[i + 2] = (Math.random() - 0.5) * 6
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: isMobile ? 0.02 : 0.035,
      transparent: true,
      opacity: 0.45,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // --- Animation loop ---
    let rafId = 0
    let running = true

    const animate = () => {
      if (!running) return
      rafId = requestAnimationFrame(animate)

      ico.rotation.x += 0.0012
      ico.rotation.y += 0.0018
      core.rotation.x -= 0.0008
      core.rotation.y -= 0.0012
      particles.rotation.y += 0.0004

      renderer.render(scene, camera)
    }

    if (prefersReducedMotion) {
      // Render a single static frame for reduced-motion users
      renderer.render(scene, camera)
    } else {
      animate()
    }

    // --- Resize handling ---
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // --- Pause when tab hidden ---
    const onVisibility = () => {
      running = !document.hidden
      if (running && !prefersReducedMotion) animate()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      renderer.dispose()
      icoGeo.dispose()
      icoMat.dispose()
      coreGeo.dispose()
      coreMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 opacity-70 md:opacity-100"
      aria-hidden="true"
    />
  )
}