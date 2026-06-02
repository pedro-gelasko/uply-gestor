const calendarSvc = require('../services/calendar.service')
const { success, created } = require('../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { clientId } = req.query
    const filters = clientId ? { clientId: parseInt(clientId) } : {}
    const calendars = await calendarSvc.getAll(filters)
    return success(res, calendars, 'Calendários listados com sucesso')
  } catch (err) { next(err) }
}

const getById = async (req, res, next) => {
  try {
    const calendar = await calendarSvc.getById(req.params.id)
    return success(res, calendar, 'Calendário encontrado')
  } catch (err) { next(err) }
}

const create = async (req, res, next) => {
  try {
    const calendar = await calendarSvc.create(req.body)
    return created(res, calendar, 'Calendário criado com sucesso')
  } catch (err) { next(err) }
}

const update = async (req, res, next) => {
  try {
    const calendar = await calendarSvc.update(req.params.id, req.body)
    return success(res, calendar, 'Calendário atualizado com sucesso')
  } catch (err) { next(err) }
}

const remove = async (req, res, next) => {
  try {
    await calendarSvc.remove(req.params.id)
    return success(res, null, 'Calendário removido com sucesso')
  } catch (err) { next(err) }
}

module.exports = { getAll, getById, create, update, remove }
