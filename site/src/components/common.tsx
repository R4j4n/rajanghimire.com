import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"

/** Fades + lifts children the first time they enter the viewport. */
export function Reveal({
    children,
    delay = 0,
    as: Tag = "div",
    className = "",
    style,
    ...rest
}: {
    children: ReactNode
    delay?: number
    as?: any
    className?: string
    style?: React.CSSProperties
    [key: string]: any
}) {
    const ref = useRef<HTMLElement | null>(null)
    const [seen, setSeen] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setSeen(true)
                    io.disconnect()
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    return (
        <Tag
            ref={ref as any}
            className={`reveal${seen ? " is-in" : ""}${className ? ` ${className}` : ""}`}
            // Merged, not spread over: a caller-supplied `style` must not
            // clobber the stagger variable.
            style={{ ["--delay" as any]: `${delay}ms`, ...style }}
            {...rest}
        >
            {children}
        </Tag>
    )
}

/** The small ↗ used on every outbound link and button. */
export function Arrow({ size = 11 }: { size?: number }) {
    return (
        <svg
            className="arrow"
            width={size}
            height={size}
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M3 9L9 3M9 3H4M9 3V8"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="square"
            />
        </svg>
    )
}

export function Plus({ size = 12 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.2" />
        </svg>
    )
}

/** Section header: mono index on the left, oversized title on the right. */
export function SectionHead({
    index,
    label,
    title,
    note,
}: {
    index: string
    label: string
    title: ReactNode
    note?: ReactNode
}) {
    return (
        <header className="section-head">
            <Reveal className="section-index mono">
                {index} / {label}
            </Reveal>
            <div>
                <Reveal as="h2" className="section-title" delay={60}>
                    {title}
                </Reveal>
                {note ? (
                    <Reveal as="p" className="section-note" delay={120}>
                        {note}
                    </Reveal>
                ) : null}
            </div>
        </header>
    )
}

/**
 * Infinite ticker. The item list is rendered twice inside a track that
 * translates a full -100%, so the seam is never visible.
 */
export function Marquee({
    items,
    duration = 44,
    direction = "ltr",
}: {
    items: string[]
    duration?: number
    direction?: "ltr" | "rtl"
}) {
    const row = (key: string) => (
        <div className="marquee-track" key={key} aria-hidden={key === "b"}>
            {items.map((item, i) => (
                <span className="marquee-item" key={`${item}-${i}`}>
                    {item}
                </span>
            ))}
        </div>
    )
    return (
        <div
            className="marquee"
            data-dir={direction}
            style={{ ["--dur" as any]: `${duration}s` }}
        >
            {row("a")}
            {row("b")}
        </div>
    )
}

/**
 * Solves for the font size at which `text` exactly fills `width`.
 *
 * Advance width is linear in font size, and the em-based tracking is too,
 * so one measurement at a reference size is enough:
 *   width(size) = (advance@100 / 100 + tracking * (len - 1)) * size
 */
export function useFittedFontSize(
    text: string,
    width: number,
    {
        weight = 600,
        family = "Inter, sans-serif",
        tracking = -0.04,
        max = 260,
        min = 28,
    }: { weight?: number; family?: string; tracking?: number; max?: number; min?: number } = {}
) {
    const [size, setSize] = useState(min)
    const [fontsReady, setFontsReady] = useState(false)

    useEffect(() => {
        let cancelled = false
        const ready = (document as any).fonts?.ready ?? Promise.resolve()
        ready.then(() => !cancelled && setFontsReady(true))
        return () => {
            cancelled = true
        }
    }, [])

    useLayoutEffect(() => {
        if (!width || !text) return
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        const REF = 100
        ctx.font = `${weight} ${REF}px ${family}`
        const advancePerPx = ctx.measureText(text).width / REF
        const perPx = advancePerPx + tracking * Math.max(0, text.length - 1)
        if (perPx <= 0) return
        setSize(Math.max(min, Math.min(max, width / perPx)))
    }, [text, width, weight, family, tracking, max, min, fontsReady])

    return size
}

/** Reports the content-box width of an element, live. */
export function useElementWidth<T extends HTMLElement>() {
    const ref = useRef<T | null>(null)
    const [width, setWidth] = useState(0)
    useLayoutEffect(() => {
        const el = ref.current
        if (!el) return
        const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
        ro.observe(el)
        setWidth(el.clientWidth)
        return () => ro.disconnect()
    }, [])
    return { ref, width }
}

/** Wall-clock in a given IANA zone, ticking once a second. */
export function useLocalTime(timeZone: string) {
    const [now, setNow] = useState(() => new Date())
    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), 1000)
        return () => window.clearInterval(id)
    }, [])
    try {
        return new Intl.DateTimeFormat("en-GB", {
            timeZone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).format(now)
    } catch {
        return ""
    }
}
