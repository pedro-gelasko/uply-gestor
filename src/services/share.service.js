const shareRepo  = require('../repositories/share.repository')
const clientRepo = require('../repositories/client.repository')
const historySvc = require('./history.service')

const getAll = () => shareRepo.findAll()

const getByToken = async (token) => {
  const share = await shareRepo.findByToken(token)
  if (!share) {
    const err = new Error('Link de compartilhamento não encontrado')
    err.status = 404
    throw err
  }
  if (!share.active) {
    const err = new Error('Este link foi desativado')
    err.status = 403
    throw err
  }
  if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
    const err = new Error('Este link expirou')
    err.status = 403
    throw err
  }
  return share
}

const create = async (data) => {
  const client = await clientRepo.findById(data.clientId)
  if (!client) {
    const err = new Error('Cliente não encontrado')
    err.status = 404
    throw err
  }
  const share = await shareRepo.create(data)
  await historySvc.log('SHARE', share.id, 'CREATE', `Link de compartilhamento criado para ${client.name}`)
  return share
}

const toggle = async (id) => {
  const share = await shareRepo.findById(parseInt(id))
  if (!share) {
    const err = new Error('Compartilhamento não encontrado')
    err.status = 404
    throw err
  }
  const updated = await shareRepo.toggle(share.id)
  const action = updated.active ? 'Ativado' : 'Desativado'
  await historySvc.log('SHARE', share.id, 'UPDATE', `Link de compartilhamento ${action}`)
  return updated
}

const remove = async (id) => {
  const share = await shareRepo.findById(parseInt(id))
  if (!share) {
    const err = new Error('Compartilhamento não encontrado')
    err.status = 404
    throw err
  }
  await shareRepo.remove(share.id)
  await historySvc.log('SHARE', share.id, 'DELETE', `Link de compartilhamento removido`)
}

module.exports = { getAll, getByToken, create, toggle, remove }
