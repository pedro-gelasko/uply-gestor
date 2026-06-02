const success = (res, data = null, message = 'OK', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

const created = (res, data, message = 'Criado com sucesso') => {
  return success(res, data, message, 201)
}

const error = (res, message = 'Erro interno do servidor', statusCode = 500, errors = null) => {
  const body = { success: false, message }
  if (errors) body.errors = errors
  return res.status(statusCode).json(body)
}

const notFound = (res, message = 'Recurso não encontrado') => {
  return error(res, message, 404)
}

const badRequest = (res, message = 'Requisição inválida', errors = null) => {
  return error(res, message, 400, errors)
}

module.exports = { success, created, error, notFound, badRequest }
