const eventSvc = require('../services/event.service')
const { success, created } = require('../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { calendarId, category, status } = req.query
    const filters = {}
    if (calendarId) filters.calendarId = parseInt(calendarId)
    if (category)   filters.category   = category
    if (status)     filters.status     = status
    const events = await eventSvc.getAll(filters)
    return success(res, events, 'Eventos listados com sucesso')
  } catch (err) { next(err) }
}

const getById = async (req, res, next) => {
  try {
    const event = await eventSvc.getById(req.params.id)
    return success(res, event, 'Evento encontrado')
  } catch (err) { next(err) }
}

const create = async (req, res, next) => {
  try {
    const event = await eventSvc.create(req.body)
    return created(res, event, 'Evento criado com sucesso')
  } catch (err) { next(err) }
}

const update = async (req, res, next) => {
  try {
    const event = await eventSvc.update(req.params.id, req.body)
    return success(res, event, 'Evento atualizado com sucesso')
  } catch (err) { next(err) }
}

const remove = async (req, res, next) => {
  try {
    await eventSvc.remove(req.params.id)
    return success(res, null, 'Evento removido com sucesso')
  } catch (err) { next(err) }
}

module.exports = { getAll, getById, create, update, remove }
