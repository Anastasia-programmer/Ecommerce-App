// Every error is returned in the same format: { "error": "message" }

export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err)

  // Mongoose schema validation (missing field, negative price...)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => (e.name === 'CastError' ? `${e.path} must be a ${e.kind.toLowerCase()}` : e.message))
      .join(', ')
    return res.status(400).json({ error: message })
  }
  // Wrong type, e.g. "price": "abc"
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `${err.path} has an invalid value` })
  }
  // Unique index violation (duplicate email)
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Email already registered' })
  }
  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' })
  }

  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
