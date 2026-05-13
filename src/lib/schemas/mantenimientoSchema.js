import { z } from 'zod'

/**
 * Zod schema para el formulario de Mantenimiento.
 *
 * Mapea con MantenimientoRequestDto del backend (modelo POOL):
 *   - atraccionId  (NotNull)
 *   - fechaProgramada (NotNull, FutureOrPresent, formato "YYYY-MM-DD")
 *   - descripcion  (opcional, max 500 chars)
 *
 * Nota: tecnicoId y estado han sido eliminados del DTO.
 * El estado se gestiona exclusivamente via PATCH /{id}/estado.
 */

export const ESTADOS = ['PENDIENTE', 'EN_CURSO', 'COMPLETADO', 'CANCELADO']

export const mantenimientoSchema = z.object({
  atraccionId: z.coerce
    .number({ invalid_type_error: 'Selecciona un circuito' })
    .int()
    .positive('Selecciona un circuito'),

  fechaProgramada: z
    .string()
    .min(1, 'La fecha programada es obligatoria')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido'),

  descripcion: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

export const mantenimientoFormDefaults = {
  atraccionId:     '',
  fechaProgramada: '',
  descripcion:     '',
}
