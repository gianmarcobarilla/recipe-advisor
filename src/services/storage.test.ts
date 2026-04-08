import { describe, it, expect, beforeEach } from 'vitest'
import { loadHistory, saveHistoryEntry, clearHistory } from './storage'
import type { HistoryEntry } from '../types'

const makeEntry = (overrides: Partial<HistoryEntry> = {}): HistoryEntry => ({
  id: 'test-id',
  recipeId: '123',
  recipeTitle: 'Pasta',
  recipeThumb: 'https://example.com/pasta.jpg',
  liked: true,
  timestamp: 1000000,
  ingredient: 'Chicken',
  area: 'Italian',
  ...overrides,
})

beforeEach(() => {
  localStorage.clear()
})

describe('loadHistory', () => {
  it('returns an empty array when localStorage is empty', () => {
    expect(loadHistory()).toEqual([])
  })

  it('returns an empty array when stored value is invalid JSON', () => {
    localStorage.setItem('history', 'not-valid-json')
    expect(loadHistory()).toEqual([])
  })

  it('returns the stored entries', () => {
    const entry = makeEntry()
    localStorage.setItem('history', JSON.stringify([entry]))
    expect(loadHistory()).toEqual([entry])
  })
})

describe('saveHistoryEntry', () => {
  it('saves an entry that can be read back', () => {
    const entry = makeEntry()
    saveHistoryEntry(entry)
    expect(loadHistory()).toEqual([entry])
  })

  it('prepends new entries so the most recent comes first', () => {
    const first = makeEntry({ id: 'first', timestamp: 1000 })
    const second = makeEntry({ id: 'second', timestamp: 2000 })
    saveHistoryEntry(first)
    saveHistoryEntry(second)
    const history = loadHistory()
    expect(history[0].id).toBe('second')
    expect(history[1].id).toBe('first')
  })

  it('accumulates multiple entries', () => {
    saveHistoryEntry(makeEntry({ id: 'a' }))
    saveHistoryEntry(makeEntry({ id: 'b' }))
    saveHistoryEntry(makeEntry({ id: 'c' }))
    expect(loadHistory()).toHaveLength(3)
  })
})

describe('clearHistory', () => {
  it('empties the history', () => {
    saveHistoryEntry(makeEntry({ id: 'a' }))
    saveHistoryEntry(makeEntry({ id: 'b' }))
    clearHistory()
    expect(loadHistory()).toEqual([])
  })

  it('is a no-op when history is already empty', () => {
    clearHistory()
    expect(loadHistory()).toEqual([])
  })
})
