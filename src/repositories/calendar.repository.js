const prisma = require('../database/prisma')

const findAll = (filters = {}) =>
  prisma.calendar.findMany({
    where: { deletedAt: null, ...filters },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
    include: {
      client: { select: { id: true, uuid: true, name: true } },
      _count: { select: { events: true } },
    },
  })

const findById = (id) =>
  prisma.calendar.findFirst({
    where: { id, deletedAt: null },
    include: {
      client: true,
      events: { where: { deletedAt: null }, orderBy: { eventDate: 'asc' } },
    },
  })

const findByUuid = (uuid) =>
  prisma.calendar.findFirst({
    where: { uuid, deletedAt: null },
    include: {
      client: true,
      events: { where: { deletedAt: null }, orderBy: { eventDate: 'asc' } },
    },
  })

const create = (data) =>
  prisma.calendar.create({
    data,
    include: { client: { select: { id: true, uuid: true, name: true } } },
  })

const update = (id, data) =>
  prisma.calendar.update({ where: { id }, data })

const softDelete = (id) =>
  prisma.calendar.update({ where: { id }, data: { deletedAt: new Date() } })

module.exports = { findAll, findById, findByUuid, create, update, softDelete }
