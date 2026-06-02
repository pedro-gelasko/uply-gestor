const router     = require('express').Router()
const ctrl       = require('../controllers/client.controller')
const validate   = require('../middlewares/validate')
const upload     = require('../middlewares/upload')
const { createClientSchema, updateClientSchema } = require('../validators/client.validator')

router.get('/',          ctrl.getAll)
router.get('/:id',       ctrl.getById)
router.post('/',         validate(createClientSchema), ctrl.create)
router.put('/:id',       validate(updateClientSchema), ctrl.update)
router.delete('/:id',    ctrl.remove)
router.post('/:id/logo', upload.single('logo'), ctrl.uploadLogo)

module.exports = router
