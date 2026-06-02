const prisma = require('../database/prisma')

const findAll = () =>
  prisma.share.findMany({
    orderBy: { createdAt: 'desc' },
    include: { client: { select: { id: true, uuid: true, name: true } } },
  })

const findById = (id) =>
  prisma.share.findUnique({ where: { id }, include: { client: true } })

const findByToken = (token) =>
  prisma.share.findUnique({ where: { token }, include: { client: { include: { calendars: { where: { deletedAt: null }, include: { events: { where: { deletedAt: null }, include: { attachments: true } } } } } } } })

const create = (data) =>
  prisma.share.create({ data, include: { client: { select: { id: true, uuid: true, name: true } } } })

const deactivate = (id) =>
  prisma.share.update({ where: { id }, data: { active: false } })

const remove = (id) => prisma.share.delete({ where: { id } })

module.exports = { findAll, findById, findByToken, create, deactivate, remove }
