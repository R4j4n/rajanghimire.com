/**
 * Dust Text Reveal — ported from references/reference6.html (Originkit).
 *
 * The word is rasterised to an offscreen canvas, every opaque pixel becomes
 * a particle scattered around its home position, and a single form-progress
 * value `p` (0 → 1) pulls them back. The real DOM text cross-fades in at
 * TEXT_IN and the particles fade out at FADE_OUT, so the hand-off is
 * invisible and the final headline is selectable, accessible text.
 *
 * Changed from the reference:
 *  · Framer's font/colour control plumbing is replaced with plain props.
 *  · The DOM headline is positioned from real font metrics against the
 *    canvas baseline, so the cross-fade lands pixel-on-pixel instead of
 *    relying on both layers happening to centre the same way.
 *  · The loop only runs while in view and stops once fully formed;
 *    reduced-motion skips straight to the formed state.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePrefersReducedMotion } from "./useVisible"

// Hand-off points on the form timeline.
const TEXT_IN = 0.7
const FADE_OUT = 0.85

// Density slider (1..10) → particle sampling multiplier (lower = denser).
const DENSITY_MAP = [6, 5.4, 4.9, 4.3, 3.8, 3.2, 2.7, 2.1, 1.6, 1]

type Particle = {
    x: number
    y: number
    originalX: number
    originalY: number
    opacity: number
    sparkleOp: number
    originalAlpha: number
    floatingSpeed: number
    floatingAngle: number
    targetOpacity: number
    sparkleSpeed: number
}

function cubicBezierEase(x1: number, y1: number, x2: number, y2: number) {
    const cx = 3 * x1
    const bx = 3 * (x2 - x1) - cx
    const ax = 1 - cx - bx
    const cy = 3 * y1
    const by = 3 * (y2 - y1) - cy
    const ay = 1 - cy - by
    const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t
    const sampleY = (t: number) => ((ay * t + by) * t + cy) * t
    const dX = (t: number) => (3 * ax * t + 2 * bx) * t + cx
    return (p: number) => {
        let t = p
        for (let i = 0; i < 8; i++) {
            const x = sampleX(t) - p
            const dd = dX(t)
            if (Math.abs(x) < 1e-4 || Math.abs(dd) < 1e-6) break
            t -= x / dd
        }
        t = t < 0 ? 0 : t > 1 ? 1 : t
        return sampleY(t)
    }
}

const easeInOut = cubicBezierEase(0.42, 0, 0.58, 1)

type Metrics = { ascent: number; descent: number; boxAscent: number; boxDescent: number }

function createParticles(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    text: string,
    font: string,
    letterSpacing: string,
    baselineY: number,
    align: "left" | "center",
    density: number,
    dpr: number
): Particle[] {
    const particles: Particle[] = []
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#ffffff"
    ctx.font = font
    ctx.textAlign = align
    ;(ctx as any).letterSpacing = letterSpacing
    ctx.textBaseline = "alphabetic"
    ctx.fillText(text, align === "left" ? 0 : canvas.width / 2, baselineY)

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    const sampleRate = Math.max(1, Math.round(Math.max(2, Math.round(dpr)) * density))

    let minX = canvas.width
    let maxX = 0
    let minY = canvas.height
    let maxY = 0
    for (let y = 0; y < canvas.height; y += sampleRate) {
        for (let x = 0; x < canvas.width; x += sampleRate) {
            if (data[(y * canvas.width + x) * 4 + 3] > 0) {
                minX = Math.min(minX, x)
                maxX = Math.max(maxX, x)
                minY = Math.min(minY, y)
                maxY = Math.max(maxY, y)
            }
        }
    }
    const spreadRadius = Math.max(0, Math.max(maxX - minX, maxY - minY)) * 0.1

    for (let y = 0; y < canvas.height; y += sampleRate) {
        for (let x = 0; x < canvas.width; x += sampleRate) {
            const alpha = data[(y * canvas.width + x) * 4 + 3]
            if (alpha <= 0) continue
            const originalAlpha = alpha / 255
            const angle = Math.random() * Math.PI * 2
            const distance = Math.random() * spreadRadius
            particles.push({
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                originalX: x,
                originalY: y,
                opacity: originalAlpha * 0.3,
                sparkleOp: originalAlpha * 0.3,
                originalAlpha,
                floatingSpeed: Math.random() * 2 + 1,
                floatingAngle: Math.random() * Math.PI * 2,
                targetOpacity: Math.random() * originalAlpha * 0.5,
                sparkleSpeed: Math.random() * 2 + 1,
            })
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    return particles
}

function updateParticles(
    particles: Particle[],
    deltaTime: number,
    p: number,
    noise: number,
    speed: number
) {
    const NOISE_SCALE = 0.6
    const CHAOS_FACTOR = 1.3
    const time = performance.now() * 0.001
    const inv = 1 - p

    for (const particle of particles) {
        particle.floatingAngle +=
            deltaTime * particle.floatingSpeed * (1 + Math.random() * CHAOS_FACTOR)
        const uniqueOffset = particle.floatingSpeed * 2e3
        const noiseX =
            (Math.sin(time * particle.floatingSpeed + particle.floatingAngle) * 1.2 +
                Math.sin((time + uniqueOffset) * 0.5) * 0.8 +
                (Math.random() - 0.5) * CHAOS_FACTOR) *
            NOISE_SCALE
        const noiseY =
            (Math.cos(time * particle.floatingSpeed + particle.floatingAngle * 1.5) * 0.6 +
                Math.cos((time + uniqueOffset) * 0.5) * 0.4 +
                (Math.random() - 0.5) * CHAOS_FACTOR) *
            NOISE_SCALE

        const floatX = particle.originalX + noise * noiseX
        const floatY = particle.originalY + noise * noiseY
        const targetX = floatX + (particle.originalX - floatX) * p
        const targetY = floatY + (particle.originalY - floatY) * p
        const follow = 6 + p * 10

        particle.x +=
            (targetX - particle.x) * follow * deltaTime + (Math.random() - 0.5) * speed * inv
        particle.y +=
            (targetY - particle.y) * follow * deltaTime + (Math.random() - 0.5) * speed * inv

        if (p >= 0.999) {
            particle.x = particle.originalX
            particle.y = particle.originalY
        }

        const opacityDiff = particle.targetOpacity - particle.sparkleOp
        particle.sparkleOp += opacityDiff * particle.sparkleSpeed * deltaTime * 3
        if (Math.abs(opacityDiff) < 0.01) {
            particle.targetOpacity =
                Math.random() < 0.5
                    ? Math.random() * 0.1 * particle.originalAlpha
                    : particle.originalAlpha * 3
            particle.sparkleSpeed = Math.random() * 3 + 1
        }
        const idleOp = Math.max(0, Math.min(particle.originalAlpha, particle.sparkleOp))
        const formFade = p < FADE_OUT ? 1 : Math.max(0, 1 - (p - FADE_OUT) / (1 - FADE_OUT))
        particle.opacity = (idleOp + (particle.originalAlpha - idleOp) * p) * formFade
    }
}

type Props = {
    text: string
    /** Rendered font size in CSS px — drive from a measured/fitted value. */
    fontSize: number
    /** Height of the particle field; give the dust room above and below. */
    boxHeight?: number
    fontWeight?: number
    fontFamily?: string
    /** Tracking in em, matching the CSS `letter-spacing` applied to the text. */
    tracking?: number
    color?: string
    noise?: number
    density?: number
    duration?: number
    delay?: number
    align?: "left" | "center"
    className?: string
    style?: React.CSSProperties
    tag?: "h1" | "h2" | "div" | "span"
}

