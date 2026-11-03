// components/FloatingBadges.tsx
// Floating status cards around a profile photo
// Badges are spread across the given slots; each slot gently floats and rotates its badges

"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { Badge } from "@/lib/site-content"

type Props = {
  badges: Badge[]
  slots: React.CSSProperties[]
  size?: "sm" | "md"
  interval?: number
}

export default function FloatingBadges({ badges, slots, size = "sm", interval = 3600 }: Props) {
  if (badges.length === 0 || slots.length === 0) return null

  const used = Math.min(slots.length, badges.length)
  const groups = Array.from({ length: used }, (_, s) =>
    badges.filter((_, i) => i % used === s)
  )

  return (
    <>
      {groups.map((group, s) => (
        <BadgeSlot
          key={s}
          badges={group}
          style={slots[s]}
          size={size}
          interval={interval}
          offset={s}
        />
      ))}
    </>
  )
}

function BadgeSlot({
  badges,
  style,
  size,
  interval,
  offset,
}: {
  badges: Badge[]
  style: React.CSSProperties
  size: "sm" | "md"
  interval: number
  offset: number
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (badges.length < 2) return
    let timer: ReturnType<typeof setInterval>
    // Stagger slots so they don't all change at once
    const start = setTimeout(() => {
      timer = setInterval(() => setIndex((i) => (i + 1) % badges.length), interval)
    }, offset * 1300)
    return () => { clearTimeout(start); clearInterval(timer) }
  }, [badges.length, interval, offset])

  const badge = badges[index % badges.length]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.4, delay: 0.5 + offset * 0.2 },
        scale:   { duration: 0.4, delay: 0.5 + offset * 0.2 },
        y:       { duration: 3 + offset * 0.7, repeat: Infinity, ease: "easeInOut" },
      }}
      style={{
        position: "absolute", zIndex: 2,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: size === "md" ? "0.85rem 1.15rem" : "0.6rem 0.95rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        backdropFilter: "blur(6px)",
        minWidth: size === "md" ? "9.5rem" : "8rem",
        ...style,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${badge.label}-${badge.value}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
        >
          <span style={{ position: "relative", width: "8px", height: "8px", flexShrink: 0 }}>
            <motion.span
              animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "var(--accent)",
              }}
            />
            <span style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "var(--accent)",
            }} />
          </span>
          <div style={{ textAlign: "left" }}>
            {badge.label && (
              <p style={{
                fontSize: size === "md" ? "0.7rem" : "0.65rem",
                color: "var(--text-muted)", marginBottom: "0.1rem",
                fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
              }}>
                {badge.label}
              </p>
            )}
            <p style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: size === "md" ? "0.95rem" : "0.9rem",
              color: "var(--text-primary)", whiteSpace: "nowrap",
            }}>
              {badge.value}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
