import Header from '@/components/Header'
import { Outlet } from 'react-router-dom'
// import authStyles from "@/styles/authStyles.module.scss"
import styles from './AuthLayout.module.scss'

/**
 * The base layout for the /auth route
 */
export default function AuthLayout() {
  // Render the NotFound page if they visit /auth

  // There might be a better way of doing this but I've done
  // a bit of research and I haven't found a better way.
  const isChildRoute = window.location.pathname !== '/auth'
  if (!isChildRoute) return <Outlet />
  return (
    <div className={styles.authPage}>
      <Header />

      <main className={styles.authLayout}>
        <section className={styles.authLayoutPanel}>
          <Outlet />
        </section>
        <div></div>
      </main>
    </div>
  )
}
