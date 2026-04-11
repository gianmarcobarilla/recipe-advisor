import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchMealById, filterByIngredientAndArea } from '../services/mealdb'
import { saveHistoryEntry } from '../services/storage'
import { selectMeal } from '../services/recommendation'
import { Button } from '../components/Button'
import { RecipeCard } from '../components/RecipeCard'
import styles from './ResultPage.module.css'
import type { Meal } from '../types'

export const ResultPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { ingredient?: string; area?: string } | null
  const ingredient = state?.ingredient ?? ''
  const area = state?.area ?? ''

  const [index, setIndex] = useState(0)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

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

  function handleNewIdea() {
    setIndex((i) => i + 1)
    setFeedbackSubmitted(false)
  }

  function handleFeedback(liked: boolean, meal: Meal) {
    saveHistoryEntry({
      id: crypto.randomUUID(),
      recipeId: meal.idMeal,
      recipeTitle: meal.strMeal,
      recipeThumb: meal.strMealThumb,
      liked,
      timestamp: Date.now(),
      ingredient,
      area,
    })
    setFeedbackSubmitted(true)
  }

  if (!ingredient || !area) {
    return <Navigate to="/" replace />
  }

  if (isLoadingList || (pickedMeal && isLoadingDetail)) {
    return (
      <div className={styles.statePage}>
        <p className={styles.stateText}>Finding a recipe for you…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.statePage}>
        <p className={styles.stateText}>Something went wrong.</p>
        <Button variant="primary" onClick={() => void navigate('/')}>
          Try again
        </Button>
      </div>
    )
  }

  if (!meals || meals.length === 0) {
    return (
      <div className={styles.statePage}>
        <p className={styles.stateText}>
          No <strong>{area}</strong> recipes found for <strong>{ingredient}</strong>.
        </p>
        <Button variant="primary" onClick={() => void navigate('/', { replace: true })}>
          Start over
        </Button>
      </div>
    )
  }

  if (index >= meals.length) {
    return (
      <div className={styles.statePage}>
        <p className={styles.stateText}>You've seen all the recipes for that combination!</p>
        <Button variant="primary" onClick={() => void navigate('/', { replace: true })}>
          Start over
        </Button>
      </div>
    )
  }

  if (!mealDetail)
    return (
      <div className={styles.statePage}>
        <p className={styles.stateText}>Recipe not found.</p>
        <Button variant="primary" onClick={() => void navigate('/', { replace: true })}>
          Start over
        </Button>
      </div>
    )

  return (
    <div className={styles.page}>
      <title>Recipe Result | Recipe Advisor</title>
      <p className={styles.title}>Here's your recipe:</p>

      <RecipeCard meal={mealDetail} />

      <section className={styles.feedback}>
        <p className={styles.feedbackQuestion}>Did it match your preference?</p>
        <div className={styles.feedbackButtons}>
          <button
            className={styles.btnLike}
            onClick={() => handleFeedback(true, mealDetail)}
            disabled={feedbackSubmitted}
          >
            👍 Like
          </button>
          <button
            className={styles.btnDislike}
            onClick={() => handleFeedback(false, mealDetail)}
            disabled={feedbackSubmitted}
          >
            👎 Dislike
          </button>
        </div>
        {feedbackSubmitted && (
          <p role="status" className={styles.feedbackConfirm}>
            Feedback submitted!
          </p>
        )}
      </section>

      <Button variant="primary" style={{ flex: 1 }} onClick={handleNewIdea}>
        New Idea →
      </Button>
    </div>
  )
}
