import { describe, it, expect } from 'vitest'

import type { MealPreview } from './mealdb'
import { selectMeal } from './recommendation'

const meals: MealPreview[] = [
  { idMeal: '1', strMeal: 'Pasta', strMealThumb: '' },
  { idMeal: '2', strMeal: 'Pizza', strMealThumb: '' },
  { idMeal: '3', strMeal: 'Risotto', strMealThumb: '' },
]

describe('selectMeal', () => {
  it('returns null for an empty list', () => {
    expect(selectMeal([], 0)).toBeNull()
  })

  it('returns the first meal when index is 0', () => {
    expect(selectMeal(meals, 0)).toEqual(meals[0])
  })

  it('returns the correct meal for a given index', () => {
    expect(selectMeal(meals, 2)).toEqual(meals[2])
  })

  it('returns the only element for a single-item list at index 0', () => {
    const single = [meals[0]]
    expect(selectMeal(single, 0)).toEqual(single[0])
  })
  it('returns null when index equals the list length', () => {
    expect(selectMeal(meals, 3)).toBeNull()
  })
  it('returns null when index exceeds the list length', () => {
    expect(selectMeal(meals, 5)).toBeNull()
  })
})
