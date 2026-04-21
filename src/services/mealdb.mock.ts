// Offline mock implementation of mealdb.ts.
// Activated via `npm run dev:mock` — Vite swaps this module in place of the
// real one at build time, so no mock code ever ships to production.
//
// All exported signatures must match mealdb.ts exactly so the rest of the
// codebase is unaware of the swap. TypeScript enforces this at import sites.

import type { Meal, MealArea, MealIngredient } from '../types'
import type { MealPreview } from './mealdb'

export type { MealPreview }

// Simulate network latency so loading states are visible during development.
function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// ── Static data ─────────────────────────────────────────────────────────────

const AREAS: MealArea[] = [
  { strArea: 'Italian' },
  { strArea: 'Mexican' },
  { strArea: 'Japanese' },
  { strArea: 'British' },
  { strArea: 'American' },
]

const INGREDIENTS: MealIngredient[] = [
  { strIngredient: 'Chicken' },
  { strIngredient: 'Beef' },
  { strIngredient: 'Tomato' },
  { strIngredient: 'Cheese' },
]

const MEALS_BY_INGREDIENT: Record<string, MealPreview[]> = {
  Chicken: [
    {
      idMeal: '1001',
      strMeal: 'Chicken Alfredo',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/syqypv1486981727.jpg',
    },
    {
      idMeal: '1002',
      strMeal: 'Chicken Teriyaki',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/wrssvt1511556563.jpg',
    },
    {
      idMeal: '1003',
      strMeal: 'Chicken Enchiladas',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/qtuwxu1468233098.jpg',
    },
  ],
  Beef: [
    {
      idMeal: '2001',
      strMeal: 'Beef Tacos',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/basywx1587939459.jpg',
    },
    {
      idMeal: '2002',
      strMeal: 'Beef Stew',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/vrspxv1511722222.jpg',
    },
  ],
  Tomato: [
    {
      idMeal: '1001',
      strMeal: 'Chicken Alfredo',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/syqypv1486981727.jpg',
    },
    {
      idMeal: '3001',
      strMeal: 'Tomato Soup',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/xvsurr1511719182.jpg',
    },
  ],
}

const MEALS_BY_AREA: Record<string, MealPreview[]> = {
  Italian: [
    {
      idMeal: '1001',
      strMeal: 'Chicken Alfredo',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/syqypv1486981727.jpg',
    },
    {
      idMeal: '3001',
      strMeal: 'Tomato Soup',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/xvsurr1511719182.jpg',
    },
  ],
  Mexican: [
    {
      idMeal: '1003',
      strMeal: 'Chicken Enchiladas',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/qtuwxu1468233098.jpg',
    },
    {
      idMeal: '2001',
      strMeal: 'Beef Tacos',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/basywx1587939459.jpg',
    },
  ],
  Japanese: [
    {
      idMeal: '1002',
      strMeal: 'Chicken Teriyaki',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/wrssvt1511556563.jpg',
    },
  ],
  British: [
    {
      idMeal: '2002',
      strMeal: 'Beef Stew',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/vrspxv1511722222.jpg',
    },
  ],
  American: [
    {
      idMeal: '2001',
      strMeal: 'Beef Tacos',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/basywx1587939459.jpg',
    },
  ],
}

const MEAL_DETAILS: Record<string, Meal> = {
  '1001': {
    idMeal: '1001',
    strMeal: 'Chicken Alfredo',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/syqypv1486981727.jpg',
    strCategory: 'Pasta',
    strArea: 'Italian',
  },
  '1002': {
    idMeal: '1002',
    strMeal: 'Chicken Teriyaki',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wrssvt1511556563.jpg',
    strCategory: 'Chicken',
    strArea: 'Japanese',
  },
  '1003': {
    idMeal: '1003',
    strMeal: 'Chicken Enchiladas',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/qtuwxu1468233098.jpg',
    strCategory: 'Chicken',
    strArea: 'Mexican',
  },
  '2001': {
    idMeal: '2001',
    strMeal: 'Beef Tacos',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/basywx1587939459.jpg',
    strCategory: 'Beef',
    strArea: 'Mexican',
  },
  '2002': {
    idMeal: '2002',
    strMeal: 'Beef Stew',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/vrspxv1511722222.jpg',
    strCategory: 'Beef',
    strArea: 'British',
  },
  '3001': {
    idMeal: '3001',
    strMeal: 'Tomato Soup',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/xvsurr1511719182.jpg',
    strCategory: 'Vegetarian',
    strArea: 'Italian',
  },
}

// ── Exported functions (same signatures as mealdb.ts) ───────────────────────

export function fetchAreas(): Promise<MealArea[]> {
  return delay(AREAS)
}

export function fetchIngredients(): Promise<MealIngredient[]> {
  return delay(INGREDIENTS)
}

export function filterByArea(area: string): Promise<MealPreview[]> {
  return delay(MEALS_BY_AREA[area] ?? [])
}

export function filterByIngredient(ingredient: string): Promise<MealPreview[]> {
  return delay(MEALS_BY_INGREDIENT[ingredient] ?? [])
}

export function fetchMealById(id: string): Promise<Meal | null> {
  return delay(MEAL_DETAILS[id] ?? null)
}

export function filterByIngredientAndArea(
  ingredient: string,
  area: string,
): Promise<MealPreview[]> {
  const byIngredient = MEALS_BY_INGREDIENT[ingredient] ?? []
  const areaIds = new Set((MEALS_BY_AREA[area] ?? []).map((m) => m.idMeal))
  return delay(byIngredient.filter((m) => areaIds.has(m.idMeal)))
}
