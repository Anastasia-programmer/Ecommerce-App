import cors from 'cors'
import express from 'express'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimit.js'
import authRoutes from './routes/auth.js'
import oauthRoutes from './routes/oauth.js'
import productRoutes from './routes/products.js'

const app = express()

// Allow the React dev server (Vite) to call the API
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false })) // OAuth token requests are form-encoded

app.use('/api', apiLimiter)
app.use('/api/auth', authRoutes)
app.use('/api/oauth', oauthRoutes)
app.use('/api/products', productRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
