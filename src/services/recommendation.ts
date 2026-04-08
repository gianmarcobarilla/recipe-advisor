import type { MealPreview } from './mealdb'

export function selectMeal(meals: MealPreview[], index: number): MealPreview | null {
  if (meals.length === 0) return null
  return meals[index % meals.length]
}
