import app from './app'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()
const port = process.env.SERVER_PORT || 5000
const serverURL = `${process.env.SERVER_URL ?? `http://localhost:${port}`}`

app.listen(port, () => {
  console.log(`Server running on ${serverURL}`)
})
