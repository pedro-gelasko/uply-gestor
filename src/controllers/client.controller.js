const clientSvc  = require('../services/client.service')
const { success, created } = require('../utils/response')

const getAll = async (req, res, next) => {
  try {
    const clients = await clientSvc.getAll()
    return success(res, clients, 'Clientes listados com sucesso')
  } catch (err) { next(err) }
}

const getById = async (req, res, next) => {
  try {
    const client = await clientSvc.getById(req.params.id)
    return success(res, client, 'Cliente encontrado')
  } catch (err) { next(err) }
}

const create = async (req, res, next) => {
  try {
    const client = await clientSvc.create(req.body)
    return created(res, client, 'Cliente criado com sucesso')
  } catch (err) { next(err) }
}

const update = async (req, res, next) => {
  try {
    const client = await clientSvc.update(req.params.id, req.body)
    return success(res, client, 'Cliente atualizado com sucesso')
  } catch (err) { next(err) }
}

const remove = async (req, res, next) => {
  try {
    await clientSvc.remove(req.params.id)
    return success(res, null, 'Cliente removido com sucesso')
  } catch (err) { next(err) }
}

const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error('Nenhum arquivo enviado'); err.status = 400; throw err
    }
    const client = await clientSvc.updateLogo(req.params.id, req.file.path)
    return success(res, client, 'Logo atualizada com sucesso')
  } catch (err) { next(err) }
}

module.exports = { getAll, getById, create, update, remove, uploadLogo }
