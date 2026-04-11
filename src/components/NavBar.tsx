import { Link } from 'react-router-dom'
import styles from './NavBar.module.css'

export function NavBar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link className={styles.logo} to="/" replace aria-label="Start over">
          Recipe Advisor
        </Link>
        <Link className={styles.historyLink} to="/history" replace>
          History
        </Link>
      </nav>
    </header>
  )
}
