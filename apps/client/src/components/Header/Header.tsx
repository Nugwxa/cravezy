import { Link } from 'react-router-dom'
import CravezyLogo from '../CravezyLogo'
import styles from './Header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <nav className={styles.leftNav} aria-label="Main navigation">
          <Link
            className={styles.logoWrapper}
            to={'/'}
            aria-label="Go to homepage"
          >
            <CravezyLogo />
            <span data-theme="pink" className={styles.logoWrapperText}>
              Cravezy
            </span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
