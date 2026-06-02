const historyRepo = require('../repositories/history.repository')

const log = (entityType, entityId, action, description) =>
  historyRepo.create({ entityType, entityId: String(entityId), action, description })

const getAll = (filters) => historyRepo.findAll(filters)

const getById = async (id) => {
  const item = await historyRepo.findById(id)
  if (!item) {
    const err = new Error('Registro de histórico não encontrado')
    err.status = 404
    throw err
  }
  return item
}

module.exports = { log, getAll, getById }
