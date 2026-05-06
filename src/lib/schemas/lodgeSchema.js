import { z } from 'zod'

/**
 * Zod schema para validar el formulario de Lodge (alta y edición).
 *
 * Mapea 1:1 con el HotelRequestDto del backend:
 *   - nombre, descripcion, direccion, imagenUrl: String
 *   - capacidadTotal: Integer
 *   - precioMediaPension, precioPensionCompleta: BigDecimal
 *
 * Decisiones de diseño:
 * - Mensajes en español, ya formateados para mostrar directamente al usuario.
 * - `z.coerce.number()` convierte el string del input HTML a number antes de validar.
 * - Cross-field validation: `precioPensionCompleta > precioMediaPension` (regla de negocio).
 * - Mismos límites que aplicaría una columna `DECIMAL(6,2)` en MySQL (max 9999.99).
 *
 * Uso típico:
 *   import { useForm } from 'react-hook-form'
 *   import { zodResolver } from '@hookform/resolvers/zod'
 *   import { lodgeSchema, lodgeFormDefaults } from '@/lib/schemas/lodgeSchema'
 *
 *   const { register, handleSubmit, formState } = useForm({
 *     resolver: zodResolver(lodgeSchema),
 *     defaultValues: lodgeFormDefaults,
 *   })
 */
export const lodgeSchema = z
  .object({
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

    direccion: z
      .string()
      .trim()
      .min(5, 'La dirección debe tener al menos 5 caracteres')
      .max(200, 'La dirección no puede superar los 200 caracteres'),

    capacidadTotal: z.coerce
      .number({
        invalid_type_error: 'La capacidad debe ser un número',
      })
      .int('La capacidad debe ser un número entero')
      .min(1, 'La capacidad debe ser al menos 1')
      .max(9999, 'La capacidad no puede superar 9999'),

    precioMediaPension: z.coerce
      .number({
        invalid_type_error: 'El precio debe ser un número',
      })
      .positive('El precio debe ser mayor que 0')
      .max(9999.99, 'El precio no puede superar 9999.99'),

    precioPensionCompleta: z.coerce
      .number({
        invalid_type_error: 'El precio debe ser un número',
      })
      .positive('El precio debe ser mayor que 0')
      .max(9999.99, 'El precio no puede superar 9999.99'),

    imagenUrl: z
      .string()
      .trim()
      .url('Debe ser una URL válida (http:// o https://)')
      .max(500, 'La URL no puede superar los 500 caracteres'),
  })
  .refine(
    (data) => data.precioPensionCompleta > data.precioMediaPension,
    {
      message: 'La pensión completa debe ser más cara que la media pensión',
      path: ['precioPensionCompleta'],
    }
  )

/**
 * Valores iniciales para el form de creación.
 * Strings vacíos para los campos numéricos porque los inputs HTML
 * los devuelven así cuando están vacíos. Zod los coerciona al validar.
 */
export const lodgeFormDefaults = {
  nombre: '',
  descripcion: '',
  direccion: '',
  capacidadTotal: '',
  precioMediaPension: '',
  precioPensionCompleta: '',
  imagenUrl: '',
}
