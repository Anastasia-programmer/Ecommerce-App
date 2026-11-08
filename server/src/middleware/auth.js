import jwt from 'jsonwebtoken'

/**
 * Protects a route. Expects the header "Authorization: Bearer <token>", where the token is
 * either a user JWT from POST /api/auth/login or an OAuth 2.0 access token from
 * POST /api/oauth/token. Both are signed with JWT_SECRET, so one check covers them.
 */
export function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing token. Send the header "Authorization: Bearer <token>"' })
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
