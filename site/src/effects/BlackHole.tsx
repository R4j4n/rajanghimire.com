/**
 * Black Hole — ported from references/reference1.html (Originkit).
 *
 * A gravitationally bound accretion disk. Particles orbit faster the closer
 * they sit to the core (v ~ 1/sqrt(r)), are projected with a fixed
 * perspective, and are split across two canvases so the ones behind the
 * event horizon are genuinely occluded by it.
 *
 * Changed from the reference: the rAF loop is gated on an
 * IntersectionObserver so it costs nothing while scrolled away.
 */
import { useRef, useEffect, useCallback, useState } from "react"

type Particle = {
    angle: number
    radius: number
    height: number
    speedOffset: number
    colorIdx: number
}

type Props = {
    particleCount?: number
    particleSize?: number
    colors?: string[]
    outerRadius?: number
    tilt?: number
    tiltSideway?: number
    trail?: number
    orbitSpeed?: number
    pullSpeed?: number
    voidRadius?: number
    voidX?: number
    voidY?: number
    background?: string
    style?: React.CSSProperties
}

const PERSPECTIVE = 1300

export default function BlackHole({
    particleCount = 900,
    particleSize: particleSizeRaw = 4,
    colors = ["#ffffff"],
    outerRadius = 70,
    tilt = 20,
    tiltSideway = 160,
    trail: trailRaw = 50,
    orbitSpeed = 4,
    pullSpeed: pullSpeedRaw = 0,
    voidRadius: rawVoidRadius = 40,
    voidX = 50,
    voidY = 50,
    background = "#000000",
    style,
}: Props) {
    const voidColor = background
    const particleSize =
        0.5 + (Math.max(1, Math.min(50, particleSizeRaw)) - 1) * (4 / 49)
    const pullSpeed = Math.max(0, pullSpeedRaw) / 2
    const trailAlpha = Math.max(0.02, 1 - (Math.max(0, trailRaw) / 50) * 0.98)
    const voidRadius = rawVoidRadius

    const outerRadFromSize = useCallback(
        (w: number) => {
            const maxR = w / 2
            const pct = Math.max(0, Math.min(100, outerRadius)) / 100
            return voidRadius + pct * (maxR - voidRadius)
        },
        [voidRadius, outerRadius]
    )

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fgCanvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animRef = useRef<number>(0)
    const sizeRef = useRef({ w: 600, h: 600 })
    const [sizeVersion, setSizeVersion] = useState(0)
    const [active, setActive] = useState(false)

    const initParticles = useCallback(
        (count: number, horizonRad: number, outerRad: number, colorsLength: number) => {
            const pts: Particle[] = []
            for (let i = 0; i < count; i++) {
                // Squared distribution clusters density near the horizon.
                const radius =
                    horizonRad + Math.pow(Math.random(), 2) * (outerRad - horizonRad)
                pts.push({
                    angle: Math.random() * Math.PI * 2,
                    radius,
                    height: (Math.random() - 0.5) * 16,
                    speedOffset: 0.75 + Math.random() * 0.5,
                    colorIdx: Math.floor(Math.random() * colorsLength),
                })
            }
            particlesRef.current = pts
        },
        []
    )

    useEffect(() => {
        const { w } = sizeRef.current
        initParticles(particleCount, voidRadius, outerRadFromSize(w), colors.length)
    }, [particleCount, voidRadius, colors.length, initParticles, outerRadFromSize, sizeVersion])

    useEffect(() => {
        const container = containerRef.current
        const canvas = canvasRef.current
        const fgCanvas = fgCanvasRef.current
        if (!container || !canvas || !fgCanvas) return

        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect
                const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
                canvas.width = width * dpr
                canvas.height = height * dpr
                canvas.style.width = `${width}px`
                canvas.style.height = `${height}px`
                fgCanvas.width = width * dpr
                fgCanvas.height = height * dpr
                fgCanvas.style.width = `${width}px`
                fgCanvas.style.height = `${height}px`
                const prev = sizeRef.current
                sizeRef.current = { w: width, h: height }
                if (prev.w !== width || prev.h !== height) setSizeVersion((v) => v + 1)
            }
        })
        ro.observe(container)

        const io = new IntersectionObserver(
            ([entry]) => setActive(entry?.isIntersecting ?? false),
            { rootMargin: "120px" }
        )
        io.observe(container)

        return () => {
            ro.disconnect()
            io.disconnect()
        }
    }, [])

    useEffect(() => {
        if (!active) return
        const canvas = canvasRef.current
        const fgCanvas = fgCanvasRef.current
        if (!canvas || !fgCanvas) return
        const ctx = canvas.getContext("2d")
        const fgCtx = fgCanvas.getContext("2d")
        if (!ctx || !fgCtx) return

        let lastTime = performance.now()
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        const hexToRgb = (colorStr: string) => {
            let r = 0,
                g = 0,
                b = 0
            if (!colorStr) return { r, g, b }
            if (colorStr.startsWith("#")) {
                const hex = colorStr.replace("#", "")
                if (hex.length === 3) {
                    r = parseInt(hex[0] + hex[0], 16)
                    g = parseInt(hex[1] + hex[1], 16)
                    b = parseInt(hex[2] + hex[2], 16)
                } else if (hex.length >= 6) {
                    r = parseInt(hex.substring(0, 2), 16)
                    g = parseInt(hex.substring(2, 4), 16)
                    b = parseInt(hex.substring(4, 6), 16)
                }
            } else if (colorStr.startsWith("rgb")) {
                const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
                if (match) {
                    r = parseInt(match[1])
                    g = parseInt(match[2])
                    b = parseInt(match[3])
                }
            }
            return { r, g, b }
        }
        const voidRgb = hexToRgb(voidColor)

        const draw = (now: number) => {
            const dt = Math.min((now - lastTime) / 16.667, 3)
            lastTime = now

            const { w, h } = sizeRef.current
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            fgCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.globalAlpha = 1
            fgCtx.globalAlpha = 1

            // Fade previous frame via destination-out so both canvases stay
            // transparent and can be stacked over page content.
            ctx.globalCompositeOperation = "destination-out"
            ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`
            ctx.fillRect(0, 0, w, h)
            ctx.globalCompositeOperation = "source-over"

            fgCtx.globalCompositeOperation = "destination-out"
            fgCtx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`
            fgCtx.fillRect(0, 0, w, h)
            fgCtx.globalCompositeOperation = "source-over"

            const outerRad = outerRadFromSize(w)
            const voidCx = (voidX / 100) * w
            const voidCy = (voidY / 100) * h

            const pts = particlesRef.current
            const tiltRad = (tilt * Math.PI) / 180
            const tiltSidewayRad = (tiltSideway * Math.PI) / 180

            type ProjectedPt = {
                x: number
                y: number
                size: number
                alpha: number
                z: number
                color: string
            }
            const backgroundParticles: ProjectedPt[] = []
            const foregroundParticles: ProjectedPt[] = []

            for (let i = 0; i < pts.length; i++) {
                const pt = pts[i]
                const speedFactor = Math.sqrt(voidRadius / Math.max(pt.radius, 10))
                pt.angle += orbitSpeed * speedFactor * pt.speedOffset * 0.012 * dt
                pt.radius -= pullSpeed * speedFactor * pt.speedOffset * dt

                if (pt.radius < voidRadius) {
                    pt.radius =
                        voidRadius +
                        0.7 * (outerRad - voidRadius) +
                        Math.random() * 0.3 * (outerRad - voidRadius)
                    pt.angle = Math.random() * Math.PI * 2
                    pt.height = (Math.random() - 0.5) * 16
                    continue
                }

                const cosA = Math.cos(pt.angle)
                const sinA = Math.sin(pt.angle)
                const x_base = pt.radius * cosA
                const y_base = pt.height
                const z_base = pt.radius * sinA

                const x1 = x_base
                const y1 = y_base * Math.cos(tiltRad) + z_base * Math.sin(tiltRad)
                const z1 = -y_base * Math.sin(tiltRad) + z_base * Math.cos(tiltRad)

                const x3d = x1 * Math.cos(tiltSidewayRad) - y1 * Math.sin(tiltSidewayRad)
                const y3d = x1 * Math.sin(tiltSidewayRad) + y1 * Math.cos(tiltSidewayRad)
                const z3d = z1

                const scale = PERSPECTIVE / (PERSPECTIVE + z3d)
                const px = voidCx + x3d * scale
                const py = voidCy + y3d * scale
                if (px < -30 || px > w + 30 || py < -30 || py > h + 30) continue

                const projectedPt: ProjectedPt = {
                    x: px,
                    y: py,
                    size: Math.max(0.3, particleSize * scale),
                    alpha: Math.max(0.35, 1 - ((z3d + outerRad) / (2 * outerRad)) * 0.45),
                    z: z3d,
                    color: colors[pt.colorIdx % colors.length],
                }

                if (z3d >= 0) backgroundParticles.push(projectedPt)
                else foregroundParticles.push(projectedPt)
            }

            backgroundParticles.sort((a, b) => b.z - a.z)
            foregroundParticles.sort((a, b) => b.z - a.z)

            for (const pt of backgroundParticles) {
                ctx.globalAlpha = pt.alpha
                ctx.fillStyle = pt.color
                ctx.beginPath()
                ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2)
                ctx.fill()
            }
            ctx.globalAlpha = 1

            // Event horizon: opaque sphere drawn between the two particle sets.
            const sphereGrad = ctx.createRadialGradient(
                voidCx - voidRadius * 0.25,
                voidCy - voidRadius * 0.3,
                voidRadius * 0.05,
                voidCx,
                voidCy,
                voidRadius
            )
            const edgeR = Math.min(255, voidRgb.r + 18)
            const edgeG = Math.min(255, voidRgb.g + 18)
            const edgeB = Math.min(255, voidRgb.b + 18)
            sphereGrad.addColorStop(
                0,
                `rgba(${Math.min(255, voidRgb.r + 8)}, ${Math.min(255, voidRgb.g + 8)}, ${Math.min(255, voidRgb.b + 8)}, 1)`
            )
            sphereGrad.addColorStop(0.65, `rgba(${voidRgb.r}, ${voidRgb.g}, ${voidRgb.b}, 1)`)
            sphereGrad.addColorStop(0.92, `rgba(${edgeR}, ${edgeG}, ${edgeB}, 1)`)
            sphereGrad.addColorStop(1, `rgba(${edgeR}, ${edgeG}, ${edgeB}, 0.9)`)
            ctx.fillStyle = sphereGrad
            ctx.beginPath()
            ctx.arc(voidCx, voidCy, voidRadius, 0, Math.PI * 2)
            ctx.fill()

            const rimGrad = ctx.createRadialGradient(
                voidCx,
                voidCy,
                voidRadius * 0.88,
                voidCx,
                voidCy,
                voidRadius * 1.02
            )
            rimGrad.addColorStop(0, "rgba(255, 255, 255, 0)")
            rimGrad.addColorStop(0.6, "rgba(180, 180, 200, 0.06)")
            rimGrad.addColorStop(0.85, "rgba(180, 180, 200, 0.12)")
            rimGrad.addColorStop(1, "rgba(180, 180, 200, 0)")
            ctx.fillStyle = rimGrad
            ctx.beginPath()
            ctx.arc(voidCx, voidCy, voidRadius * 1.02, 0, Math.PI * 2)
            ctx.fill()

            for (const pt of foregroundParticles) {
                fgCtx.globalAlpha = pt.alpha
                fgCtx.fillStyle = pt.color
                fgCtx.beginPath()
                fgCtx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2)
                fgCtx.fill()
            }
            fgCtx.globalAlpha = 1

            // Reduced motion gets a single frame. The particles are seeded at
            // random angles across the disk, so one pass already reads as a
            // complete accretion ring rather than a handful of dots.
            if (reduced) return

            animRef.current = requestAnimationFrame(draw)
        }

        animRef.current = requestAnimationFrame(draw)
        return () => cancelAnimationFrame(animRef.current)
    }, [
        active,
        voidX,
        voidY,
        voidRadius,
        voidColor,
        particleSize,
        colors,
        outerRadFromSize,
        tilt,
        tiltSideway,
        trailAlpha,
        orbitSpeed,
        pullSpeed,
    ])

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            style={{
                width: "100%",
                height: "100%",
                ...style,
                position: "relative",
                overflow: "hidden",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />
            <canvas
                ref={fgCanvasRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                }}
            />
        </div>
    )
}
