import { Marquee, Reveal, SectionHead } from "../components/common"
import { skills } from "../data"

const ALL = skills.flatMap((group) => group.items)
const HALF = Math.ceil(ALL.length / 2)

export default function Stack() {
    return (
        <section className="section" id="stack">
            <div className="shell">
                <SectionHead
                    index="02"
                    label="Stack"
                    title="What I build with"
                    note="Tools I reach for without looking them up. Roughly ordered by how often they end up in a repo of mine."
                />
            </div>

            <div className="stack-ticker" aria-hidden="true">
                <Marquee items={ALL.slice(0, HALF)} duration={52} />
                <Marquee items={ALL.slice(HALF)} duration={46} direction="rtl" />
            </div>

            <div className="shell">
                <div className="stack-grid">
                    {skills.map((group, i) => (
                        <Reveal className="stack-col" key={group.name} delay={i * 70}>
                            <h3 className="stack-name mono">
                                <span>{group.name}</span>
                                <span>{String(group.items.length).padStart(2, "0")}</span>
                            </h3>
                            <ul className="stack-items">
                                {group.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
