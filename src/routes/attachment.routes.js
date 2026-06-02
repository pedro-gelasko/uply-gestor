const router = require('express').Router()
const ctrl   = require('../controllers/attachment.controller')
const upload = require('../middlewares/upload')

router.post('/',      upload.single('file'), ctrl.upload)
router.get('/:id',    ctrl.getById)
router.delete('/:id', ctrl.remove)

module.exports = router
