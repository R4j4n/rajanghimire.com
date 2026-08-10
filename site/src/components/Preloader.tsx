import { useEffect, useState } from "react"
import { meta } from "../data"

/**
 * Counts 000 → 100 while the fonts settle, then lifts off the top of the
 * screen. Capped at ~1.5s so it never becomes the slow part of the load.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
    const [value, setValue] = useState(0)
    const [done, setDone] = useState(false)

    useEffect(() => {
        const start = performance.now()
        const DURATION = 1400
        let raf = 0

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / DURATION)
            // Ease-out so the counter sprints then settles.
            setValue(Math.round((1 - Math.pow(1 - t, 3)) * 100))
            if (t < 1) {
                raf = requestAnimationFrame(tick)
            } else {
                setDone(true)
                window.setTimeout(onDone, 900)
            }
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [onDone])

    return (
        <div className={`preload${done ? " is-done" : ""}`} aria-hidden="true">
            <div className="preload-row">
                <span className="preload-name">{meta.name}</span>
                <span className="preload-count">{String(value).padStart(3, "0")}</span>
            </div>
            <div className="preload-bar">
                <i style={{ width: `${value}%` }} />
            </div>
        </div>
    )
}
