const historySvc = require('../services/history.service')
const { success } = require('../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { entityType, action } = req.query
    const filters = {}
    if (entityType) filters.entityType = entityType
    if (action)     filters.action     = action
    const history = await historySvc.getAll(filters)
    return success(res, history, 'Histórico listado com sucesso')
  } catch (err) { next(err) }
}

const getById = async (req, res, next) => {
  try {
    const item = await historySvc.getById(parseInt(req.params.id))
    return success(res, item, 'Registro encontrado')
  } catch (err) { next(err) }
}

module.exports = { getAll, getById }
