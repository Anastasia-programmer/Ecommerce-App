import 'dotenv/config' // must stay first: loads .env before the other modules read it
import app from './app.js'
import { connectDB } from './config/db.js'
import { seedProducts } from './seed.js'

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Copy .env.example to .env first.')
  process.exit(1)
}

const PORT = process.env.PORT || 3000

await connectDB()
await seedProducts()

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
