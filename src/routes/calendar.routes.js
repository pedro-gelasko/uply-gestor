const router   = require('express').Router()
const ctrl     = require('../controllers/calendar.controller')
const validate = require('../middlewares/validate')
const { createCalendarSchema, updateCalendarSchema } = require('../validators/calendar.validator')

router.get('/',       ctrl.getAll)
router.get('/:id',    ctrl.getById)
router.post('/',      validate(createCalendarSchema), ctrl.create)
router.put('/:id',    validate(updateCalendarSchema), ctrl.update)
router.delete('/:id', ctrl.remove)

module.exports = router
