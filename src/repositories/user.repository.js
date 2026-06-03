const db = require('../database/db')
const { v4: uuidv4 } = require('uuid')

const findByEmail = async (email) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE email = $1 AND active = true`, [email])
  return rows[0] || null
}

const findByEmailFull = async (id) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE id = $1`, [id])
  return rows[0] || null
}

const updatePassword = async (id, hashedPassword) => {
  await db.query(
    `UPDATE users SET password = $1, "mustChangePassword" = false, "updatedAt" = NOW() WHERE id = $2`,
    [hashedPassword, id]
  )
}

const findById = async (id) => {
  const { rows } = await db.query(`SELECT id, uuid, name, email, role, active, "mustChangePassword", "createdAt" FROM users WHERE id = $1`, [id])
  return rows[0] || null
}

const findAll = async () => {
  const { rows } = await db.query(`SELECT id, uuid, name, email, role, active, "createdAt" FROM users ORDER BY "createdAt" DESC`)
  return rows
}

const create = async (data) => {
  const { rows } = await db.query(`
    INSERT INTO users (uuid, name, email, password, role, active, "mustChangePassword", "createdAt", "updatedAt")
    VALUES ($1,$2,$3,$4,$5,true,true,NOW(),NOW()) RETURNING id, uuid, name, email, role, active, "mustChangePassword", "createdAt"
  `, [uuidv4(), data.name, data.email, data.password, data.role || 'ADMIN'])
  return rows[0]
}

const updateActive = async (id, active) => {
  const { rows } = await db.query(
    `UPDATE users SET active = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING id, uuid, name, email, role, active`,
    [active, id]
  )
  return rows[0]
}

module.exports = { findByEmail, findByEmailFull, findById, findAll, create, updateActive, updatePassword }
