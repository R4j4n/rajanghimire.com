import { useEffect, useState } from "react"
import Wireframe from "../effects/Wireframe"
import { meta } from "../data"

const DURATION = 1400

/**
 * Counts 000 → 100 while the fonts settle, then lifts off the top of the
 * screen. Capped at ~1.5s so it never becomes the slow part of the load.
 *
 * The portrait draws itself against the same clock, so the counter is not just
 * a number next to an animation — it is the progress of the drawing.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
    const [value, setValue] = useState(0)
    const [done, setDone] = useState(false)
    // The drawing is 280 paths. Once the curtain is clear of the screen there
    // is no reason to keep them around, so it is dropped rather than parked.
    const [gone, setGone] = useState(false)

    useEffect(() => {
        const start = performance.now()
        let raf = 0
        let lift = 0

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / DURATION)
            // Ease-out so the counter sprints then settles.
            setValue(Math.round((1 - Math.pow(1 - t, 3)) * 100))
            if (t < 1) {
                raf = requestAnimationFrame(tick)
            } else {
                setDone(true)
                lift = window.setTimeout(() => {
                    setGone(true)
                    onDone()
                }, 900)
            }
        }
        raf = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(raf)
            window.clearTimeout(lift)
        }
    }, [onDone])

    return (
        <div className={`preload${done ? " is-done" : ""}`} aria-hidden="true">
            <div className="preload-art">
                {!gone ? (
                    <Wireframe
                        draw={`${DURATION - 300}ms`}
                        delay="60ms"
                        lead="0s"
                        ghostIn="350ms"
                    />
                ) : null}
            </div>

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
