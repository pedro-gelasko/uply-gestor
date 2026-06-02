const prisma = require('../database/prisma')

const findAll = () =>
  prisma.client.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { calendars: true, shares: true } } },
  })

const findById = (id) =>
  prisma.client.findFirst({
    where: { id, deletedAt: null },
    include: { calendars: { where: { deletedAt: null } } },
  })

const findByUuid = (uuid) =>
  prisma.client.findFirst({
    where: { uuid, deletedAt: null },
    include: { calendars: { where: { deletedAt: null } } },
  })

const create = (data) => prisma.client.create({ data })

const update = (id, data) =>
  prisma.client.update({ where: { id }, data })

const softDelete = (id) =>
  prisma.client.update({ where: { id }, data: { deletedAt: new Date() } })

module.exports = { findAll, findById, findByUuid, create, update, softDelete }
