import { Link, useNavigate } from 'react-router-dom'
import styles from './NavBar.module.css'

export function NavBar() {
  const navigate = useNavigate()

  function handleHome() {
    navigate('/', { replace: true })
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <button className={styles.logo} onClick={handleHome} aria-label="Start over">
          Recipe Advisor
        </button>
        <Link className={styles.historyLink} to="/history" replace>
          History
        </Link>
      </nav>
    </header>
  )
}
