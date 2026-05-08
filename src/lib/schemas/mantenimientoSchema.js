import { z } from 'zod'

/**
 * Zod schema para validar el formulario de Mantenimiento (alta y edición).
 *
 * Mapea con MantenimientoRequestDto del backend:
 *   - atraccionId (NotNull)
 *   - tecnicoId (NotNull)
 *   - fechaProgramada (NotNull, LocalDate)
 *   - estado (nullable, solo se respeta en PUT)
 *
 * Notas:
 *   - En modo CREATE, el estado se ignora y se fuerza a PENDIENTE en backend.
 *     El frontend lo oculta del form (solo aparece en EDIT).
 *   - El backend valida que tecnicoId pertenezca a un empleado con oficio TECNICO.
 *     Si no, devuelve 400 BusinessException → toast en el hook.
 */
export const ESTADOS = ['PENDIENTE', 'EN_CURSO', 'COMPLETADO', 'CANCELADO']

export const mantenimientoSchema = z.object({
  atraccionId: z.coerce
    .number({
      invalid_type_error: 'Selecciona un circuito',
    })
    .int()
    .positive('Selecciona un circuito'),

  tecnicoId: z.coerce
    .number({
      invalid_type_error: 'Selecciona un técnico',
    })
    .int()
    .positive('Selecciona un técnico'),

  fechaProgramada: z
    .string()
    .min(1, 'La fecha programada es obligatoria')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido'),

  estado: z.enum(ESTADOS, {
    errorMap: () => ({ message: 'Estado inválido' }),
  }),
})

export const mantenimientoFormDefaults = {
  atraccionId: '',
  tecnicoId: '',
  fechaProgramada: '',
  estado: 'PENDIENTE',
}
