const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const token = req.header('auth-token')
  if (!token) {
    return res.status(401).json({
      status: 'error',
      code: 'token_missing'
    })
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = verified
    next()
  } catch (error) {
    res.status(400).json({
      status: 'error',
      code: 'invalid_token'
    })
  }
}

module.exports = verifyToken
