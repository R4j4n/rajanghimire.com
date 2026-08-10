import { Reveal, SectionHead } from "../components/common"
import { education, publications } from "../data"

export default function Research() {
    return (
        <section className="section" id="research">
            <div className="shell">
                <SectionHead
                    index="04"
                    label="Research"
                    title="Published work"
                    note="Two conference papers from Kantipur Engineering College, both on making input and interaction work for languages and users the mainstream stack ignores."
                />

                <div className="pub-list">
                    {publications.map((pub, i) => (
                        <Reveal className="pub" as="article" key={pub.title} delay={i * 80}>
                            <div className="pub-year">{pub.year}</div>
                            <div>
                                <h3 className="pub-title">{pub.title}</h3>
                                <p className="pub-authors">{pub.authors}</p>
                            </div>
                            <div>
                                <div className="pub-venue mono">{pub.venue}</div>
                                <p className="pub-details">{pub.details}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <h3 className="mono" style={{ color: "var(--fg-3)", margin: "clamp(52px, 6vw, 90px) 0 26px" }}>
                    Education
                </h3>

                <div className="edu-grid">
                    {education.map((item, i) => (
                        <Reveal className="edu" as="article" key={item.school} delay={i * 80}>
                            <h4 className="edu-school">{item.school}</h4>
                            <p className="edu-degree">{item.degree}</p>
                            <div className="edu-foot mono">
                                <span>{item.location}</span>
                                <span>{item.period}</span>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
