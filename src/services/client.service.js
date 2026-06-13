const clientRepo   = require('../repositories/client.repository')
const calendarRepo = require('../repositories/calendar.repository')
const historySvc   = require('./history.service')

const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const getAll = () => clientRepo.findAll()

const ensureCalendar = async (client) => {
  if (client.calendars && client.calendars.length > 0) return client
  const now   = new Date()
  const month = now.getMonth() + 1
  const year  = now.getFullYear()
  await calendarRepo.create({
    clientId: client.id,
    name:     `Calendário ${MONTHS_PT[month - 1]} ${year}`,
    month,
    year,
    status:   'ACTIVE',
  })
  return clientRepo.findById(client.id)
}

const getById = async (id) => {
  const client = await clientRepo.findById(parseInt(id))
  if (!client) {
    const err = new Error('Cliente não encontrado')
    err.status = 404
    throw err
  }
  return ensureCalendar(client)
}

const createDefaultCalendar = async (clientId) => {
  try {
    const now   = new Date()
    const month = now.getMonth() + 1
    const year  = now.getFullYear()
    await calendarRepo.create({
      clientId,
      name:   `Calendário ${MONTHS_PT[month - 1]} ${year}`,
      month,
      year,
      status: 'ACTIVE',
    })
  } catch (_) {}
}

const create = async (data) => {
  const client = await clientRepo.create(data)
  await createDefaultCalendar(client.id)
  historySvc.log('CLIENT', client.id, 'CREATE', `Cliente "${client.name}" criado`).catch(() => {})
  return client
}

const update = async (id, data) => {
  const existing = await getById(id)
  const updated  = await clientRepo.update(existing.id, data)
  await historySvc.log('CLIENT', existing.id, 'UPDATE', `Cliente "${updated.name}" atualizado`)
  return updated
}

const remove = async (id) => {
  const existing = await getById(id)
  await clientRepo.softDelete(existing.id)
  await historySvc.log('CLIENT', existing.id, 'DELETE', `Cliente "${existing.name}" removido`)
}

const updateLogo = async (id, logoPath) => {
  const existing = await getById(id)
  return clientRepo.update(existing.id, { logoPath })
}

module.exports = { getAll, getById, create, update, remove, updateLogo }
