import TextSphere from "../effects/TextSphere"
import { Reveal, SectionHead } from "../components/common"
import { about, stats } from "../data"

export default function About() {
    return (
        <section className="section" id="about">
            <div className="shell">
                <SectionHead index="00" label="About" title="Models that have to survive production." />

                <div className="about-grid">
                    <div>
                        <Reveal as="p" className="about-lead">
                            {about.lead}
                        </Reveal>
                        <div className="about-body">
                            {about.body.map((paragraph, i) => (
                                <Reveal as="p" key={i} delay={80 + i * 80}>
                                    {paragraph}
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    <Reveal className="about-globe" delay={120}>
                        <TextSphere
                            word={about.globeWord}
                            fontSize={13}
                            fontWeight={500}
                            speed={6}
                            twist={50}
                            letterSpacing={760}
                            color="#ffffff"
                        />
                    </Reveal>
                </div>

                <ul className="stats">
                    {stats.map((stat, i) => (
                        <Reveal as="li" className="stat" key={stat.label} delay={i * 70}>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label mono">{stat.label}</div>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </section>
    )
}
