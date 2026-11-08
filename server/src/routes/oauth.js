import { Router } from 'express'
import jwt from 'jsonwebtoken'

const router = Router()

const EXPIRES_IN = 3600 // seconds

/**
 * POST /api/oauth/token — minimal OAuth 2.0 authorization server (Client Credentials grant).
 * The client sends grant_type=client_credentials (form-encoded) and authenticates with its
 * client ID and secret, either in a Basic Authorization header or in the body.
 */
router.post('/token', (req, res) => {
  const body = req.body ?? {}
  let clientId = body.client_id
  let clientSecret = body.client_secret

  const [scheme, encoded] = (req.headers.authorization ?? '').split(' ')
  if (scheme === 'Basic' && encoded) {
    ;[clientId, clientSecret] = Buffer.from(encoded, 'base64').toString().split(':')
  }

  if (body.grant_type !== 'client_credentials') {
    return res.status(400).json({
      error: 'unsupported_grant_type',
      error_description: 'Only grant_type=client_credentials is supported',
    })
  }
  if (clientId !== process.env.OAUTH_CLIENT_ID || clientSecret !== process.env.OAUTH_CLIENT_SECRET) {
    return res.status(401).json({ error: 'invalid_client', error_description: 'Unknown client or wrong secret' })
  }

  const accessToken = jwt.sign({ sub: clientId, scope: 'products:write' }, process.env.JWT_SECRET, {
    expiresIn: EXPIRES_IN,
  })
  res.json({ access_token: accessToken, token_type: 'Bearer', expires_in: EXPIRES_IN, scope: 'products:write' })
})

export default router
