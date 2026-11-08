import bcrypt from 'bcryptjs'
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { loginLimiter } from '../middleware/rateLimit.js'
import User from '../models/User.js'

const router = Router()

const isFilled = (value) => typeof value === 'string' && value.trim() !== ''

// POST /api/auth/register  { name, email, password }
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body ?? {}

  if (![name, email, password].every(isFilled)) {
    return res.status(400).json({ error: 'name, email and password are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'password must be at least 6 characters' })
  }
  if (await User.exists({ email: email.trim().toLowerCase() })) {
    return res.status(409).json({ error: 'Email already registered' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash })
  res.status(201).json({ message: 'User registered', user })
})

// POST /api/auth/login  { email, password }  →  { token, user }
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body ?? {}

  if (!isFilled(email) || !isFilled(password)) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() })
  // Same message for unknown email and wrong password, so attackers cannot tell which
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
  res.json({ token, user })
})

export default router
