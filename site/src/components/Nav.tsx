import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { meta, nav } from "../data"
import { useLocalTime } from "./common"

export default function Nav() {
    const [stuck, setStuck] = useState(false)
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(nav[0].id)
    const time = useLocalTime(meta.timezone)

    useEffect(() => {
        const onScroll = () => setStuck(window.scrollY > 40)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // Highlight whichever section owns the middle of the viewport.
    useEffect(() => {
        const sections = nav
            .map((n) => document.getElementById(n.id))
            .filter((el): el is HTMLElement => Boolean(el))
        if (!sections.length) return

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActive(entry.target.id)
                }
            },
            { rootMargin: "-45% 0px -50% 0px" }
        )
        sections.forEach((s) => io.observe(s))
        return () => io.disconnect()
    }, [])

    useEffect(() => {
        document.body.classList.toggle("is-locked", open)
        return () => document.body.classList.remove("is-locked")
    }, [open])

    return (
        <>
            <nav className={`nav${stuck ? " is-stuck" : ""}`} aria-label="Primary">
                <div className="shell nav-inner">
                    <a className="nav-mark" href="#top" aria-label="Back to top">
                        <i />
                        Rajan Ghimire
                    </a>

                    <ul className="nav-links mono">
                        {nav.map((item) => (
                            <li key={item.id}>
                                <a
                                    className={`nav-link${active === item.id ? " is-active" : ""}`}
                                    href={`#${item.id}`}
                                >
                                    <sup>{item.index}</sup>
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="nav-side mono">
                        <span className="nav-clock">TOR {time}</span>
                        <a className="nav-cta" href={meta.resume} download>
                            Résumé
                        </a>
                        <button
                            className={`nav-burger${open ? " is-open" : ""}`}
                            onClick={() => setOpen((v) => !v)}
                            aria-expanded={open}
                            aria-label={open ? "Close menu" : "Open menu"}
                        >
                            <span />
                            <span />
                        </button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {open ? (
                    <motion.div
                        className="nav-sheet"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <ul>
                            {nav.map((item) => (
                                <li key={item.id}>
                                    <a
                                        className="nav-sheet-link"
                                        href={`#${item.id}`}
                                        onClick={() => setOpen(false)}
                                    >
                                        <span>{item.index}</span>
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="mono" style={{ color: "var(--fg-3)" }}>
                            {meta.location} — {time}
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    )
}
