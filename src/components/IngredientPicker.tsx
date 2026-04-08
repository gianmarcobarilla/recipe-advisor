import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchIngredients } from '../services/mealdb'
import styles from './IngredientPicker.module.css'

interface Props {
  value: string
  onSelect: (ingredient: string) => void
}

export function IngredientPicker({ value, onSelect }: Props) {
  const [query, setQuery] = useState(value)

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
          .slice(0, 8)
      : []

  function handleSelect(ingredient: string) {
    setQuery(ingredient)
    onSelect(ingredient)
  }

  function handleChange(input: string) {
    setQuery(input)
    if (input !== value) onSelect('')
  }

  if (isLoading) return <p>Loading ingredients...</p>
  if (isError) return <p>Failed to load ingredients.</p>

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="ingredient-input">
        Ingredient
      </label>
      <input
        id="ingredient-input"
        className={styles.input}
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="e.g. Chicken"
        autoComplete="off"
      />

      {suggestions.length > 0 && (
        <ul className={styles.suggestions} role="listbox" aria-label="Ingredient suggestions">
          {suggestions.map((i) => (
            <li
              key={i.strIngredient}
              className={styles.suggestion}
              role="option"
              aria-selected={i.strIngredient === value}
              onClick={() => handleSelect(i.strIngredient)}
            >
              {i.strIngredient}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
