import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchMealById, filterByIngredientAndArea } from '../services/mealdb'
import { saveHistoryEntry } from '../services/storage'
import { selectMeal } from '../services/recommendation'

export const ResultPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { ingredient?: string; area?: string } | null
  const ingredient = state?.ingredient ?? ''
  const area = state?.area ?? ''

  const [index, setIndex] = useState(0)

  const {
    data: meals,
    isLoading: isLoadingList,
    isError,
  } = useQuery({
    queryKey: ['results', ingredient, area],
    queryFn: () => filterByIngredientAndArea(ingredient, area),
    enabled: !!ingredient && !!area,
  })

  const pickedMeal = selectMeal(meals ?? [], index)

  const { data: mealDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['meal', pickedMeal?.idMeal],
    queryFn: () => fetchMealById(pickedMeal!.idMeal),
    enabled: !!pickedMeal,
  })

  if (!ingredient || !area) {
    return <Navigate to="/" replace />
  }

  if (isLoadingList || (pickedMeal && isLoadingDetail)) {
    return <p>Finding a recipe for you…</p>
  }

  if (isError) {
    return (
      <div>
        <p>Something went wrong.</p>
        <button onClick={() => navigate('/')}>Try again</button>
      </div>
    )
  }

  if (!meals || meals.length === 0) {
    return (
      <div>
        <p>
          No recipes found for <strong>{ingredient}</strong> + <strong>{area}</strong>.
        </p>
        <button onClick={() => navigate('/')}>Start over</button>
      </div>
    )
  }

  if (index >= meals.length) {
    return (
      <div>
        <p>You've seen all the recipes we have for that combination!</p>
        <button onClick={() => navigate('/')}>Start over</button>
      </div>
    )
  }

  if (!mealDetail) return null

  function handleNewIdea() {
    setIndex((i) => i + 1)
  }

  function handleFeedback(liked: boolean) {
    saveHistoryEntry({
      id: crypto.randomUUID(),
      recipeId: mealDetail!.idMeal,
      recipeTitle: mealDetail!.strMeal,
      recipeThumb: mealDetail!.strMealThumb,
      liked,
      timestamp: Date.now(),
      ingredient,
      area,
    })
  }

  return (
    <div>
      <h1>Your recipe</h1>
      <article>
        <img
          src={mealDetail.strMealThumb}
          alt={mealDetail.strMeal}
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = 'src/assets/images/recipe_placeholder.png'
          }}
        />
        <h2>{mealDetail.strMeal}</h2>
        <p>Category: {mealDetail.strCategory}</p>
        <p>Area: {mealDetail.strArea}</p>
        <a
          href={`https://www.themealdb.com/meal/${mealDetail.idMeal}`}
          target="_blank"
          rel="noreferrer"
        >
          View full recipe ↗
        </a>
      </article>

      <button onClick={handleNewIdea} disabled={meals.length <= 1}>
        New Idea
      </button>

      <section>
        <p>Did it match your preference?</p>
        <button onClick={() => handleFeedback(true)}>Like</button>
        <button onClick={() => handleFeedback(false)}>Dislike</button>
      </section>
    </div>
  )
}
