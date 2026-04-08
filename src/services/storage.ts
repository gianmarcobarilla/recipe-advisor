import type { HistoryEntry } from '../types'

const STORAGE_KEY = 'history'

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}

export function saveHistoryEntry(entry: HistoryEntry): void {
  const history = loadHistory()
  history.unshift(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
