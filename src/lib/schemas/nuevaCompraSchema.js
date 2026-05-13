import { z } from 'zod'

export const nuevaCompraSchema = z.object({
  clienteId: z
    .number({ required_error: 'Selecciona un cliente' })
    .int()
    .positive('Selecciona un cliente'),

  hotelId: z
    .coerce.number({ required_error: 'Selecciona un lodge' })
    .int()
    .positive('Selecciona un lodge'),

  tarifaId: z
    .coerce.number({ required_error: 'Selecciona una tarifa' })
    .int()
    .positive('Selecciona una tarifa'),

  tipoPension: z.enum(['SIN', 'MEDIA', 'COMPLETA'], {
    required_error: 'Selecciona el tipo de pensión',
  }),

  fechaEntrada: z.string().min(1, 'Selecciona la fecha de entrada'),
  fechaSalida: z.string().min(1, 'Selecciona la fecha de salida'),

  numEntradas: z
    .coerce.number({ required_error: 'Indica el número de entradas' })
    .int()
    .min(1, 'Mínimo 1 entrada')
    .max(20, 'Máximo 20 entradas'),
})
