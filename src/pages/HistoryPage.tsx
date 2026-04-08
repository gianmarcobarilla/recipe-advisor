import { useNavigate } from 'react-router-dom'
import { loadHistory } from '../services/storage'

export const HistoryPage = () => {
  const navigate = useNavigate()

  const allEntries = loadHistory()

  return (
    <div>
      <h1>History</h1>

      {allEntries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <ul>
          {allEntries.map((entry) => (
            <li key={entry.id}>
              <img
                src={entry.recipeThumb}
                alt={entry.recipeTitle}
                width={64}
                height={64}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = 'src/assets/images/recipe_placeholder.png'
                }}
              />
              <div>
                <strong>{entry.recipeTitle}</strong>
                <span>
                  {entry.ingredient} · {entry.area}
                </span>
                <span>{new Date(entry.timestamp).toLocaleString()}</span>
                <span aria-label={entry.liked ? 'Liked' : 'Disliked'}>
                  {entry.liked ? 'Liked' : 'Disliked'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate('/')}>New search</button>
    </div>
  )
}
