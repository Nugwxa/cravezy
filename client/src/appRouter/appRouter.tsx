// Routing
import { createBrowserRouter } from 'react-router-dom'

// Pages
import { HomePage } from '@/pages/Home'
import { TestPage } from '@/pages/Test'
import NotFound from '@/pages/NotFound'

/**
 * Sets up the routing config for the application
 */
const appRouter = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/test', element: <TestPage /> },
  {
    // Catch-all route for undefined paths
    path: '*',
    element: <NotFound />,
  },
])

export default appRouter
