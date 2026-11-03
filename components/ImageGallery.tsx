// components/ImageGallery.tsx
// Public image gallery with animated grid and full-screen lightbox
// Keyboard: ← → to navigate, Esc to close. Swipe on touch devices.

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react"

export default function ImageGallery({
  images,
  title,
  heading = "Gallery",
}: {
  images: string[]
  title: string
  heading?: string
}) {
  const [open, setOpen] = useState<number | null>(null)
  const [dir, setDir]   = useState(0)
  const touchX          = useRef<number | null>(null)

  const go = useCallback((delta: number) => {
    setDir(delta)
    setOpen((i) => (i === null ? i : (i + delta + images.length) % images.length))
  }, [images.length])

  useEffect(() => {
    if (open === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape")     setOpen(null)
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft")  go(-1)
    }
    document.addEventListener("keydown", onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
    }
  }, [open, go])

  if (!images || images.length === 0) return null

  return (
    <div style={{ margin: "2.5rem 0" }}>
      <h2 style={{
        fontFamily: "DM Serif Display, serif", fontSize: "1.5rem",
        color: "var(--text-primary)", marginBottom: "0.5rem",
        display: "flex", alignItems: "center", gap: "0.5rem",
      }}>
        <Images size={20} color="var(--accent)" />
        {heading}
      </h2>
      <div className="divider" />

      <div style={{
        display: "grid",
        gridTemplateColumns: images.length === 1 ? "1fr" : "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "0.85rem",
      }}>
        {images.map((src, i) => (
          <motion.button
            key={`${src}-${i}`}
            type="button"
            onClick={() => { setDir(0); setOpen(i) }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.05 }}
            whileHover={{ y: -4 }}
            aria-label={`Open image ${i + 1} of ${images.length}`}
            style={{
              position: "relative", aspectRatio: images.length === 1 ? "16/9" : "4/3",
              borderRadius: "0.6rem", overflow: "hidden", padding: 0,
              border: "1px solid var(--border)", background: "var(--bg-secondary)",
              cursor: "zoom-in", boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            }}
          >
            <Image
              src={src}
              alt={`${title} — image ${i + 1}`}
              fill
              sizes={images.length === 1 ? "(max-width: 960px) 100vw, 900px" : "(max-width: 640px) 50vw, 300px"}
              style={{ objectFit: "cover" }}
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} gallery`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return
              const delta = e.changedTouches[0].clientX - touchX.current
              if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1)
              touchX.current = null
            }}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: "rgba(10,10,10,0.92)", backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "3.5rem 1rem",
            }}
          >
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.div
                key={open}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir * -60, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                style={{ position: "relative", width: "min(1100px, 100%)", height: "100%" }}
              >
                <Image
                  src={images[open]}
                  alt={`${title} — image ${open + 1}`}
                  fill
                  sizes="100vw"
                  style={{ objectFit: "contain" }}
                  priority
                />
              </motion.div>
            </AnimatePresence>

            <span style={{
              position: "absolute", top: "1.1rem", left: "50%", transform: "translateX(-50%)",
              color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", fontWeight: 600,
            }}>
              {open + 1} / {images.length}
            </span>

            <LightboxButton label="Close" style={{ top: "0.9rem", right: "0.9rem" }} onClick={() => setOpen(null)}>
              <X size={18} />
            </LightboxButton>
            {images.length > 1 && (
              <>
                <LightboxButton label="Previous image" style={{ left: "0.9rem", top: "50%", transform: "translateY(-50%)" }} onClick={() => go(-1)}>
                  <ChevronLeft size={20} />
                </LightboxButton>
                <LightboxButton label="Next image" style={{ right: "0.9rem", top: "50%", transform: "translateY(-50%)" }} onClick={() => go(1)}>
                  <ChevronRight size={20} />
                </LightboxButton>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LightboxButton({
  label,
  style,
  onClick,
  children,
}: {
  label: string
  style: React.CSSProperties
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      style={{
        position: "absolute", width: "2.75rem", height: "2.75rem", borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.12)",
        color: "#fff", cursor: "pointer", zIndex: 2,
        display: "flex", alignItems: "center", justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </button>
  )
}
