import placeholderImg from '../assets/images/recipe_placeholder.png'
import type { Meal } from '../types'
import styles from './RecipeCard.module.css'

interface Props {
  meal: Meal
}

export function RecipeCard({ meal }: Props) {
  return (
    <article className={styles.card} aria-labelledby="recipe-title">
      <img
        className={styles.image}
        src={meal.strMealThumb}
        alt={meal.strMeal}
        onError={(e) => {
          ;(e.target as HTMLImageElement).src = placeholderImg
        }}
      />
      <div className={styles.cardBody}>
        <h1 id="recipe-title" className={styles.recipeName}>
          {meal.strMeal}
        </h1>
        <div className={styles.cardBottom}>
          <div className={styles.meta}>
            <span className={styles.badge}>{meal.strCategory}</span>
            <span className={styles.badge}>{meal.strArea}</span>
          </div>
          <a
            className={styles.recipeLink}
            href={`https://www.themealdb.com/meal/${meal.idMeal}`}
            target="_blank"
            rel="noreferrer"
          >
            View full recipe ↗
          </a>
        </div>
      </div>
    </article>
  )
}
