const shareSvc = require('../services/share.service')
const { success, created } = require('../utils/response')

const getAll = async (req, res, next) => {
  try {
    const shares = await shareSvc.getAll()
    return success(res, shares, 'Compartilhamentos listados com sucesso')
  } catch (err) { next(err) }
}

const getPublic = async (req, res, next) => {
  try {
    const share = await shareSvc.getByToken(req.params.token)
    return success(res, share, 'Calendário compartilhado')
  } catch (err) { next(err) }
}

const create = async (req, res, next) => {
  try {
    const share = await shareSvc.create(req.body)
    return created(res, share, 'Link de compartilhamento criado')
  } catch (err) { next(err) }
}

const toggle = async (req, res, next) => {
  try {
    const share = await shareSvc.toggle(req.params.id)
    const msg = share.active ? 'Link ativado com sucesso' : 'Link desativado com sucesso'
    return success(res, share, msg)
  } catch (err) { next(err) }
}

const remove = async (req, res, next) => {
  try {
    await shareSvc.remove(req.params.id)
    return success(res, null, 'Compartilhamento removido com sucesso')
  } catch (err) { next(err) }
}

module.exports = { getAll, getPublic, create, toggle, remove }
