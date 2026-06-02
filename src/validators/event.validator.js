const { z } = require('zod')

const categories = ['VIDEO', 'REELS', 'STORY', 'CREATIVE', 'CAMPAIGN', 'INSTITUTIONAL', 'COMMEMORATIVE', 'OTHER']
const statuses   = ['PLANNED', 'IN_PRODUCTION', 'WAITING_APPROVAL', 'PUBLISHED', 'CANCELLED']

const createEventSchema = z.object({
  calendarId:  z.number().int().positive('calendarId inválido'),
  title:       z.string().min(2, 'Título deve ter ao menos 2 caracteres'),
  description: z.string().optional(),
  category:    z.enum(categories, { errorMap: () => ({ message: `Categoria deve ser: ${categories.join(', ')}` }) }),
  status:      z.enum(statuses).optional(),
  eventDate:   z.string().datetime({ message: 'Data inválida, use ISO 8601' }),
  eventTime:   z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida, use HH:MM').optional(),
})

const updateEventSchema = createEventSchema.partial()

module.exports = { createEventSchema, updateEventSchema }
