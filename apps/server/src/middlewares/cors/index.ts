import cors, { CorsOptions } from 'cors'

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

export const configureCors = cors(corsOptions)
