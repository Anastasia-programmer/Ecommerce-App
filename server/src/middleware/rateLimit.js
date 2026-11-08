import { rateLimit } from 'express-rate-limit'

const FIFTEEN_MINUTES = 15 * 60 * 1000

// Every /api route: 100 requests per 15 minutes per client IP
export const apiLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again in 15 minutes' },
})

// Login only: 5 attempts per 15 minutes per client IP, against brute-force attacks
export const loginLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again in 15 minutes' },
})
