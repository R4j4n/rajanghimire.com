import { useEffect, useRef, useState } from "react"
import { WIREFRAME_STROKES, WIREFRAME_VIEWBOX } from "./wireframePaths"

type Props = {
    /** How long the whole drawing takes — one value drives all 140 strokes. */
    draw?: string
    /** Beat before the first stroke. */
    delay?: string
    /** Gap between the ghost fading in and the first stroke landing. */
    lead?: string
    /** How long the faint full drawing takes to fade up. */
    ghostIn?: string
    /** Drop the glow filter — cheaper when something else is already animating. */
    flat?: boolean
    /** Hold the drawing until the caller is ready (e.g. behind the preloader). */
    play?: boolean
    /** Redraw from scratch whenever it scrolls back into view. */
    replay?: boolean
    className?: string
    label?: string
}

// Built once at module scope. The geometry never changes, so there is no
// reason to rebuild 420 elements on any render — and the preloader re-renders
// every frame while its counter runs.
//
// Injecting this markup as a string was the obvious shortcut and it does not
// work: React sets innerHTML on an SVG element by parsing into a detached
// container and adopting the nodes, and Chrome then leaves their CSS
// animations pending — measured at 1.5s late inside the preloader, against
// 26ms for the same markup written into the page statically.
const GROUPS = (
    <>
        <g className="wf-ghost">
            {WIREFRAME_STROKES.map(([d], i) => (
                <path key={i} d={d} />
            ))}
        </g>
        <g className="wf-ink">
            {WIREFRAME_STROKES.map(([d, delay, duration], i) => (
                <path
                    key={i}
                    d={d}
                    pathLength={1}
                    style={{ "--d": delay, "--t": duration } as React.CSSProperties}
                />
            ))}
        </g>
        <g className="wf-pen">
            {WIREFRAME_STROKES.map(([d, delay, duration], i) => (
                <path
                    key={i}
                    d={d}
                    pathLength={1}
                    style={{ "--d": delay, "--t": duration } as React.CSSProperties}
                />
            ))}
        </g>
    </>
)

/**
 * The line-art portrait, drawn stroke by stroke.
 *
 * All of the animation is CSS — see the ".wf" block in styles.css. This
 * component only owns the two things CSS cannot decide for itself: the timing
 * variables, and when the sequence is allowed to start. Both are expressed as
 * the single ".wf-idle" class, which parks every animation; removing it plays
 * the drawing from the top.
 */
export default function Wireframe({
    draw = "12s",
    delay = "0s",
    lead,
    ghostIn,
    flat = false,
    play = true,
    replay = false,
    className,
    label = "Line-art portrait, drawn one stroke at a time",
}: Props) {
    const ref = useRef<HTMLElement | null>(null)
    const [inView, setInView] = useState(!replay)

    useEffect(() => {
        const el = ref.current
        if (!replay || !el) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        const io = new IntersectionObserver(
            ([entry]) => setInView(entry?.isIntersecting ?? false),
            { threshold: 0.25 }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [replay])

    const idle = !play || !inView

    // Parking the animations only rewinds them once the browser has recomputed
    // style; without the reflow a leave/enter pair inside one frame would go
    // unnoticed and the drawing would carry on from where it was.
    useEffect(() => {
        if (idle && ref.current) void ref.current.offsetWidth
    }, [idle])

    const style: Record<string, string> = { "--wf-draw": draw, "--wf-delay": delay }
    if (lead) style["--wf-lead"] = lead
    if (ghostIn) style["--wf-ghost-in"] = ghostIn

    return (
        <figure
            ref={ref}
            className={`wf${flat ? " wf-flat" : ""}${idle ? " wf-idle" : ""}${
                className ? ` ${className}` : ""
            }`}
            style={style as React.CSSProperties}
            aria-label={label}
        >
            <svg viewBox={WIREFRAME_VIEWBOX} role="img" preserveAspectRatio="xMidYMid meet">
                {GROUPS}
            </svg>
        </figure>
    )
}
