const db = require('../database/db')
const { v4: uuidv4 } = require('uuid')

const findAll = async (filters = {}) => {
  let where = `e."deletedAt" IS NULL`
  const values = []
  let i = 1

  if (filters.calendarId) { where += ` AND e."calendarId" = $${i++}`; values.push(filters.calendarId) }
  if (filters.category)   { where += ` AND e.category = $${i++}`;     values.push(filters.category) }
  if (filters.status)     { where += ` AND e.status = $${i++}`;       values.push(filters.status) }

  const { rows } = await db.query(`
    SELECT e.*,
      json_agg(a.*) FILTER (WHERE a.id IS NOT NULL) AS attachments
    FROM events e
    LEFT JOIN attachments a ON a."eventId" = e.id
    WHERE ${where}
    GROUP BY e.id
    ORDER BY e."eventDate" ASC
  `, values)

  return rows.map(r => ({ ...r, attachments: r.attachments || [] }))
}

const findById = async (id) => {
  const { rows } = await db.query(`
    SELECT e.*,
      json_agg(a.*) FILTER (WHERE a.id IS NOT NULL) AS attachments
    FROM events e
    LEFT JOIN attachments a ON a."eventId" = e.id
    WHERE e.id = $1 AND e."deletedAt" IS NULL
    GROUP BY e.id
  `, [id])
  if (!rows[0]) return null
  rows[0].attachments = rows[0].attachments || []
  return rows[0]
}

const create = async (data) => {
  try {
    const { rows } = await db.query(`
      INSERT INTO events (uuid, "calendarId", title, description, category, status, "eventDate", "eventTime", "imageUrl", "createdAt", "updatedAt")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW()) RETURNING *
    `, [uuidv4(), data.calendarId, data.title, data.description || null,
        data.category, data.status || 'PLANNED', data.eventDate, data.eventTime || null, data.imageUrl || null])
    rows[0].attachments = []
    return rows[0]
  } catch (err) {
    if (err.message.includes('imageUrl') || err.message.includes('column')) {
      const { rows } = await db.query(`
        INSERT INTO events (uuid, "calendarId", title, description, category, status, "eventDate", "eventTime", "createdAt", "updatedAt")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW()) RETURNING *
      `, [uuidv4(), data.calendarId, data.title, data.description || null,
          data.category, data.status || 'PLANNED', data.eventDate, data.eventTime || null])
      rows[0].attachments = []
      return rows[0]
    }
    throw err
  }
}

const update = async (id, data) => {
  const fields = []
  const values = []
  let i = 1

  if (data.title       !== undefined) { fields.push(`title = $${i++}`);       values.push(data.title) }
  if (data.description !== undefined) { fields.push(`description = $${i++}`); values.push(data.description) }
  if (data.category    !== undefined) { fields.push(`category = $${i++}`);    values.push(data.category) }
  if (data.status      !== undefined) { fields.push(`status = $${i++}`);      values.push(data.status) }
  if (data.eventDate   !== undefined) { fields.push(`"eventDate" = $${i++}`); values.push(data.eventDate) }
  if (data.eventTime   !== undefined) { fields.push(`"eventTime" = $${i++}`); values.push(data.eventTime) }
  if (data.imageUrl    !== undefined) { fields.push(`"imageUrl" = $${i++}`);  values.push(data.imageUrl || null) }

  fields.push(`"updatedAt" = NOW()`)
  values.push(id)

  const { rows } = await db.query(
    `UPDATE events SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values
  )
  return rows[0]
}

const softDelete = async (id) => {
  await db.query(`UPDATE events SET "deletedAt" = NOW() WHERE id = $1`, [id])
}

module.exports = { findAll, findById, create, update, softDelete }
