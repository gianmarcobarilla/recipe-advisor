import type { MealPreview } from './mealdb'

export function selectMeal(meals: MealPreview[], index: number): MealPreview | null {
  if (meals.length === 0 || index >= meals.length) return null
  return meals[index]
}
