import { useState, useRef, useId, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchIngredients } from '../services/mealdb'
import styles from './IngredientPicker.module.css'

interface Props {
  value: string
  onSelect: (ingredient: string) => void
}

export function IngredientPicker({ value, onSelect }: Props) {
  const [query, setQuery] = useState(value)
  const [activeIndex, setActiveIndex] = useState(-1)
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    data: ingredients,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['ingredients'],
    queryFn: fetchIngredients,
  })

  const suggestions =
    query.length >= 2 && query !== value
      ? (ingredients ?? [])
          .filter((i) => i.strIngredient.toLowerCase().includes(query.toLowerCase()))
          .sort((a, b) => {
            const q = query.toLowerCase()
            const aStarts = a.strIngredient.toLowerCase().startsWith(q)
            const bStarts = b.strIngredient.toLowerCase().startsWith(q)
            if (aStarts !== bStarts) return aStarts ? -1 : 1
            return a.strIngredient.localeCompare(b.strIngredient)
          })
      : []

  const isOpen = suggestions.length > 0

  function handleSelect(ingredient: string) {
    setQuery(ingredient)
    setActiveIndex(-1)
    onSelect(ingredient)
  }

  function handleChange(input: string) {
    setQuery(input)
    setActiveIndex(-1)
    if (input !== value) onSelect('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[activeIndex].strIngredient)
    } else if (e.key === 'Escape') {
      setActiveIndex(-1)
      onSelect('')
      setQuery('')
    }
  }

  const activeDescendant = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined

  useEffect(() => {
    if (activeIndex < 0) return
    document
      .getElementById(`${listboxId}-option-${activeIndex}`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, listboxId])

  if (isLoading) return <p role="status">Loading ingredients...</p>
  if (isError) return <p role="status">Failed to load ingredients.</p>

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="ingredient-input">
        Ingredient
      </label>
      <input
        ref={inputRef}
        id="ingredient-input"
        className={styles.input}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeDescendant}
        aria-autocomplete="list"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. Tomato"
        autoComplete="off"
      />

      {isOpen && (
        <ul
          id={listboxId}
          className={styles.suggestions}
          role="listbox"
          aria-label="Ingredient suggestions"
          tabIndex={-1}
        >
          {suggestions.map((i, idx) => (
            <li
              key={i.strIngredient}
              id={`${listboxId}-option-${idx}`}
              className={`${styles.suggestion} ${idx === activeIndex ? styles.suggestionActive : ''}`}
              role="option"
              aria-selected={i.strIngredient === value}
              onMouseDown={(e) => {
                // prevent input blur before click registers
                e.preventDefault()
                handleSelect(i.strIngredient)
              }}
            >
              {i.strIngredient}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
