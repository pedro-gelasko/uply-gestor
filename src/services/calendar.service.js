const calendarRepo = require('../repositories/calendar.repository')
const clientRepo   = require('../repositories/client.repository')
const historySvc   = require('./history.service')

const getAll = (filters) => calendarRepo.findAll(filters)

const getById = async (id) => {
  const calendar = await calendarRepo.findById(parseInt(id))
  if (!calendar) {
    const err = new Error('Calendário não encontrado')
    err.status = 404
    throw err
  }
  return calendar
}

const create = async (data) => {
  const client = await clientRepo.findById(data.clientId)
  if (!client) {
    const err = new Error('Cliente não encontrado')
    err.status = 404
    throw err
  }
  const calendar = await calendarRepo.create(data)
  await historySvc.log('CALENDAR', calendar.id, 'CREATE', `Calendário "${calendar.name}" criado para ${client.name}`)
  return calendar
}

const update = async (id, data) => {
  const existing = await getById(id)
  const updated  = await calendarRepo.update(existing.id, data)
  await historySvc.log('CALENDAR', existing.id, 'UPDATE', `Calendário "${updated.name}" atualizado`)
  return updated
}

const remove = async (id) => {
  const existing = await getById(id)
  await calendarRepo.softDelete(existing.id)
  await historySvc.log('CALENDAR', existing.id, 'DELETE', `Calendário "${existing.name}" removido`)
}

module.exports = { getAll, getById, create, update, remove }
