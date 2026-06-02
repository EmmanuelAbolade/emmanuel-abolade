// lib/hooks/useAutoSave.ts
// Custom hook for auto-saving post drafts to localStorage
// Saves every 30 seconds and restores on page reload

import { useEffect, useRef, useCallback } from "react"

type AutoSaveData = Record<string, unknown>

export function useAutoSave(
  key: string,
  data: AutoSaveData,
  enabled: boolean = true,
  intervalMs: number = 30000
) {
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastSavedRef = useRef<string>("")

  const save = useCallback(() => {
    if (!enabled) return
    try {
      const serialized = JSON.stringify({ data, savedAt: new Date().toISOString() })
      // Only save if data has changed
      if (serialized !== lastSavedRef.current) {
        localStorage.setItem(`autosave:${key}`, serialized)
        lastSavedRef.current = serialized
      }
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, [data, enabled, key])

  // Save on interval
  useEffect(() => {
    if (!enabled) return
    intervalRef.current = setInterval(save, intervalMs)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [save, enabled, intervalMs])

  // Save on unmount
  useEffect(() => {
    return () => { save() }
  }, [save])

  return { save }
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