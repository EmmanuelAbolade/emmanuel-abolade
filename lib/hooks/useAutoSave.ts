// lib/hooks/useAutoSave.ts
// Custom hook for auto-saving post drafts to localStorage
// Saves 2 seconds after every change and on unmount — but only once the form
// differs from what it started with, so an empty/untouched form never
// overwrites a real draft. Call stop() after a successful submit.

import { useEffect, useRef, useCallback } from "react"

type AutoSaveData = Record<string, unknown>

export function useAutoSave(
  key: string,
  data: AutoSaveData,
  enabled: boolean = true
) {
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dataRef     = useRef(data)
  const baselineRef = useRef<string | null>(null)
  const stoppedRef  = useRef(false)

  // Keep dataRef current on every render; remember the starting state once
  useEffect(() => {
    dataRef.current = data
    if (baselineRef.current === null) baselineRef.current = JSON.stringify(data)
  })

  const saveNow = useCallback(() => {
    if (!enabled || stoppedRef.current) return
    const json = JSON.stringify(dataRef.current)
    if (json === baselineRef.current) return // nothing changed yet
    try {
      const payload = JSON.stringify({
        data:    dataRef.current,
        savedAt: new Date().toISOString(),
      })
      localStorage.setItem(`autosave:${key}`, payload)
    } catch {
      // localStorage unavailable
    }
  }, [enabled, key])

  // Debounce — save 2 seconds after last change
  useEffect(() => {
    if (!enabled) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(saveNow, 2000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [data, enabled, saveNow])

  // Save immediately on unmount
  useEffect(() => {
    return () => {
      saveNow()
    }
  }, [saveNow])

  // Forget the stored draft and treat the current form as the new starting point
  const reset = useCallback(() => {
    clearAutoSave(key)
    baselineRef.current = JSON.stringify(dataRef.current)
  }, [key])

  // Clear the draft and stop saving (e.g. after the post was saved to the database)
  const stop = useCallback(() => {
    stoppedRef.current = true
    if (timerRef.current) clearTimeout(timerRef.current)
    clearAutoSave(key)
  }, [key])

  return { saveNow, reset, stop }
}

export function getAutoSave(key: string): { data: AutoSaveData; savedAt: string } | null {
  try {
    const raw = localStorage.getItem(`autosave:${key}`)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearAutoSave(key: string): void {
  try {
    localStorage.removeItem(`autosave:${key}`)
  } catch {
    // ignore
  }
}
