import { z } from 'zod'

/**
 * Zod schema para validar el formulario de Cliente (alta y edición).
 *
 * Mapea 1:1 con el ClienteRequestDto del backend:
 *   - nombre (NotBlank, max 50)
 *   - apellidos (NotBlank, max 100)
 *   - email (NotBlank, valid email, max 100, UNIQUE en BBDD)
 *   - telefono (max 20, opcional)
 *   - dni (NotBlank, regex 8 dígitos + letra, max 15, UNIQUE en BBDD)
 *
 * Notas:
 *   - fechaRegistro y activo NO se validan: el backend los gestiona automáticamente
 *   - email duplicado o dni duplicado → 409 del backend → toast en el hook
 */

// Regex DNI español: 8 dígitos + 1 letra (mayúscula o minúscula)
const DNI_REGEX = /^[0-9]{8}[A-Za-z]$/

export const clienteSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres'),

  apellidos: z
    .string()
    .trim()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(100, 'Los apellidos no pueden superar los 100 caracteres'),

  email: z
    .string()
    .trim()
    .min(1, 'El email es obligatorio')
    .email('El email no tiene un formato válido')
    .max(100, 'El email no puede superar los 100 caracteres'),

  telefono: z
    .string()
    .trim()
    .max(20, 'El teléfono no puede superar 20 caracteres')
    .optional()
    .or(z.literal('')),

  dni: z
    .string()
    .trim()
    .min(1, 'El DNI es obligatorio')
    .regex(DNI_REGEX, 'El DNI debe tener 8 dígitos seguidos de una letra (ej: 12345678A)')
    .max(15, 'El DNI no puede superar 15 caracteres'),
})

/**
 * Valores iniciales para el form de creación.
 */
export const clienteFormDefaults = {
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  dni: '',
}
