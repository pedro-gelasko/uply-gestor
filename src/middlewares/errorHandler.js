const logger = require('../utils/logger')
const { error } = require('../utils/response')

function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.originalUrl} — [${err.code || err.name}] ${err.message}`)

  if (err.name === 'ZodError') {
    const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }))
    return error(res, 'Dados inválidos', 422, errors)
  }

  // pg unique violation
  if (err.code === '23505' || err.code === 'P2002') {
    const detail = err.detail || ''
    const match  = detail.match(/Key \((.+?)\)/)
    const field  = match ? match[1] : 'campo'
    return error(res, `Já existe um registro com esse ${field}`, 409)
  }

  // pg foreign key violation
  if (err.code === '23503' || err.code === 'P2025') {
    return error(res, 'Recurso relacionado não encontrado', 404)
  }

  // pg not-null violation
  if (err.code === '23502') {
    return error(res, `Campo obrigatório ausente: ${err.column || ''}`, 400)
  }

  if (err.status) {
    return error(res, err.message, err.status)
  }

  return error(res, 'Erro interno do servidor', 500)
}

module.exports = errorHandler
