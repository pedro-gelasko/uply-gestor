const authSvc = require('../services/auth.service')
const { success, created, badRequest } = require('../utils/response')

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return badRequest(res, 'E-mail e senha são obrigatórios')
    const result = await authSvc.login(email, password)
    return success(res, result, 'Login realizado com sucesso')
  } catch (err) { next(err) }
}

const me = async (req, res, next) => {
  try {
    const user = await authSvc.me(req.user.id)
    return success(res, user, 'Usuário autenticado')
  } catch (err) { next(err) }
}

const createUser = async (req, res, next) => {
  try {
    const user = await authSvc.createUser(req.body, req.user.role)
    return created(res, user, 'Usuário criado com sucesso')
  } catch (err) { next(err) }
}

const getUsers = async (req, res, next) => {
  try {
    const users = await authSvc.getUsers(req.user.role)
    return success(res, users, 'Usuários listados')
  } catch (err) { next(err) }
}

const toggleUser = async (req, res, next) => {
  try {
    const user = await authSvc.toggleUser(parseInt(req.params.id), req.user.role)
    return success(res, user, user.active ? 'Usuário ativado' : 'Usuário desativado')
  } catch (err) { next(err) }
}

module.exports = { login, me, createUser, getUsers, toggleUser }
