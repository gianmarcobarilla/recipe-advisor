import { useState } from 'react'
import { loadHistory, clearHistory } from '../services/storage'
import { Button } from '../components/Button'
import { HistoryCard } from '../components/HistoryCard'
import styles from './HistoryPage.module.css'

export const HistoryPage = () => {
  const [entries, setEntries] = useState(() => loadHistory())
  const [filterByLiked, setFilterByLiked] = useState<'all' | 'liked' | 'disliked'>('all')
  const [sortByDate, setSortByDate] = useState<'ascending' | 'descending'>('descending')

  function handleClear() {
    clearHistory()
    setEntries([])
  }

  const filteredEntries = entries
    .filter((e) => {
      if (filterByLiked === 'all') return true
      if (filterByLiked === 'liked') return e.liked
      return !e.liked
    })
    .sort((a, b) => {
      if (sortByDate === 'descending') {
        return b.timestamp - a.timestamp
      } else {
        return a.timestamp - b.timestamp
      }
    })

  return (
    <div className={styles.page}>
      <title>History | Recipe Advisor</title>
      <div className={styles.header}>
        <h1 className={styles.title}>History</h1>
        <Button
          variant="danger"
          className={styles.btnClear}
          onClick={handleClear}
          disabled={entries.length === 0}
        >
          Clear all
        </Button>
        <div className={styles.filters} role="group" aria-label="Filter by feedback">
          <Button
            aria-pressed={filterByLiked === 'all'}
            variant="primary"
            onClick={() => setFilterByLiked('all')}
          >
            All
          </Button>
          <Button
            aria-pressed={filterByLiked === 'liked'}
            variant="primary"
            onClick={() => setFilterByLiked('liked')}
          >
            Liked
          </Button>
          <Button
            aria-pressed={filterByLiked === 'disliked'}
            variant="primary"
            onClick={() => setFilterByLiked('disliked')}
          >
            Disliked
          </Button>
        </div>
        <Button
          variant="secondary"
          aria-label={`Sort by date, currently ${sortByDate === 'descending' ? 'newest first' : 'oldest first'}`}
          onClick={() => setSortByDate(sortByDate === 'ascending' ? 'descending' : 'ascending')}
        >
          Date {sortByDate === 'descending' ? '↓' : '↑'}
        </Button>
      </div>

      {filteredEntries.length === 0 ? (
        <p role="status" className={styles.empty}>
          No entries yet.
        </p>
      ) : (
        <ul className={styles.list}>
          {filteredEntries.map((entry) => (
            <HistoryCard key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </div>
  )
}
