const db = require('../database/db')
const { v4: uuidv4 } = require('uuid')

const findAll = async () => {
  const { rows: clients } = await db.query(`
    SELECT * FROM clients WHERE "deletedAt" IS NULL ORDER BY "createdAt" DESC
  `)
  if (!clients.length) return []

  const clientIds = clients.map(c => c.id)

  const [{ rows: calendars }, { rows: allEvents }] = await Promise.all([
    db.query(`
      SELECT id, uuid, "clientId", name, month, year, status
      FROM calendars WHERE "clientId" = ANY($1) AND "deletedAt" IS NULL
    `, [clientIds]),
    db.query(`
      SELECT e.id, e.uuid, e."calendarId", e.title, e."eventDate", e.category, e.status
      FROM events e
      JOIN calendars cal ON cal.id = e."calendarId"
      WHERE cal."clientId" = ANY($1) AND e."deletedAt" IS NULL AND cal."deletedAt" IS NULL
      ORDER BY e."eventDate" ASC
    `, [clientIds]),
  ])

  const eventsByCalendar = {}
  for (const ev of allEvents) {
    if (!eventsByCalendar[ev.calendarId]) eventsByCalendar[ev.calendarId] = []
    eventsByCalendar[ev.calendarId].push(ev)
  }

  const calendarsByClient = {}
  for (const cal of calendars) {
    cal.events = eventsByCalendar[cal.id] || []
    if (!calendarsByClient[cal.clientId]) calendarsByClient[cal.clientId] = []
    calendarsByClient[cal.clientId].push(cal)
  }

  for (const client of clients) {
    client.calendars = calendarsByClient[client.id] || []
  }

  return clients
}

const findById = async (id) => {
  const { rows } = await db.query(
    `SELECT * FROM clients WHERE id = $1 AND "deletedAt" IS NULL`, [id]
  )
  if (!rows[0]) return null

  const { rows: calendars } = await db.query(`
    SELECT * FROM calendars WHERE "clientId" = $1 AND "deletedAt" IS NULL
  `, [id])

  if (calendars.length) {
    const calendarIds = calendars.map(c => c.id)
    const { rows: events } = await db.query(`
      SELECT e.*, json_agg(a.*) FILTER (WHERE a.id IS NOT NULL) AS attachments
      FROM events e
      LEFT JOIN attachments a ON a."eventId" = e.id
      WHERE e."calendarId" = ANY($1) AND e."deletedAt" IS NULL
      GROUP BY e.id ORDER BY e."eventDate" ASC
    `, [calendarIds])

    const eventsByCalendar = {}
    for (const ev of events) {
      ev.attachments = ev.attachments || []
      if (!eventsByCalendar[ev.calendarId]) eventsByCalendar[ev.calendarId] = []
      eventsByCalendar[ev.calendarId].push(ev)
    }
    for (const cal of calendars) {
      cal.events = eventsByCalendar[cal.id] || []
    }
  } else {
    for (const cal of calendars) cal.events = []
  }

  rows[0].calendars = calendars
  return rows[0]
}

const create = async (data) => {
  const { rows } = await db.query(`
    INSERT INTO clients (uuid, name, "responsibleName", phone, email, notes, "logoPath", status, "createdAt", "updatedAt")
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW()) RETURNING *
  `, [uuidv4(), data.name, data.responsibleName, data.phone || null, data.email || null, data.notes || null, data.logoPath || null, data.status || 'ACTIVE'])
  return rows[0]
}

const update = async (id, data) => {
  const fields = []
  const values = []
  let i = 1

  if (data.name            !== undefined) { fields.push(`name = $${i++}`);              values.push(data.name) }
  if (data.responsibleName !== undefined) { fields.push(`"responsibleName" = $${i++}`); values.push(data.responsibleName) }
  if (data.phone           !== undefined) { fields.push(`phone = $${i++}`);             values.push(data.phone) }
  if (data.email           !== undefined) { fields.push(`email = $${i++}`);             values.push(data.email) }
  if (data.notes           !== undefined) { fields.push(`notes = $${i++}`);             values.push(data.notes) }
  if (data.status          !== undefined) { fields.push(`status = $${i++}`);            values.push(data.status) }
  if (data.logoPath        !== undefined) { fields.push(`"logoPath" = $${i++}`);        values.push(data.logoPath) }

  fields.push(`"updatedAt" = NOW()`)
  values.push(id)

  const { rows } = await db.query(
    `UPDATE clients SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values
  )
  return rows[0]
}

const softDelete = async (id) => {
  await db.query(`UPDATE clients SET "deletedAt" = NOW() WHERE id = $1`, [id])
}

module.exports = { findAll, findById, create, update, softDelete }
