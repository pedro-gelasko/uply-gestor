const prisma = require('../database/prisma')

const findById = (id) =>
  prisma.attachment.findUnique({ where: { id }, include: { event: true } })

const findByUuid = (uuid) =>
  prisma.attachment.findUnique({ where: { uuid }, include: { event: true } })

const findByEventId = (eventId) =>
  prisma.attachment.findMany({ where: { eventId }, orderBy: { createdAt: 'asc' } })

const create = (data) => prisma.attachment.create({ data })

const remove = (id) => prisma.attachment.delete({ where: { id } })

module.exports = { findById, findByUuid, findByEventId, create, remove }
