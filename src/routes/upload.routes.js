const router = require('express').Router()
const upload = require('../middlewares/upload')
const { success, error } = require('../utils/response')

router.post('/', upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error('Nenhum arquivo enviado'); err.status = 400; throw err
    }
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3333}`
    const url     = `${baseUrl}/uploads/${req.file.filename}`
    return success(res, {
      url,
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      size:     req.file.size,
    }, 'Upload realizado com sucesso')
  } catch (err) { next(err) }
})

module.exports = router
