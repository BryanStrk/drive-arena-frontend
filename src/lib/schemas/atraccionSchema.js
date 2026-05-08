import { z } from 'zod'

/**
 * Zod schema para validar el formulario de Atracción (alta y edición).
 *
 * Mapea 1:1 con el AtraccionRequestDto del backend:
 *   - nombre (NotBlank, max 100)
 *   - descripcion (max 500)
 *   - tamano (enum NotNull: GRANDE/MEDIANA/PEQUENA)
 *   - frecuenciaRevisionDias (NotNull, min 1)
 *   - imagenUrl (max 255)
 *
 * Decisiones de diseño:
 * - Mensajes en español, formateados para mostrar directamente al usuario.
 * - `z.coerce.number()` convierte el string del input HTML a number.
 * - `z.enum` valida que el tamaño sea uno de los 3 permitidos.
 */
export const TAMANOS = ['GRANDE', 'MEDIANA', 'PEQUENA']

export const atraccionSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres'),

  descripcion: z
    .string()
    .trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede superar los 500 caracteres'),

  tamano: z.enum(TAMANOS, {
    errorMap: () => ({ message: 'Selecciona un tamaño válido' }),
  }),

  frecuenciaRevisionDias: z.coerce
    .number({
      invalid_type_error: 'La frecuencia debe ser un número',
    })
    .int('La frecuencia debe ser un número entero')
    .min(1, 'La frecuencia debe ser al menos 1 día')
    .max(365, 'La frecuencia no puede superar 365 días'),

  imagenUrl: z
    .string()
    .trim()
    .url('Debe ser una URL válida (http:// o https://)')
    .max(255, 'La URL no puede superar los 255 caracteres'),
})

/**
 * Valores iniciales para el form de creación.
 * Tamaño por defecto: MEDIANA (mayoría de circuitos).
 * Frecuencia por defecto: 30 días (mantenimiento mensual estándar).
 */
export const atraccionFormDefaults = {
  nombre: '',
  descripcion: '',
  tamano: 'MEDIANA',
  frecuenciaRevisionDias: 30,
  imagenUrl: '',
}
