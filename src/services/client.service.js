const clientRepo   = require('../repositories/client.repository')
const historySvc   = require('./history.service')

const getAll = () => clientRepo.findAll()

const getById = async (id) => {
  const client = await clientRepo.findById(parseInt(id))
  if (!client) {
    const err = new Error('Cliente não encontrado')
    err.status = 404
    throw err
  }
  return client
}

const create = async (data) => {
  const client = await clientRepo.create(data)
  await historySvc.log('CLIENT', client.id, 'CREATE', `Cliente "${client.name}" criado`)
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
