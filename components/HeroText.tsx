// components/HeroText.tsx
// Animated hero typography: eyebrow with drawn accent line + letter reveal,
// and a highlighted headline word that rotates with a hand-drawn underline

"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export function HeroEyebrow({
  text,
  center = false,
}: {
  text: string
  center?: boolean
}) {
  return (
    <div
      aria-label={text}
      style={{
        display: "flex", alignItems: "center", gap: "0.85rem",
        justifyContent: center ? "center" : "flex-start",
        marginBottom: "1.5rem",
      }}
    >
      <motion.span
        aria-hidden
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "2.75rem", opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: "2px", borderRadius: "2px", flexShrink: 0,
          background: "linear-gradient(90deg, transparent, var(--accent))",
        }}
      />
      <span
        aria-hidden
        style={{
          fontSize: "0.78rem", fontWeight: 600,
          letterSpacing: "0.22em", textTransform: "uppercase",
          color: "var(--accent)", whiteSpace: "nowrap",
        }}
      >
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.35, delay: 0.35 + i * 0.022 }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {char}
          </motion.span>
        ))}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 1, 0] }}
          transition={{ duration: 1.6, delay: 0.4 + text.length * 0.022 }}
          style={{
            display: "inline-block", width: "2px", height: "0.95em",
            background: "var(--accent)", marginLeft: "0.35rem",
            verticalAlign: "-0.1em",
          }}
        />
      </span>
      {center && (
        <motion.span
          aria-hidden
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "2.75rem", opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: "2px", borderRadius: "2px", flexShrink: 0,
            background: "linear-gradient(270deg, transparent, var(--accent))",
          }}
        />
      )}
    </div>
  )
}

export function RotatingWord({
  words,
  interval = 2800,
}: {
  words: string[]
  interval?: number
}) {
  const [index, setIndex] = useState(0)
  const list = words.length > 0 ? words : ["experiences"]

  useEffect(() => {
    if (list.length < 2) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % list.length), interval)
    return () => clearInterval(timer)
  }, [list.length, interval])

  const word = list[index % list.length]

  return (
    <span style={{ position: "relative", display: "inline-block", color: "var(--accent)" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          initial={{ opacity: 0, y: "0.35em", filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.35em", filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block" }}
        >
          {word}
          <svg
            aria-hidden
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            style={{
              position: "absolute", left: 0, bottom: "-0.08em",
              width: "100%", height: "0.22em", overflow: "visible",
            }}
          >
            <motion.path
              d="M2 9 C 50 3, 110 3, 198 7"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeInOut" }}
            />
          </svg>
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
