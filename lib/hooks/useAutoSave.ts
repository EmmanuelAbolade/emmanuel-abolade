// lib/hooks/useAutoSave.ts
// Custom hook for auto-saving post drafts to localStorage
// Saves 2 seconds after every change and on unmount

import { useEffect, useRef, useCallback } from "react"

type AutoSaveData = Record<string, unknown>

export function useAutoSave(
  key: string,
  data: AutoSaveData,
  enabled: boolean = true
) {
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dataRef      = useRef(data)

  // Keep dataRef current on every render
  useEffect(() => {
    dataRef.current = data
  })

  const saveNow = useCallback(() => {
    if (!enabled) return
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

  return { saveNow }
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