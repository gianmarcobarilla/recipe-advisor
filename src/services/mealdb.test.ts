import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { filterByIngredientAndArea } from './mealdb'

const mockFetch = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
})

afterEach(() => {
  vi.restoreAllMocks()
})

function okResponse(body: unknown) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response)
}

describe('filterByIngredientAndArea', () => {
  it('returns meals present in both ingredient and area results', async () => {
    mockFetch
      .mockResolvedValueOnce(
        okResponse({ meals: [{ idMeal: '1', strMeal: 'A', strMealThumb: '' }, { idMeal: '2', strMeal: 'B', strMealThumb: '' }] }),
      )
      .mockResolvedValueOnce(
        okResponse({ meals: [{ idMeal: '2', strMeal: 'B', strMealThumb: '' }, { idMeal: '3', strMeal: 'C', strMealThumb: '' }] }),
      )

    const result = await filterByIngredientAndArea('chicken', 'Italian')

    expect(result).toHaveLength(1)
    expect(result[0].idMeal).toBe('2')
  })

  it('returns an empty array when there is no overlap', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse({ meals: [{ idMeal: '1', strMeal: 'A', strMealThumb: '' }] }))
      .mockResolvedValueOnce(okResponse({ meals: [{ idMeal: '2', strMeal: 'B', strMealThumb: '' }] }))

    const result = await filterByIngredientAndArea('chicken', 'Japanese')

    expect(result).toEqual([])
  })

  it('returns an empty array when the API returns null meals for ingredient', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse({ meals: null }))
      .mockResolvedValueOnce(okResponse({ meals: [{ idMeal: '1', strMeal: 'A', strMealThumb: '' }] }))

    const result = await filterByIngredientAndArea('unknowningredient', 'Italian')

    expect(result).toEqual([])
  })

  it('returns an empty array when the API returns null meals for area', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse({ meals: [{ idMeal: '1', strMeal: 'A', strMealThumb: '' }] }))
      .mockResolvedValueOnce(okResponse({ meals: null }))

    const result = await filterByIngredientAndArea('chicken', 'unknownarea')

    expect(result).toEqual([])
  })

  it('throws when the API responds with a non-ok status', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 } as Response)

    await expect(filterByIngredientAndArea('chicken', 'Italian')).rejects.toThrow('MealDB error: 500')
  })
})
