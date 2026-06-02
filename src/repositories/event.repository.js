const prisma = require('../database/prisma')

const findAll = (filters = {}) =>
  prisma.event.findMany({
    where: { deletedAt: null, ...filters },
    orderBy: { eventDate: 'asc' },
    include: {
      calendar: { select: { id: true, uuid: true, name: true, client: { select: { id: true, uuid: true, name: true } } } },
      attachments: true,
    },
  })

const findById = (id) =>
  prisma.event.findFirst({
    where: { id, deletedAt: null },
    include: { calendar: { include: { client: true } }, attachments: true },
  })

const findByUuid = (uuid) =>
  prisma.event.findFirst({
    where: { uuid, deletedAt: null },
    include: { calendar: { include: { client: true } }, attachments: true },
  })

const create = (data) =>
  prisma.event.create({
    data,
    include: { attachments: true },
  })

const update = (id, data) =>
  prisma.event.update({ where: { id }, data, include: { attachments: true } })

const softDelete = (id) =>
  prisma.event.update({ where: { id }, data: { deletedAt: new Date() } })

module.exports = { findAll, findById, findByUuid, create, update, softDelete }
