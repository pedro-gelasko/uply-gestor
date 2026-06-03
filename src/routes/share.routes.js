const router   = require('express').Router()
const ctrl     = require('../controllers/share.controller')
const validate = require('../middlewares/validate')
const { createShareSchema } = require('../validators/share.validator')

router.get('/',              ctrl.getAll)
router.get('/public/:token', ctrl.getPublic)
router.post('/',             validate(createShareSchema), ctrl.create)
router.patch('/:id/toggle',  ctrl.toggle)
router.delete('/:id',        ctrl.remove)

module.exports = router
