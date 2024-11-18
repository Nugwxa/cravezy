import { configureCors } from './middlewares/cors'
import apiRoutes from './routes'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'

// Load environment variables from .env file
dotenv.config()

const app = express()

// Middlewares
app.use(configureCors)
app.use(express.json())

// Mount the API routes
app.use('/', apiRoutes)

// Error simulation middleware for testing
// This is only active if explicitly triggered during tests.
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.headers['x-simulate-error'] === 'cors') {
    const corsError = new Error('Not allowed by CORS')
    corsError.message = 'Not allowed by CORS'
    return next(corsError)
  }
  if (req.headers['x-simulate-error'] === 'unexpected') {
    const unexpectedError = new Error('Unexpected error')
    return next(unexpectedError)
  }
  next()
})

// Catch undefined routes (404 handler)
app.use((_req: Request, res: Response, next: NextFunction) => {
  // Only send 404 if no response has been sent yet
  if (!res.headersSent) {
    res.status(404).json({ success: false, message: 'Endpoint not found' })
  }
  next()
})

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (!res.headersSent) {
    if (err.message === 'Not allowed by CORS') {
      res
        .status(401)
        .json({ success: false, message: 'CORS Error: Origin not allowed' })
    } else {
      res
        .status(500)
        .json({ success: false, message: 'Unexpected server error' })
    }
  }
  next()
})

export default app
