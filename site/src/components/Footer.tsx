import { meta } from "../data"
import { Arrow, useLocalTime } from "./common"

export default function Footer() {
    const time = useLocalTime(meta.timezone)

    return (
        <footer className="footer">
            <div className="shell footer-inner mono">
                <span>
                    © {new Date().getFullYear()} {meta.name}
                </span>

                <div className="footer-links">
                    <a href={meta.github} target="_blank" rel="noreferrer noopener">
                        GitHub
                    </a>
                    <a href={meta.linkedin} target="_blank" rel="noreferrer noopener">
                        LinkedIn
                    </a>
                    <a href={`mailto:${meta.email}`}>Email</a>
                    <a href={meta.resume} download>
                        Résumé
                    </a>
                </div>

                <span>
                    {meta.locationShort} — {time}
                </span>

                <a className="to-top" href="#top">
                    Back to top
                    <Arrow />
                </a>
            </div>
        </footer>
    )
}
