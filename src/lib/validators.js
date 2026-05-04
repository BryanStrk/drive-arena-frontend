import { z } from 'zod'

/**
 * Schema de validación para el formulario de Login.
 *
 * Las reglas reflejan las del backend Drive Arena (LoginRequest record):
 *   @NotBlank en username y password
 *
 * El frontend valida en cliente para UX (feedback instantáneo),
 * pero el backend valida también — nunca se confía solo en frontend.
 *
 * Backend endpoint: POST /api/auth/login
 * Espera: { username: string, password: string }
 *
 * Los limites máximos son defensivos (UX): si un usuario pega texto
 * accidentalmente, evitamos enviar payloads enormes al backend.
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'El operador es obligatorio')
    .max(100, 'Máximo 100 caracteres')
    .trim(),

  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .max(255, 'Máximo 255 caracteres'),
})

/**
 * Type helper inferido del schema.
 *
 * @typedef {z.infer<typeof loginSchema>} LoginFormData
 */