const jwt   = require('jsonwebtoken')
const { error } = require('../utils/response')

const JWT_SECRET = process.env.JWT_SECRET || 'uply_secret'

const authenticate = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return error(res, 'Token de autenticação não fornecido', 401)
  }
  const token = header.split(' ')[1]
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return error(res, 'Token inválido ou expirado', 401)
  }
}

module.exports = authenticate
