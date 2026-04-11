import { useState } from 'react'
import { loadHistory, clearHistory } from '../services/storage'
import { Button } from '../components/Button'
import { HistoryCard } from '../components/HistoryCard'
import styles from './HistoryPage.module.css'

export const HistoryPage = () => {
  const [entries, setEntries] = useState(() => loadHistory())

  function handleClear() {
    clearHistory()
    setEntries([])
  }

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
      </div>

      {entries.length === 0 ? (
        <p className={styles.empty}>No entries yet.</p>
      ) : (
        <ul className={styles.list}>
          {entries.map((entry) => (
            <HistoryCard key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </div>
  )
}
