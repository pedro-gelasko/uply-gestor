const { z } = require('zod')

const createShareSchema = z.object({
  clientId:  z.number().int().positive('clientId inválido'),
  expiresAt: z.string().datetime({ message: 'Data de expiração inválida' }).optional(),
})

module.exports = { createShareSchema }
