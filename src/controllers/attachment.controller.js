const attachmentSvc = require('../services/attachment.service')
const { success, created } = require('../utils/response')
const path = require('path')
const fs   = require('fs')

const upload = async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error('Nenhum arquivo enviado'); err.status = 400; throw err
    }
    const eventId    = parseInt(req.body.eventId)
    const attachment = await attachmentSvc.create({ eventId, file: req.file })
    return created(res, attachment, 'Arquivo anexado com sucesso')
  } catch (err) { next(err) }
}

const getById = async (req, res, next) => {
  try {
    const attachment = await attachmentSvc.getById(req.params.id)
    const filePath   = path.resolve(attachment.filePath)
    if (!fs.existsSync(filePath)) {
      const err = new Error('Arquivo não encontrado no disco'); err.status = 404; throw err
    }
    return res.download(filePath, attachment.fileName)
  } catch (err) { next(err) }
}

const remove = async (req, res, next) => {
  try {
    await attachmentSvc.remove(req.params.id)
    return success(res, null, 'Arquivo removido com sucesso')
  } catch (err) { next(err) }
}

module.exports = { upload, getById, remove }
