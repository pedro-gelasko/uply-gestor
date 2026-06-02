const prisma = require('../database/prisma')

const findAll = (filters = {}) =>
  prisma.history.findMany({
    where: filters,
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

const findById = (id) => prisma.history.findUnique({ where: { id } })

const create = (data) => prisma.history.create({ data })

module.exports = { findAll, findById, create }
