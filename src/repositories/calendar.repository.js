const db = require('../database/db')
const { v4: uuidv4 } = require('uuid')

const findAll = async (filters = {}) => {
  let where = `c."deletedAt" IS NULL`
  const values = []
  let i = 1

  if (filters.clientId) { where += ` AND c."clientId" = $${i++}`; values.push(filters.clientId) }

  const { rows } = await db.query(`
    SELECT c.*, cl.id AS "clientDbId", cl.name AS "clientName", cl.uuid AS "clientUuid",
      COUNT(e.id) AS "eventsCount"
    FROM calendars c
    JOIN clients cl ON cl.id = c."clientId"
    LEFT JOIN events e ON e."calendarId" = c.id AND e."deletedAt" IS NULL
    WHERE ${where}
    GROUP BY c.id, cl.id
    ORDER BY c.year DESC, c.month DESC
  `, values)

  return rows.map(r => ({
    ...r,
    client: { id: r.clientDbId, uuid: r.clientUuid, name: r.clientName },
    _count: { events: parseInt(r.eventsCount) },
  }))
}

const findById = async (id) => {
  const { rows } = await db.query(
    `SELECT c.*, cl.name AS "clientName", cl.uuid AS "clientUuid", cl.email AS "clientEmail"
     FROM calendars c JOIN clients cl ON cl.id = c."clientId"
     WHERE c.id = $1 AND c."deletedAt" IS NULL`, [id]
  )
  if (!rows[0]) return null

  const { rows: events } = await db.query(`
    SELECT * FROM events WHERE "calendarId" = $1 AND "deletedAt" IS NULL ORDER BY "eventDate" ASC
  `, [id])

  rows[0].client = { id: rows[0].clientDbId, uuid: rows[0].clientUuid, name: rows[0].clientName }
  rows[0].events = events
  return rows[0]
}

const create = async (data) => {
  const { rows } = await db.query(`
    INSERT INTO calendars (uuid, "clientId", name, month, year, status, "createdAt", "updatedAt")
    VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW()) RETURNING *
  `, [uuidv4(), data.clientId, data.name, data.month, data.year, data.status || 'ACTIVE'])
  return rows[0]
}

const update = async (id, data) => {
  const fields = []
  const values = []
  let i = 1

  if (data.name     !== undefined) { fields.push(`name = $${i++}`);     values.push(data.name) }
  if (data.month    !== undefined) { fields.push(`month = $${i++}`);    values.push(data.month) }
  if (data.year     !== undefined) { fields.push(`year = $${i++}`);     values.push(data.year) }
  if (data.status   !== undefined) { fields.push(`status = $${i++}`);   values.push(data.status) }

  fields.push(`"updatedAt" = NOW()`)
  values.push(id)

  const { rows } = await db.query(
    `UPDATE calendars SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values
  )
  return rows[0]
}

const softDelete = async (id) => {
  await db.query(`UPDATE calendars SET "deletedAt" = NOW() WHERE id = $1`, [id])
}

module.exports = { findAll, findById, create, update, softDelete }
