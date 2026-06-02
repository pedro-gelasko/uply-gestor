const db = require('../database/db')
const { v4: uuidv4 } = require('uuid')

const findAll = async (filters = {}) => {
  let where = '1=1'
  const values = []
  let i = 1

  if (filters.entityType) { where += ` AND "entityType" = $${i++}`; values.push(filters.entityType) }
  if (filters.action)     { where += ` AND action = $${i++}`;       values.push(filters.action) }

  const { rows } = await db.query(
    `SELECT * FROM history WHERE ${where} ORDER BY "createdAt" DESC LIMIT 200`, values
  )
  return rows
}

const findById = async (id) => {
  const { rows } = await db.query(`SELECT * FROM history WHERE id = $1`, [id])
  return rows[0] || null
}

const create = async (data) => {
  const { rows } = await db.query(`
    INSERT INTO history (uuid, "entityType", "entityId", action, description, "createdAt")
    VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *
  `, [uuidv4(), data.entityType, String(data.entityId), data.action, data.description])
  return rows[0]
}

module.exports = { findAll, findById, create }
