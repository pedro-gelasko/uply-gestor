const router       = require('express').Router()
const db           = require('../database/db')
const authenticate = require('../middlewares/auth')
const { success }  = require('../utils/response')

router.get('/', authenticate, async (req, res, next) => {
  try {
    const [eventsRes, historyRes] = await Promise.all([
      db.query(`
        SELECT
          COUNT(*)                                            AS total,
          COUNT(*) FILTER (WHERE status = 'PUBLISHED')       AS published
        FROM events
        WHERE "deletedAt" IS NULL
      `),
      db.query(`
        SELECT COUNT(*) AS count
        FROM history
        WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      `),
    ])

    const total     = parseInt(eventsRes.rows[0].total)
    const published = parseInt(eventsRes.rows[0].published)
    const actions   = parseInt(historyRes.rows[0].count)

    const publishRate = total > 0 ? Math.round((published / total) * 100) : null

    return success(res, { publishRate, actions, total, published })
  } catch (err) { next(err) }
})

module.exports = router
