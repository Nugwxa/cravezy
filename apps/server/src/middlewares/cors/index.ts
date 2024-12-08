import cors, { CorsOptions } from 'cors'

const allowedOrigins = ['http://localhost:5173']

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // Undefined check for testing in postman
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

export const configureCors = cors(corsOptions)
