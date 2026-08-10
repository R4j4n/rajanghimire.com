import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import RubikParticles from "../effects/RubikParticles"
import { Arrow, Reveal, SectionHead } from "../components/common"
import { projects } from "../data"

const TABS = [
    { id: "software", label: "Software" },
    { id: "engineering", label: "Engineering" },
] as const

export default function Projects() {
    const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("software")
    const shown = projects.filter((p) => p.kind === tab)

    return (
        <section className="section" id="projects">
            <div className="shell">
                <div className="proj-head">
                    <div>
                        <SectionHead
                            index="03"
                            label="Projects"
                            title="Things I've built"
                            note="Two halves of the same habit. The software column is models and pipelines — OCR, captioning, text-to-visualization. The engineering column is the systems software around them: agents, fleet services and anything that has to keep running unattended."
                        />

                        <Reveal>
                            <div
                                className="tabs mono"
                                role="tablist"
                                aria-label="Project categories"
                            >
                                {TABS.map((t) => (
                                    <button
                                        key={t.id}
                                        role="tab"
                                        aria-selected={tab === t.id}
                                        className={`tab${tab === t.id ? " is-active" : ""}`}
                                        onClick={() => setTab(t.id)}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </Reveal>
                    </div>

                    <Reveal className="proj-cube" delay={100}>
                        <RubikParticles
                            cubeGrid={3}
                            dotsPerFace={4}
                            dotSize={2}
                            sizePercent={95}
                            rotation={{ x: 2, y: 5, z: 0 }}
                        />
                        <span className="proj-cube-hint mono">Drag to spin</span>
                    </Reveal>
                </div>

                <div className="proj-list">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tab}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {shown.map((project, i) => (
                                <article className="proj" key={project.title}>
                                    <span className="proj-num mono">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>

                                    <div>
                                        <h3 className="proj-title">{project.title}</h3>
                                        <span className="proj-period mono">{project.period}</span>
                                        <div className="proj-foot">
                                            {project.tags.map((tag) => (
                                                <span className="chip" key={tag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="proj-summary">{project.summary}</p>
                                        <ul className="proj-bullets">
                                            {project.bullets.map((bullet, bi) => (
                                                <li key={bi}>{bullet}</li>
                                            ))}
                                        </ul>

                                        {project.link ? (
                                            <a
                                                className="btn btn-ghost"
                                                style={{ marginTop: 20 }}
                                                href={project.link}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                            >
                                                View project
                                                <Arrow />
                                            </a>
                                        ) : null}
                                    </div>
                                </article>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}
