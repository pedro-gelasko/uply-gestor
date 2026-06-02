const db = require('../database/db')
const { v4: uuidv4 } = require('uuid')

const findById = async (id) => {
  const { rows } = await db.query(
    `SELECT a.*, e.title AS "eventTitle" FROM attachments a
     JOIN events e ON e.id = a."eventId" WHERE a.id = $1`, [id]
  )
  return rows[0] || null
}

const findByUuid = async (uuid) => {
  const { rows } = await db.query(
    `SELECT * FROM attachments WHERE uuid = $1`, [uuid]
  )
  return rows[0] || null
}

const create = async (data) => {
  const { rows } = await db.query(`
    INSERT INTO attachments (uuid, "eventId", "fileName", "filePath", "mimeType", size, "createdAt")
    VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *
  `, [uuidv4(), data.eventId, data.fileName, data.filePath, data.mimeType, data.size])
  return rows[0]
}

const remove = async (id) => {
  await db.query(`DELETE FROM attachments WHERE id = $1`, [id])
}

module.exports = { findById, findByUuid, create, remove }
