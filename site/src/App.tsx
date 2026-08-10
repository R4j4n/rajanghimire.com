import { useCallback, useState } from "react"
import Preloader from "./components/Preloader"
import Nav from "./components/Nav"
import Footer from "./components/Footer"
import Hero from "./sections/Hero"
import About from "./sections/About"
import Work from "./sections/Work"
import Stack from "./sections/Stack"
import Projects from "./sections/Projects"
import Research from "./sections/Research"
import Contact from "./sections/Contact"

export default function App() {
    // `started` holds the hero's dust reveal until the curtain is out of the
    // way, so the animation is not spent behind the preloader.
    const [started, setStarted] = useState(false)
    const onDone = useCallback(() => setStarted(true), [])

    return (
        <>
            <Preloader onDone={onDone} />

            <div className="grid-lines" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
            </div>

            <Nav />

            <main className="page">
                <Hero started={started} />
                <About />
                <Work />
                <Stack />
                <Projects />
                <Research />
                <Contact />
            </main>

            <Footer />
        </>
    )
}
