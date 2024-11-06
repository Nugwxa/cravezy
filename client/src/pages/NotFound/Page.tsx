import { Link } from 'react-router-dom'
import styles from './Page.module.scss'

export default function NotFound() {
  // Intentionaly didn't make the text a H1 so I could test the global
  // font variables
  return (
    <main className={styles.notFoundContainer}>
      <div>
        404 PAGE NOT FOUND (WIP) <br />
        <Link to={'/'}>CLICK ME TO GO BACK</Link>
      </div>
    </main>
  )
}
