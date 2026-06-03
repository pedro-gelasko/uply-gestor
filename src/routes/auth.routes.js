const router       = require('express').Router()
const ctrl         = require('../controllers/auth.controller')
const authenticate = require('../middlewares/auth')

router.post('/login',           ctrl.login)
router.get('/me',               authenticate, ctrl.me)
router.get('/users',            authenticate, ctrl.getUsers)
router.post('/users',           authenticate, ctrl.createUser)
router.patch('/users/:id/toggle', authenticate, ctrl.toggleUser)

module.exports = router
