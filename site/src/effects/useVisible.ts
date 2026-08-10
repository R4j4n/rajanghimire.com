import { useEffect, useRef, useState } from "react"

/**
 * Gates the canvas effects: an element only runs its rAF loop while it is
 * intersecting the viewport. Several of these components each own a
 * requestAnimationFrame loop, so without this the page would drive six
 * simultaneous canvases the moment it loads.
 */
export function useVisible<T extends HTMLElement>(rootMargin = "200px") {
    const ref = useRef<T | null>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const io = new IntersectionObserver(
            ([entry]) => setVisible(entry?.isIntersecting ?? false),
            { rootMargin }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [rootMargin])

    return { ref, visible }
}

/** True when the visitor has asked the OS for reduced motion. */
export function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false)
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        const sync = () => setReduced(mq.matches)
        sync()
        mq.addEventListener("change", sync)
        return () => mq.removeEventListener("change", sync)
    }, [])
    return reduced
}

/** Coarse pointer / narrow viewport — used to shed the heaviest effects. */
export function useIsCompact(query = "(max-width: 860px), (pointer: coarse)") {
    const [compact, setCompact] = useState(false)
    useEffect(() => {
        const mq = window.matchMedia(query)
        const sync = () => setCompact(mq.matches)
        sync()
        mq.addEventListener("change", sync)
        return () => mq.removeEventListener("change", sync)
    }, [query])
    return compact
}
