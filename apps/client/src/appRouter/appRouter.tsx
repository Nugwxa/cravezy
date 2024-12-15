// Routing
import { createBrowserRouter } from 'react-router-dom'

// Pages
import { HomePage } from '@/pages/Home'
import { TestPage } from '@/pages/Test'
import ForgotPasswordPage from '@/pages/auth/forgot-password'
import LoginPage from '@/pages/auth/login'
import NotFound from '@/pages/NotFound'
import RegistrationPage from '@/pages/auth/register'

// Layouts
import AuthLayout from '@/layouts/AuthLayout'

/**
 * Sets up the routing config for the application
 */
const appRouter = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'register',
        element: <RegistrationPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      { index: true, element: <NotFound /> },
    ],
  },
  { path: '/test', element: <TestPage /> },
  {
    // Catch-all route for undefined paths
    path: '*',
    element: <NotFound />,
  },
])

export default appRouter
