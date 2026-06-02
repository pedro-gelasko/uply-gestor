const eventRepo    = require('../repositories/event.repository')
const calendarRepo = require('../repositories/calendar.repository')
const historySvc   = require('./history.service')

const getAll = (filters) => eventRepo.findAll(filters)

const getById = async (id) => {
  const event = await eventRepo.findById(parseInt(id))
  if (!event) {
    const err = new Error('Evento não encontrado')
    err.status = 404
    throw err
  }
  return event
}

const create = async (data) => {
  const calendar = await calendarRepo.findById(data.calendarId)
  if (!calendar) {
    const err = new Error('Calendário não encontrado')
    err.status = 404
    throw err
  }
  const event = await eventRepo.create({ ...data, eventDate: new Date(data.eventDate) })
  await historySvc.log('EVENT', event.id, 'CREATE', `Evento "${event.title}" criado`)
  return event
}

const update = async (id, data) => {
  const existing = await getById(id)
  const payload  = { ...data }
  if (payload.eventDate) payload.eventDate = new Date(payload.eventDate)
  const updated  = await eventRepo.update(existing.id, payload)
  await historySvc.log('EVENT', existing.id, 'UPDATE', `Evento "${updated.title}" atualizado`)
  return updated
}

const remove = async (id) => {
  const existing = await getById(id)
  await eventRepo.softDelete(existing.id)
  await historySvc.log('EVENT', existing.id, 'DELETE', `Evento "${existing.title}" removido`)
}

module.exports = { getAll, getById, create, update, remove }
