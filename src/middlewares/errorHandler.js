const logger = require('../utils/logger')
const { error } = require('../utils/response')

function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`, { stack: err.stack })

  if (err.name === 'ZodError') {
    const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }))
    return error(res, 'Dados inválidos', 422, errors)
  }

  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'campo'
    return error(res, `Valor duplicado para o campo: ${field}`, 409)
  }

  if (err.code === 'P2025') {
    return error(res, 'Recurso não encontrado', 404)
  }

  if (err.status) {
    return error(res, err.message, err.status)
  }

  return error(res, 'Erro interno do servidor', 500)
}

module.exports = errorHandler
