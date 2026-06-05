const router = require('express').Router()

router.use('/auth',        require('./auth.routes'))
router.use('/stats',       require('./stats.routes'))
router.use('/uploads',     require('./upload.routes'))
router.use('/clients',     require('./client.routes'))
router.use('/calendars',   require('./calendar.routes'))
router.use('/events',      require('./event.routes'))
router.use('/attachments', require('./attachment.routes'))
router.use('/shares',      require('./share.routes'))
router.use('/history',     require('./history.routes'))

module.exports = router
