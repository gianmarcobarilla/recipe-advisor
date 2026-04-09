import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchMealById, filterByIngredientAndArea } from '../services/mealdb'
import { saveHistoryEntry } from '../services/storage'
import { selectMeal } from '../services/recommendation'
import { Button } from '../components/Button'
import placeholderImg from '../assets/images/recipe_placeholder.png'
import styles from './ResultPage.module.css'

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
        <Button variant="primary" onClick={() => navigate('/')}>
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
        <Button variant="primary" onClick={() => navigate('/')}>
          Start over
        </Button>
      </div>
    )
  }

  if (index >= meals.length) {
    return (
      <div className={styles.statePage}>
        <p className={styles.stateText}>You've seen all the recipes for that combination!</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Start over
        </Button>
      </div>
    )
  }

  if (!mealDetail) return null

  function handleNewIdea() {
    setIndex((i) => i + 1)
    setFeedbackSubmitted(false)
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
    setFeedbackSubmitted(true)
  }

  return (
    <div className={styles.page}>
      <p className={styles.title}>Here's your recipe:</p>

      <article className={styles.card}>
        <img
          className={styles.image}
          src={mealDetail.strMealThumb}
          alt={mealDetail.strMeal}
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = placeholderImg
          }}
        />
        <div className={styles.cardBody}>
          <h1 className={styles.recipeName}>{mealDetail.strMeal}</h1>
          <div className={styles.meta}>
            <span className={styles.badge}>{mealDetail.strCategory}</span>
            <span className={styles.badge}>{mealDetail.strArea}</span>
          </div>
          <a
            className={styles.recipeLink}
            href={`https://www.themealdb.com/meal/${mealDetail.idMeal}`}
            target="_blank"
            rel="noreferrer"
          >
            View full recipe ↗
          </a>
        </div>
      </article>

      <section className={styles.feedback}>
        <p className={styles.feedbackQuestion}>Did it match your preference?</p>
        <div className={styles.feedbackButtons}>
          <button
            className={styles.btnLike}
            onClick={() => handleFeedback(true)}
            disabled={feedbackSubmitted}
          >
            👍 Like
          </button>
          <button
            className={styles.btnDislike}
            onClick={() => handleFeedback(false)}
            disabled={feedbackSubmitted}
          >
            👎 Dislike
          </button>
        </div>
        {feedbackSubmitted && <p className={styles.feedbackConfirm}>Feedback submitted!</p>}
      </section>

      <Button variant="primary" style={{ flex: 1 }} onClick={handleNewIdea}>
        New Idea →
      </Button>
    </div>
  )
}
