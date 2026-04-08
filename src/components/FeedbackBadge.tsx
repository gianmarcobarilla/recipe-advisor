import styles from './FeedbackBadge.module.css'

interface Props {
  liked: boolean
}

export function FeedbackBadge({ liked }: Props) {
  return (
    <span
      className={`${styles.badge} ${liked ? styles.liked : styles.disliked}`}
      aria-label={liked ? 'Liked' : 'Disliked'}
    >
      {liked ? '👍 Liked' : '👎 Disliked'}
    </span>
  )
}
