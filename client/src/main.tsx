import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

// Styling
import '@/styles/globals.scss'
import { Theme as ThemeProvider } from '@radix-ui/themes/dist/cjs/index.js'

// Routing
import { RouterProvider } from 'react-router-dom'
import appRouter from '@/appRouter'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      className="themeProvider"
      hasBackground={false}
      accentColor="pink"
    >
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  </StrictMode>
)
