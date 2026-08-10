import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import BlackHole from "../effects/BlackHole"
import { Plus, Reveal, SectionHead } from "../components/common"
import { experience } from "../data"

export default function Work() {
    // The current role starts open; the rest expand on demand.
    const [open, setOpen] = useState<number | null>(0)

    return (
        <section className="section" id="work">
            <div className="work-hole" aria-hidden="true">
                <BlackHole
                    particleCount={760}
                    voidRadius={54}
                    outerRadius={62}
                    orbitSpeed={3.2}
                    tilt={18}
                    tiltSideway={158}
                    particleSize={3}
                />
            </div>

            <div className="shell">
                <SectionHead
                    index="01"
                    label="Work"
                    title="Where I've worked"
                    note="Four roles across two countries — research-side ML at a Kathmandu-valley product studio, then the software that two large Ontario venues run their operations on: agents, automation and real-time services."
                />

                <div className="work-list">
                    {experience.map((job, i) => {
                        const isOpen = open === i
                        return (
                            <Reveal
                                className={`job${isOpen ? " is-open" : ""}`}
                                key={`${job.company}-${job.period}`}
                                delay={i * 60}
                            >
                                <button
                                    className="job-head"
                                    onClick={() => setOpen(isOpen ? null : i)}
                                    aria-expanded={isOpen}
                                    aria-controls={`job-panel-${i}`}
                                >
                                    <span className="job-num">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <h3 className="job-title">
                                        {job.company}
                                        {job.current ? (
                                            <span className="job-live">
                                                <i />
                                                Current
                                            </span>
                                        ) : null}
                                    </h3>
                                    <span className="job-role">{job.role}</span>
                                    <span className="job-period mono">{job.period}</span>
                                    <span className="job-toggle" aria-hidden="true">
                                        <Plus />
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen ? (
                                        <motion.div
                                            className="job-body"
                                            id={`job-panel-${i}`}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                duration: 0.45,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                        >
                                            <div className="job-body-inner">
                                                <ul className="job-bullets">
                                                    {job.bullets.map((bullet, bi) => (
                                                        <li key={bi}>{bullet}</li>
                                                    ))}
                                                </ul>
                                                <div className="job-aside">
                                                    <span className="mono" style={{ color: "var(--fg-4)" }}>
                                                        {job.location}
                                                    </span>
                                                    <div className="chips">
                                                        {job.stack.map((tag) => (
                                                            <span className="chip" key={tag}>
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </Reveal>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
