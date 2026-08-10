import { Suspense, lazy } from "react"
import { Arrow, Reveal } from "../components/common"
import { useIsCompact } from "../effects/useVisible"
import { contact, meta } from "../data"

// three.js is by far the largest dependency on the page and it is only ever
// needed here, so it is split out and fetched when this section renders.
const ParticleSphere = lazy(() => import("../effects/ParticleSphere"))

export default function Contact() {
    // The WebGL sphere is the heaviest thing on the page — phones get the
    // typography without it.
    const compact = useIsCompact()

    return (
        <section className="section contact" id="contact">
            {!compact ? (
                <div className="contact-sphere" aria-hidden="true">
                    <Suspense fallback={null}>
                        <ParticleSphere
                            particlesCount={5200}
                            particleSize={0.013}
                            radius={1.4}
                            cursorRadius={200}
                            cursorStrength={7}
                        />
                    </Suspense>
                </div>
            ) : null}

            <div className="shell">
                <Reveal as="p" className="mono" style={{ color: "var(--fg-3)", textAlign: "center" }}>
                    05 / Contact
                </Reveal>

                <Reveal as="h2" className="contact-lead" delay={60}>
                    {contact.lead}
                </Reveal>

                <Reveal as="p" className="contact-intro" delay={120}>
                    {contact.intro}
                </Reveal>

                <Reveal delay={180}>
                    <a className="contact-mail" href={`mailto:${meta.email}`}>
                        {meta.email}
                    </a>
                </Reveal>

                <div className="contact-grid">
                    {contact.links.map((link, i) => (
                        <Reveal key={link.label} delay={i * 60}>
                            <a
                                className="contact-cell"
                                href={link.href}
                                target={link.href.startsWith("http") ? "_blank" : undefined}
                                rel={link.href.startsWith("http") ? "noreferrer noopener" : undefined}
                            >
                                <span className="contact-label mono">{link.label}</span>
                                <span className="contact-value">
                                    {link.value}
                                    <Arrow />
                                </span>
                            </a>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
