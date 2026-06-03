const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const userRepo = require('../repositories/user.repository')

const JWT_SECRET  = process.env.JWT_SECRET  || 'uply_secret'
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d'

const login = async (email, password) => {
  const user = await userRepo.findByEmail(email)
  if (!user) {
    const err = new Error('E-mail ou senha incorretos')
    err.status = 401
    throw err
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    const err = new Error('E-mail ou senha incorretos')
    err.status = 401
    throw err
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  )

  const { password: _, ...userData } = user
  return { token, user: userData }
}

const me = async (id) => {
  const user = await userRepo.findById(id)
  if (!user) {
    const err = new Error('Usuário não encontrado')
    err.status = 404
    throw err
  }
  return user
}

const createUser = async (data, creatorRole) => {
  if (creatorRole !== 'SUPERADMIN') {
    const err = new Error('Apenas o Super Admin pode criar usuários')
    err.status = 403
    throw err
  }
  const existing = await userRepo.findByEmail(data.email)
  if (existing) {
    const err = new Error('E-mail já cadastrado')
    err.status = 409
    throw err
  }
  const hashed = await bcrypt.hash(data.password, 10)
  return userRepo.create({ ...data, password: hashed })
}

const getUsers = async (requesterRole) => {
  if (requesterRole !== 'SUPERADMIN') {
    const err = new Error('Acesso negado')
    err.status = 403
    throw err
  }
  return userRepo.findAll()
}

const toggleUser = async (id, requesterRole) => {
  if (requesterRole !== 'SUPERADMIN') {
    const err = new Error('Acesso negado')
    err.status = 403
    throw err
  }
  const user = await userRepo.findById(id)
  if (!user) {
    const err = new Error('Usuário não encontrado')
    err.status = 404
    throw err
  }
  return userRepo.updateActive(id, !user.active)
}

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await userRepo.findByEmailFull(userId)
  if (!user) {
    const err = new Error('Usuário não encontrado'); err.status = 404; throw err
  }
  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) {
    const err = new Error('Senha atual incorreta'); err.status = 401; throw err
  }
  if (newPassword.length < 6) {
    const err = new Error('Nova senha deve ter ao menos 6 caracteres'); err.status = 400; throw err
  }
  const hashed = await bcrypt.hash(newPassword, 10)
  await userRepo.updatePassword(userId, hashed)
}

module.exports = { login, me, createUser, getUsers, toggleUser, changePassword }
