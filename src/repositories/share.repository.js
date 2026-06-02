const db = require('../database/db')
const { v4: uuidv4 } = require('uuid')

const findAll = async () => {
  const { rows } = await db.query(`
    SELECT s.*, cl.name AS "clientName", cl.uuid AS "clientUuid"
    FROM shares s JOIN clients cl ON cl.id = s."clientId"
    ORDER BY s."createdAt" DESC
  `)
  return rows.map(r => ({ ...r, client: { id: r.clientId, uuid: r.clientUuid, name: r.clientName } }))
}

const findById = async (id) => {
  const { rows } = await db.query(
    `SELECT s.*, cl.name AS "clientName" FROM shares s
     JOIN clients cl ON cl.id = s."clientId" WHERE s.id = $1`, [id]
  )
  return rows[0] || null
}

const findByToken = async (token) => {
  const { rows } = await db.query(
    `SELECT s.* FROM shares s WHERE s.token = $1`, [token]
  )
  if (!rows[0]) return null
  const share = rows[0]

  const { rows: clientRows } = await db.query(
    `SELECT * FROM clients WHERE id = $1 AND "deletedAt" IS NULL`, [share.clientId]
  )
  if (!clientRows[0]) return null

  const { rows: calendars } = await db.query(
    `SELECT * FROM calendars WHERE "clientId" = $1 AND "deletedAt" IS NULL`, [share.clientId]
  )

  for (const cal of calendars) {
    const { rows: events } = await db.query(`
      SELECT e.*, json_agg(a.*) FILTER (WHERE a.id IS NOT NULL) AS attachments
      FROM events e
      LEFT JOIN attachments a ON a."eventId" = e.id
      WHERE e."calendarId" = $1 AND e."deletedAt" IS NULL
      GROUP BY e.id ORDER BY e."eventDate" ASC
    `, [cal.id])
    cal.events = events.map(e => ({ ...e, attachments: e.attachments || [] }))
  }

  clientRows[0].calendars = calendars
  share.client = clientRows[0]
  return share
}

const create = async (data) => {
  const { rows } = await db.query(`
    INSERT INTO shares (uuid, "clientId", token, "expiresAt", active, "createdAt")
    VALUES ($1,$2,$3,$4,true,NOW()) RETURNING *
  `, [uuidv4(), data.clientId, uuidv4(), data.expiresAt || null])

  const { rows: clientRows } = await db.query(
    `SELECT id, uuid, name FROM clients WHERE id = $1`, [data.clientId]
  )
  rows[0].client = clientRows[0]
  return rows[0]
}

const remove = async (id) => {
  await db.query(`DELETE FROM shares WHERE id = $1`, [id])
}

module.exports = { findAll, findById, findByToken, create, remove }
