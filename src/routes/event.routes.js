const router   = require('express').Router()
const ctrl     = require('../controllers/event.controller')
const validate = require('../middlewares/validate')
const { createEventSchema, updateEventSchema } = require('../validators/event.validator')

router.get('/',       ctrl.getAll)
router.get('/:id',    ctrl.getById)
router.post('/',      validate(createEventSchema), ctrl.create)
router.put('/:id',    validate(updateEventSchema), ctrl.update)
router.delete('/:id', ctrl.remove)

module.exports = router
