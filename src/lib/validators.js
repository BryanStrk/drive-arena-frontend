import { z } from 'zod'

/**
 * Schema de validación para el formulario de Login.
 * Las reglas reflejan los requisitos del backend Drive Arena.
 *
 * Backend endpoint: POST /api/auth/login
 * Espera: { username: string, password: string }
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'El operador es obligatorio')
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .trim(),

  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'Mínimo 6 caracteres')
    .max(100, 'Máximo 100 caracteres'),
})

/**
 * Type helper inferido del schema.
 * Útil para JSDoc en componentes que consumen los datos validados.
 *
 * @typedef {z.infer<typeof loginSchema>} LoginFormData
 */