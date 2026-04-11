import placeholderImg from '../assets/images/recipe_placeholder.png'
import { FeedbackBadge } from './FeedbackBadge'
import type { HistoryEntry } from '../types'
import styles from './HistoryCard.module.css'

interface Props {
  entry: HistoryEntry
}

export function HistoryCard({ entry }: Props) {
  return (
    <li className={styles.entry}>
      <img
        className={styles.thumb}
        src={entry.recipeThumb}
        alt={entry.recipeTitle}
        onError={(e) => ((e.target as HTMLImageElement).src = placeholderImg)}
      />
      <div className={styles.body}>
        <p className={styles.title}>{entry.recipeTitle}</p>
        <div className={styles.meta}>
          <span className={styles.tag}>
            {entry.ingredient} · {entry.area}
          </span>
          <span className={styles.date}>
            {new Date(entry.timestamp).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
        </div>
      </div>
      <FeedbackBadge liked={entry.liked} />
    </li>
  )
}
