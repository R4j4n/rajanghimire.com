/**
 * Typewriter — ported from references/referebce7.html (Originkit).
 *
 * Types a string, holds, deletes it, moves to the next and loops. The
 * state machine is a recursive setTimeout chain (kept from the reference:
 * an interval would flatten the type / delete / hold delays into one).
 * The Framer RenderTarget plumbing is dropped; the reduced-motion path
 * shows the first phrase fully typed instead.
 */
import { useEffect, useState } from "react"
import { motion, type Variants } from "framer-motion"
import { usePrefersReducedMotion } from "./useVisible"

type Props = {
    texts: string[]
    prefix?: string
    typeSpeed?: number
    deleteSpeed?: number
    holdTime?: number
    showCursor?: boolean
    cursorChar?: string
    className?: string
    typedClassName?: string
    cursorClassName?: string
}

const CURSOR_VARIANTS: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.01,
            repeat: Infinity,
            repeatDelay: 0.4,
            repeatType: "reverse",
        },
    },
}

export default function Typewriter({
    texts,
    prefix = "",
    typeSpeed = 0.07,
    deleteSpeed = 0.035,
    holdTime = 1.9,
    showCursor = true,
    cursorChar = "_",
    className,
    typedClassName,
    cursorClassName,
}: Props) {
    const reduced = usePrefersReducedMotion()

    const typeDelayMs = Math.max(0, typeSpeed * 1000)
    const holdMs = Math.max(0, holdTime * 1000)
    const deleteDelayMs = Math.max(0, deleteSpeed * 1000)

    const list = (texts ?? []).filter((t): t is string => typeof t === "string")
    const hasTexts = list.length > 0

    const [displayText, setDisplayText] = useState("")
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [currentTextIndex, setCurrentTextIndex] = useState(0)

    useEffect(() => {
        if (reduced || !hasTexts) return

        let timeout: ReturnType<typeof setTimeout> | undefined
        const currentText = list[currentTextIndex] ?? ""

        if (isDeleting) {
            if (displayText === "") {
                setIsDeleting(false)
                setCurrentTextIndex((prev) => (prev + 1) % list.length)
                setCurrentIndex(0)
            } else {
                timeout = setTimeout(
                    () => setDisplayText((prev) => prev.slice(0, -1)),
                    deleteDelayMs
                )
            }
        } else if (currentIndex < currentText.length) {
            timeout = setTimeout(() => {
                setDisplayText((prev) => prev + currentText[currentIndex])
                setCurrentIndex((prev) => prev + 1)
            }, typeDelayMs)
        } else if (list.length > 1) {
            timeout = setTimeout(() => setIsDeleting(true), holdMs)
        }

        return () => {
            if (timeout) clearTimeout(timeout)
        }
        // `list` is rebuilt each render; depending on it would double-fire the
        // chain. Changes to `texts` reach us through the reset effect below.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentIndex,
        displayText,
        isDeleting,
        typeDelayMs,
        deleteDelayMs,
        holdMs,
        currentTextIndex,
        hasTexts,
        reduced,
    ])

    const textsKey = list.join("")
    useEffect(() => {
        setDisplayText("")
        setCurrentIndex(0)
        setIsDeleting(false)
        setCurrentTextIndex(0)
    }, [textsKey])

    const rendered = reduced ? (list[0] ?? "") : displayText

    return (
        <span className={className}>
            {prefix ? <span aria-hidden="true">{prefix}</span> : null}
            <span className={typedClassName}>{rendered}</span>
            {showCursor &&
                (reduced ? (
                    <span className={cursorClassName} aria-hidden="true">
                        {cursorChar}
                    </span>
                ) : (
                    <motion.span
                        variants={CURSOR_VARIANTS}
                        initial="initial"
                        animate="animate"
                        className={cursorClassName}
                        aria-hidden="true"
                    >
                        {cursorChar}
                    </motion.span>
                ))}
        </span>
    )
}
