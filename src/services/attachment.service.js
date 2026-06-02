const attachmentRepo = require('../repositories/attachment.repository')
const eventRepo      = require('../repositories/event.repository')
const historySvc     = require('./history.service')
const fs             = require('fs')
const path           = require('path')

const getById = async (id) => {
  const attachment = await attachmentRepo.findById(parseInt(id))
  if (!attachment) {
    const err = new Error('Anexo não encontrado')
    err.status = 404
    throw err
  }
  return attachment
}

const create = async ({ eventId, file }) => {
  const event = await eventRepo.findById(eventId)
  if (!event) {
    const err = new Error('Evento não encontrado')
    err.status = 404
    throw err
  }
  const attachment = await attachmentRepo.create({
    eventId,
    fileName: file.originalname,
    filePath: file.path,
    mimeType: file.mimetype,
    size:     file.size,
  })
  await historySvc.log('ATTACHMENT', attachment.id, 'CREATE', `Arquivo "${file.originalname}" anexado ao evento "${event.title}"`)
  return attachment
}

const remove = async (id) => {
  const attachment = await getById(id)
  const filePath   = path.resolve(attachment.filePath)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  await attachmentRepo.remove(attachment.id)
  await historySvc.log('ATTACHMENT', attachment.id, 'DELETE', `Arquivo "${attachment.fileName}" removido`)
}

module.exports = { getById, create, remove }
