import { useEffect, useState } from "react"
import ReactiveLines from "../effects/ReactiveLines"
import DustTextReveal from "../effects/DustTextReveal"
import Typewriter from "../effects/Typewriter"
import { Arrow, Reveal, useElementWidth, useFittedFontSize } from "../components/common"
import { hero, meta } from "../data"

const BOX = 1.2 // dust-field height as a multiple of the font size

export default function Hero({ started }: { started: boolean }) {
    const { ref, width } = useElementWidth<HTMLDivElement>()
    const [vh, setVh] = useState(() =>
        typeof window === "undefined" ? 900 : window.innerHeight
    )

    useEffect(() => {
        const onResize = () => setVh(window.innerHeight)
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])

    // Each line is set to fill the measure, but capped against the viewport
    // height so the name never pushes the call to action below the fold.
    // Tall screens get a name that reaches the right margin; short ones get a
    // deliberately ragged right.
    const cap = Math.min(300, vh * 0.19)
    const firstSize = useFittedFontSize(meta.firstName, width, { max: cap })
    const lastSize = useFittedFontSize(meta.lastName, width, { max: cap })

    return (
        <section className="hero" id="top">
            <div className="hero-canvas">
                <ReactiveLines />
            </div>

            <div className="shell">
                <Reveal className="hero-eyebrow mono" delay={80}>
                    <i />
                    {hero.badge}
                    <em>—</em>
                    {meta.location}
                </Reveal>

                <div className="hero-name" ref={ref}>
                    {width > 0 && started ? (
                        <>
                            <DustTextReveal
                                text={meta.firstName}
                                fontSize={firstSize}
                                boxHeight={Math.round(firstSize * BOX)}
                                align="left"
                                tag="h1"
                                fontWeight={600}
                                delay={0.15}
                            />
                            <DustTextReveal
                                text={meta.lastName}
                                fontSize={lastSize}
                                boxHeight={Math.round(lastSize * BOX)}
                                align="left"
                                tag="div"
                                fontWeight={600}
                                delay={0.4}
                                style={{ marginTop: -lastSize * 0.16 }}
                            />
                        </>
                    ) : (
                        // Reserve the block height so nothing jumps when the
                        // dust layers mount.
                        <div
                            style={{
                                height: Math.round(
                                    (firstSize + lastSize) * BOX - lastSize * 0.16
                                ),
                            }}
                        />
                    )}
                </div>

                <div className="hero-meta">
                    <div>
                        <Reveal as="p" className="hero-role" delay={140}>
                            <Typewriter
                                texts={hero.roles}
                                prefix="I work as an "
                                typedClassName="hero-role-typed"
                                cursorClassName="hero-role-cursor"
                            />
                        </Reveal>
                        <Reveal as="p" className="hero-desc" delay={200} style={{ marginTop: 18 }}>
                            {hero.description}
                        </Reveal>
                        <Reveal className="hero-actions" delay={260}>
                            <a className="btn btn-solid" href="#work">
                                View the work
                            </a>
                            <a className="btn btn-ghost" href={`mailto:${meta.email}`}>
                                Get in touch
                                <Arrow />
                            </a>
                        </Reveal>
                    </div>

                    <Reveal delay={320}>
                        <ul className="hero-links mono">
                            <li>
                                <a href={meta.github} target="_blank" rel="noreferrer noopener">
                                    {meta.githubLabel}
                                    <Arrow />
                                </a>
                            </li>
                            <li>
                                <a href={meta.linkedin} target="_blank" rel="noreferrer noopener">
                                    {meta.linkedinLabel}
                                    <Arrow />
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${meta.email}`}>
                                    {meta.email}
                                    <Arrow />
                                </a>
                            </li>
                        </ul>
                    </Reveal>
                </div>

                <div className="hero-foot mono">
                    <span className="hero-scroll">Scroll</span>
                    <span>{meta.title}</span>
                </div>
            </div>
        </section>
    )
}
