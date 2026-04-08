import { loadHistory } from '../services/storage'
import { FeedbackBadge } from '../components/FeedbackBadge'
import styles from './HistoryPage.module.css'

export const HistoryPage = () => {
  const entries = loadHistory()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>History</h1>
      </div>

      {entries.length === 0 ? (
        <p className={styles.empty}>No entries yet.</p>
      ) : (
        <ul className={styles.list}>
          {entries.map((entry) => (
            <li key={entry.id} className={styles.entry}>
              <img
                className={styles.thumb}
                src={entry.recipeThumb}
                alt={entry.recipeTitle}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = 'src/assets/images/recipe_placeholder.png'
                }}
              />
              <div className={styles.entryBody}>
                <p className={styles.entryTitle}>{entry.recipeTitle}</p>
                <div className={styles.entryMeta}>
                  <span className={styles.entryTag}>
                    {entry.ingredient} · {entry.area}
                  </span>
                  <span className={styles.entryDate}>
                    {new Date(entry.timestamp).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>
              <FeedbackBadge liked={entry.liked} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
