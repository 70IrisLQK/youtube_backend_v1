import express from 'express'
import dotenv from 'dotenv'
import connectDatabase from './config/DatabaseConfig'
import routes from './routes'
import cors from 'cors'

dotenv.config()

// Middleware
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Connect routes
app.use('/api/v1', routes.authRoute)
app.use('/api/v1', routes.videoRouter)

// Connect DB
connectDatabase()

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log('Server running at %s', PORT)
})
