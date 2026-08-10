/**
 * Particle Sphere — ported from references/reference3.html (Originkit).
 *
 * A Fibonacci-distributed shell of points in three.js. Three forces act on
 * each point's displacement from its home position:
 *
 *   · cursor repulsion — projected to screen space, applied only to points
 *     currently facing the camera so the back of the sphere stays calm
 *   · click scatter — a radial velocity impulse with its own friction
 *   · a spring return + friction that always pulls displacement back to 0
 *
 * The reference's Framer property-control layer, canvas-overflow probe and
 * InstancedMesh branch are dropped in favour of the reference's own Points
 * branch (far cheaper for several thousand particles) and preallocated
 * vectors so the animation loop does not allocate.
 */
import { useEffect, useRef } from "react"
import {
    AdditiveBlending,
    BufferGeometry,
    Color,
    Float32BufferAttribute,
    Group,
    Matrix4,
    PerspectiveCamera,
    Points,
    PointsMaterial,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three"

const CURSOR_PHYSICS = { RETURN_FORCE: 0.015, FRICTION: 0.94 } as const

type Props = {
    particlesCount?: number
    particleSize?: number
    color?: string
    /** Radius in world units; the camera pulls back to keep it framed. */
    radius?: number
    rotationSpeed?: number
    cursorRadius?: number
    cursorStrength?: number
    clickForce?: number
    className?: string
    style?: React.CSSProperties
}

export default function ParticleSphere({
    particlesCount = 5200,
    particleSize = 0.014,
    color = "#ffffff",
    radius = 1.35,
    rotationSpeed = 0.0022,
    cursorRadius = 190,
    cursorStrength = 7,
    clickForce = 5,
    className,
    style,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        let width = container.clientWidth || 400
        let height = container.clientHeight || 400

        const scene = new Scene()
        const camera = new PerspectiveCamera(50, width / height, 0.1, 100)
        camera.position.z = Math.max(3, radius + 1.9)

        let renderer: WebGLRenderer
        try {
            renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" })
        } catch {
            return // No WebGL — the section degrades to plain type.
        }
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        const canvas = renderer.domElement
        canvas.style.display = "block"
        canvas.style.width = "100%"
        canvas.style.height = "100%"
        container.appendChild(canvas)

        // ── Geometry: golden-angle spiral gives an even shell ──────────
        const positions = new Float32Array(particlesCount * 3)
        const base: Vector3[] = new Array(particlesCount)
        const disp: Vector3[] = new Array(particlesCount)
        const scatter: Vector3[] = new Array(particlesCount)
        const goldenAngle = Math.PI * (3 - Math.sqrt(5))

        for (let i = 0; i < particlesCount; i++) {
            const y = 1 - (i / (particlesCount - 1)) * 2
            const ringRadius = Math.sqrt(1 - y * y)
            const theta = goldenAngle * i
            const px = Math.cos(theta) * ringRadius * radius
            const py = y * radius
            const pz = Math.sin(theta) * ringRadius * radius
            positions[i * 3] = px
            positions[i * 3 + 1] = py
            positions[i * 3 + 2] = pz
            base[i] = new Vector3(px, py, pz)
            disp[i] = new Vector3()
            scatter[i] = new Vector3()
        }

        const geometry = new BufferGeometry()
        const positionAttr = new Float32BufferAttribute(positions, 3)
        positionAttr.setUsage(35048 /* DynamicDrawUsage */)
        geometry.setAttribute("position", positionAttr)

        const material = new PointsMaterial({
            size: particleSize,
            color: new Color(color),
            blending: AdditiveBlending,
            depthTest: false,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true,
        })

        const points = new Points(geometry, material)
        const group = new Group()
        group.add(points)
        scene.add(group)

        // ── Interaction state ──────────────────────────────────────────
        const rotation = { x: 0, y: 0 }
        const target = { x: 0, y: 0 }
        const velocity = { x: 0, y: 0 }
        let dragging = false
        let lastX = 0
        let lastY = 0
        let mouse: { x: number; y: number } | null = null
        let onScreen = false
        let raf = 0
        let last = performance.now()

        const scratchWorld = new Vector3()
        const scratchLocal = new Vector3()
        const cameraRight = new Vector3()
        const cameraUp = new Vector3()
        const worldForce = new Vector3()
        const localForce = new Vector3()
        const inverseGroup = new Matrix4()

        const step = () => {
            const now = performance.now()
            const deltaFactor = Math.min((now - last) / (1000 / 60), 3)
            last = now

            if (!dragging && !reduced) target.x += rotationSpeed * 10 * deltaFactor

            if (!dragging) {
                if (Math.abs(velocity.x) > 0.0001 || Math.abs(velocity.y) > 0.0001) {
                    target.x += velocity.x * deltaFactor
                    target.y += velocity.y * deltaFactor
                    target.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, target.y))
                    const decay = Math.pow(0.94, deltaFactor)
                    velocity.x *= decay
                    velocity.y *= decay
                } else {
                    velocity.x = 0
                    velocity.y = 0
                }
            }

            const lerp = 1 - Math.pow(1 - 0.12, deltaFactor)
            rotation.x += (target.x - rotation.x) * lerp
            rotation.y += (target.y - rotation.y) * lerp
            group.rotation.y = rotation.x
            group.rotation.x = rotation.y
            group.updateMatrixWorld()
            inverseGroup.copy(group.matrixWorld).invert()

            camera.updateMatrixWorld()
            cameraRight.setFromMatrixColumn(camera.matrixWorld, 0).normalize()
            cameraUp.setFromMatrixColumn(camera.matrixWorld, 1).normalize()

            const cursorRadiusSq = cursorRadius * cursorRadius
            const arr = positionAttr.array as Float32Array

            for (let i = 0; i < particlesCount; i++) {
                const d = disp[i]
                const v = scatter[i]

                if (mouse) {
                    scratchWorld.copy(base[i]).add(d).applyMatrix4(group.matrixWorld)
                    // Only the camera-facing hemisphere reacts.
                    if (scratchWorld.z > 0) {
                        scratchLocal.copy(scratchWorld).project(camera)
                        const screenX = (scratchLocal.x * 0.5 + 0.5) * width
                        const screenY = (-scratchLocal.y * 0.5 + 0.5) * height
                        const dx = mouse.x - screenX
                        const dy = mouse.y - screenY
                        const distSq = dx * dx + dy * dy
                        if (distSq < cursorRadiusSq && distSq > 0) {
                            const dist = Math.sqrt(distSq)
                            const force = (cursorRadius - dist) / cursorRadius
                            const angle = Math.atan2(dy, dx)
                            const push = force * cursorStrength * deltaFactor * 0.01
                            worldForce
                                .set(0, 0, 0)
                                .addScaledVector(cameraRight, -Math.cos(angle) * push)
                                .addScaledVector(cameraUp, Math.sin(angle) * push)
                            localForce.copy(worldForce).transformDirection(inverseGroup)
                            d.add(localForce)
                        }
                    }
                }

                // Scatter velocity feeds the displacement, then both decay.
                if (v.lengthSq() > 1e-8) {
                    d.addScaledVector(v, deltaFactor)
                    v.multiplyScalar(Math.pow(0.95, deltaFactor))
                    v.multiplyScalar(1 - CURSOR_PHYSICS.RETURN_FORCE * deltaFactor)
                }

                d.multiplyScalar(Math.pow(CURSOR_PHYSICS.FRICTION, deltaFactor))
                d.multiplyScalar(1 - CURSOR_PHYSICS.RETURN_FORCE * deltaFactor)

                const idx = i * 3
                arr[idx] = base[i].x + d.x
                arr[idx + 1] = base[i].y + d.y
                arr[idx + 2] = base[i].z + d.z
            }

            positionAttr.needsUpdate = true
            renderer.render(scene, camera)
            raf = requestAnimationFrame(step)
        }

        // ── Events ─────────────────────────────────────────────────────
        const onMove = (e: PointerEvent) => {
            const rect = container.getBoundingClientRect()
            const inside =
                e.clientX >= rect.left - 120 &&
                e.clientX <= rect.right + 120 &&
                e.clientY >= rect.top - 120 &&
                e.clientY <= rect.bottom + 120
            mouse = inside ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : null

            if (dragging) {
                const dx = e.clientX - lastX
                const dy = e.clientY - lastY
                lastX = e.clientX
                lastY = e.clientY
                target.x += dx * 0.005
                target.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, target.y + dy * 0.005))
                velocity.x = dx * 0.0016
                velocity.y = dy * 0.0016
            }
        }

        const onDown = (e: PointerEvent) => {
            dragging = true
            lastX = e.clientX
            lastY = e.clientY
            canvas.style.cursor = "grabbing"

            // Click scatter: radial impulse away from the pointer in screen space.
            const rect = container.getBoundingClientRect()
            const cx = e.clientX - rect.left
            const cy = e.clientY - rect.top
            const scatterRadiusSq = (cursorRadius * 1.4) * (cursorRadius * 1.4)
            for (let i = 0; i < particlesCount; i++) {
                scratchWorld.copy(base[i]).add(disp[i]).applyMatrix4(group.matrixWorld)
                if (scratchWorld.z <= 0) continue
                scratchLocal.copy(scratchWorld).project(camera)
                const sx = (scratchLocal.x * 0.5 + 0.5) * width
                const sy = (-scratchLocal.y * 0.5 + 0.5) * height
                const dx = sx - cx
                const dy = sy - cy
                const distSq = dx * dx + dy * dy
                if (distSq > scatterRadiusSq || distSq === 0) continue
                const dist = Math.sqrt(distSq)
                const force = ((cursorRadius * 1.4 - dist) / (cursorRadius * 1.4)) * clickForce
                const angle = Math.atan2(dy, dx)
                worldForce
                    .set(0, 0, 0)
                    .addScaledVector(cameraRight, Math.cos(angle) * force * 0.0016)
                    .addScaledVector(cameraUp, -Math.sin(angle) * force * 0.0016)
                localForce.copy(worldForce).transformDirection(inverseGroup)
                scatter[i].add(localForce)
            }
        }

        const onUp = () => {
            dragging = false
            canvas.style.cursor = "grab"
        }

        canvas.style.cursor = "grab"
        canvas.style.touchAction = "none"
        canvas.addEventListener("pointerdown", onDown)
        window.addEventListener("pointermove", onMove, { passive: true })
        window.addEventListener("pointerup", onUp)

        const ro = new ResizeObserver(([entry]) => {
            const rect = entry.contentRect
            if (rect.width <= 0 || rect.height <= 0) return
            width = rect.width
            height = rect.height
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            renderer.setSize(width, height, false)
        })
        ro.observe(container)

        const io = new IntersectionObserver(
            ([entry]) => {
                const next = entry?.isIntersecting ?? false
                if (next === onScreen) return
                onScreen = next
                if (onScreen) {
                    last = performance.now()
                    raf = requestAnimationFrame(step)
                } else {
                    cancelAnimationFrame(raf)
                    raf = 0
                }
            },
            { rootMargin: "150px" }
        )
        io.observe(container)

        return () => {
            cancelAnimationFrame(raf)
            io.disconnect()
            ro.disconnect()
            canvas.removeEventListener("pointerdown", onDown)
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerup", onUp)
            geometry.dispose()
            material.dispose()
            renderer.dispose()
            if (canvas.parentNode === container) container.removeChild(canvas)
        }
    }, [
        particlesCount,
        particleSize,
        color,
        radius,
        rotationSpeed,
        cursorRadius,
        cursorStrength,
        clickForce,
    ])

    return (
        <div
            ref={containerRef}
            className={className}
            role="img"
            aria-label="An interactive sphere of particles that scatters away from the cursor"
            style={{ position: "relative", width: "100%", height: "100%", ...style }}
        />
    )
}
