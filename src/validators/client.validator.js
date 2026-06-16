const { z } = require('zod')

const createClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  responsibleName: z.string().min(2, 'Nome do responsável deve ter ao menos 2 caracteres'),
  phone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  notes: z.string().optional(),
  logoPath: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

const updateClientSchema = createClientSchema.partial()

module.exports = { createClientSchema, updateClientSchema }
