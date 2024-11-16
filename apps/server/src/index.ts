import express, { Express, NextFunction, Request, Response } from 'express'
import cors, { CorsOptions } from 'cors'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()
const port = process.env.SERVER_PORT || 5000
const serverURL = `${process.env.SERVER_URL ?? 'http://localhost'}:${port}`

const app = express()

app.use(express.json())

const allowedOrigins = ['localhost']

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // Undefined check for testing in postman
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

app.use(cors(corsOptions))

// Error handling middleware for CORS errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).send('CORS Error: Origin not allowed')
  } else {
    next(err)
  }
})

app.get('/test/:userId', (req, res) => {
  const { userId } = req.params
  res.status(201).send({ id: 'sui', userId })
})

app.listen(port, () => {
  console.log(`Server running on ${serverURL}`)
})
