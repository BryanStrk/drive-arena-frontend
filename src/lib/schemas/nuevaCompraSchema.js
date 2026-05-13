import { z } from 'zod'

const lineaSchema = z.object({
  circuitoId: z.string().optional(),
  tarifaId: z
    .coerce.number({ required_error: 'Selecciona una tarifa' })
    .int()
    .positive('Selecciona una tarifa'),
  cantidad: z
    .coerce.number({ required_error: 'Indica la cantidad' })
    .int()
    .min(1, 'Mínimo 1')
    .max(20, 'Máximo 20'),
})

export const nuevaCompraSchema = z.object({
  clienteId: z
    .number({ required_error: 'Selecciona un cliente' })
    .int()
    .positive('Selecciona un cliente'),

  hotelId: z.preprocess(
    (v) => (v === '' || v == null ? null : Number(v)),
    z.number().int().positive().nullable()
  ),

  tipoPension: z.enum(['SIN', 'MEDIA', 'COMPLETA']).default('SIN'),

  fechaEntrada: z.string().default(''),
  fechaSalida: z.string().default(''),

  lineas: z.array(lineaSchema).min(1, 'Añade al menos una entrada'),
}).superRefine((data, ctx) => {
  if (data.hotelId != null && data.tipoPension === 'SIN') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Con alojamiento selecciona Media o Completa pensión',
      path: ['tipoPension'],
    })
  }
})
