import type { Meal, MealArea, MealIngredient } from '../types'

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

export type MealPreview = Pick<Meal, 'idMeal' | 'strMeal' | 'strMealThumb'>

async function http<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`MealDB error: ${res.status}`)
  return res.json() as Promise<T>
}

export async function fetchAreas(): Promise<MealArea[]> {
  const data = await http<{ meals: MealArea[] }>(`${BASE_URL}/list.php?a=list`)
  return data.meals
}

export async function fetchIngredients(): Promise<MealIngredient[]> {
  const data = await http<{ meals: MealIngredient[] }>(`${BASE_URL}/list.php?i=list`)
  return data.meals
}

export async function filterByArea(area: string): Promise<MealPreview[]> {
  const data = await http<{ meals: MealPreview[] | null }>(
    `${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`,
  )
  return data.meals ?? []
}

export async function filterByIngredient(ingredient: string): Promise<MealPreview[]> {
  const data = await http<{ meals: MealPreview[] | null }>(
    `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`,
  )
  return data.meals ?? []
}

export async function fetchMealById(id: string): Promise<Meal | null> {
  const data = await http<{ meals: Meal[] | null }>(`${BASE_URL}/lookup.php?i=${id}`)
  return data.meals?.[0] ?? null
}

export async function filterByIngredientAndArea(
  ingredient: string,
  area: string,
): Promise<MealPreview[]> {
  const [byIngredient, byArea] = await Promise.all([
    filterByIngredient(ingredient),
    filterByArea(area),
  ])

  const areaIds = new Set(byArea.map((m) => m.idMeal))
  return byIngredient.filter((m) => areaIds.has(m.idMeal))
}
