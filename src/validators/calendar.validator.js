const { z } = require('zod')

const createCalendarSchema = z.object({
  clientId: z.number().int().positive('clientId inválido'),
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  month: z.number().int().min(1).max(12, 'Mês deve ser entre 1 e 12'),
  year: z.number().int().min(2020, 'Ano inválido'),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
})

const updateCalendarSchema = createCalendarSchema.partial()

module.exports = { createCalendarSchema, updateCalendarSchema }
