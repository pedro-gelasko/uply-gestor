const { badRequest } = require('../utils/response')

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body)
    next()
  } catch (err) {
    const errors = err.errors?.map((e) => ({ field: e.path.join('.'), message: e.message }))
    return badRequest(res, 'Dados inválidos', errors)
  }
}

module.exports = validate