export default function DustTextReveal({
    text,
    fontSize,
    boxHeight,
    fontWeight = 600,
    fontFamily = "Inter, sans-serif",
    tracking = -0.04,
    color = "#ffffff",
    noise = 46,
    density = 9,
    duration = 1.7,
    delay = 0,
    align = "center",
    className,
    style,
    tag: Tag = "div",
}: Props) {
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const particlesRef = useRef<Particle[]>([])
    const rafRef = useRef<number>(0)
    const lastTimeRef = useRef(performance.now())
    const progressRef = useRef(0)

    const [armed, setArmed] = useState(false)
    const [showText, setShowText] = useState(false)
    const [fontReady, setFontReady] = useState(false)
    const [metrics, setMetrics] = useState<Metrics | null>(null)

    const reduced = usePrefersReducedMotion()
    const dpr = useMemo(
        () => (typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, 2)),
        []
    )
    const sampleDensity = DENSITY_MAP[Math.max(1, Math.min(10, Math.round(density))) - 1]
    const speed = Math.min(3, Math.max(0.1, 0.5 / Math.max(0.1, duration)))
    const height = boxHeight ?? Math.round(fontSize * 1.34)

    useEffect(() => {
        let cancelled = false
        const ready = (document as any).fonts?.ready ?? Promise.resolve()
        ready.then(() => !cancelled && setFontReady(true))
        return () => {
            cancelled = true
        }
    }, [])

    // Arm once the headline scrolls into view.
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    window.setTimeout(() => setArmed(true), delay * 1000)
                    io.disconnect()
                }
            },
            { threshold: 0.2 }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [delay])

    const rebuild = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas || !fontSize || !height) return
        const width = wrapperRef.current?.clientWidth ?? 0
        if (!width) return

        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`

        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (!ctx) return

        const font = `${fontWeight} ${fontSize * dpr}px ${fontFamily}`
        ctx.font = font
        const m = ctx.measureText(text)
        const next: Metrics = {
            ascent: m.actualBoundingBoxAscent / dpr,
            descent: m.actualBoundingBoxDescent / dpr,
            boxAscent: (m.fontBoundingBoxAscent ?? m.actualBoundingBoxAscent) / dpr,
            boxDescent: (m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent) / dpr,
        }
        setMetrics(next)

        // Centre the *ink* box of the word inside the field, then draw from
        // the alphabetic baseline that implies.
        const baselineY = (height / 2 + (next.ascent - next.descent) / 2) * dpr

        particlesRef.current = createParticles(
            ctx,
            canvas,
            text,
            font,
            `${tracking * fontSize * dpr}px`,
            baselineY,
            align,
            sampleDensity,
            dpr
        )
    }, [fontSize, height, fontWeight, fontFamily, tracking, text, sampleDensity, dpr, align])

    useEffect(() => {
        if (!fontReady) return
        rebuild()
    }, [rebuild, fontReady])

    // Safety net: if the canvas path never gets going (no 2D context, fonts
    // that never resolve), the headline must still end up on screen.
    useEffect(() => {
        const t = window.setTimeout(() => setShowText(true), 3500)
        return () => window.clearTimeout(t)
    }, [])

    useEffect(() => {
        if (reduced) {
            setShowText(true)
            return
        }
        if (!fontReady) return

        const loop = (now: number) => {
            const deltaTime = Math.min((now - lastTimeRef.current) / 1000, 0.05)
            lastTimeRef.current = now
            const canvas = canvasRef.current
            const ctx = canvas?.getContext("2d")
            if (!canvas || !ctx || !particlesRef.current.length) {
                rafRef.current = requestAnimationFrame(loop)
                return
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const target = armed ? 1 : 0
            const rate = deltaTime / Math.max(0.05, duration)
            const cur = progressRef.current
            progressRef.current =
                cur < target ? Math.min(target, cur + rate) : Math.max(target, cur - rate)
            const p = easeInOut(progressRef.current)

            updateParticles(particlesRef.current, deltaTime, p, noise * dpr, speed)
            setShowText(p > TEXT_IN)

            // Bucket by rounded opacity so the fill style changes rarely.
            const buckets = new Map<number, Particle[]>()
            for (const particle of particlesRef.current) {
                if (particle.opacity <= 0.015) continue
                const key = Math.round(particle.opacity * 16)
                const bucket = buckets.get(key)
                if (bucket) bucket.push(particle)
                else buckets.set(key, [particle])
            }
            ctx.fillStyle = color
            for (const [key, group] of buckets) {
                ctx.globalAlpha = Math.min(1, key / 16)
                for (const particle of group) ctx.fillRect(particle.x, particle.y, dpr, dpr)
            }
            ctx.globalAlpha = 1

            // Fully formed — the DOM text has taken over, stop burning frames.
            if (progressRef.current >= 1) return

            rafRef.current = requestAnimationFrame(loop)
        }

        lastTimeRef.current = performance.now()
        rafRef.current = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(rafRef.current)
    }, [armed, noise, speed, duration, color, dpr, reduced, fontReady])

    // Place the DOM headline so its baseline sits exactly where the canvas
    // drew one: line box top + half-leading + font ascent.
    const lineHeight = fontSize
    const domTop = metrics
        ? height / 2 +
          (metrics.ascent - metrics.descent) / 2 -
          ((lineHeight - (metrics.boxAscent + metrics.boxDescent)) / 2 + metrics.boxAscent)
        : 0

    return (
        <div
            ref={wrapperRef}
            className={className}
            style={{ position: "relative", height, width: "100%", ...style }}
        >
            <Tag
                style={{
                    position: "absolute",
                    top: domTop,
                    left: 0,
                    right: 0,
                    margin: 0,
                    color,
                    fontFamily,
                    fontWeight,
                    fontSize: `${fontSize}px`,
                    letterSpacing: `${tracking}em`,
                    lineHeight: `${lineHeight}px`,
                    textAlign: align,
                    whiteSpace: "nowrap",
                    opacity: reduced || showText ? 1 : 0,
                    transition: `opacity ${duration * (FADE_OUT - TEXT_IN)}s linear`,
                }}
            >
                {text}
            </Tag>
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    opacity: reduced ? 0 : 1,
                }}
            />
        </div>
    )
}
