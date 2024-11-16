import { supabase } from './lib/supabase'
import cors, { CorsOptions } from 'cors'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'

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
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).send('CORS Error: Origin not allowed')
  } else {
    next(err)
  }
})

app.get('/test/:userId', async (req, res) => {
  const { userId } = req.params

  const superBase = await supabase.from('User').select('*')
  res.status(201).send({ id: 'sui', userId, res: superBase })
})

app.listen(port, () => {
  console.log(`Server running on ${serverURL}`)
})
