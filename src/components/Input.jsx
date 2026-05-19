import { forwardRef, useId } from 'react'
import { cn } from '@/lib/cn'

/**
 * Input reutilizable con soporte para label, eyebrow, estados de error
 * y helper text. Compatible con react-hook-form vía forwardRef.
 *
 * @param {Object} props
 * @param {string} [props.label] - Etiqueta principal del input (visible arriba)
 * @param {string} [props.eyebrow] - Sub-label en mono uppercase tipo "OPERADOR"
 * @param {string} [props.error] - Mensaje de error a mostrar debajo del input
 * @param {string} [props.helperText] - Texto de ayuda (no error) debajo del input
 * @param {boolean} [props.required=false] - Marca el campo como obligatorio (asterisco)
 * @param {string} [props.type='text'] - Tipo HTML del input (text, email, password...)
 * @param {string} [props.className] - Clases extra para el container
 * @param {string} [props.inputClassName] - Clases extra solo para el input
 */
const Input = forwardRef(function Input(
  {
    label,
    eyebrow,
    error,
    helperText,
    required = false,
    type = 'text',
    className,
    inputClassName,
    id: idProp,
    ...rest
  },
  ref
) {
  // useId genera un ID único estable para enlazar label + input
  const generatedId = useId()
  const id = idProp || generatedId

  const hasError = Boolean(error)

  return (
    <div className={cn('w-full', className)}>
      {/* Eyebrow sub-label estilo mockup */}
      {eyebrow && (
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary mb-2">
          ▌ {eyebrow}
        </p>
      )}

      {/* Label principal */}
      {label && (
        <label
          htmlFor={id}
          className="block font-sans text-sm font-medium text-text mb-2"
        >
          {label}
          {required && <span className="text-primary ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      {/* Input field */}
      <input
        ref={ref}
        id={id}
        type={type}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        className={cn(
          'w-full',
          'px-4 py-3',
          'bg-surface-2 text-text placeholder:text-text-dim',
          'font-sans text-sm',
          'border rounded-inner',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg',
          // Estados normales y de error
          hasError
            ? 'border-danger focus:border-danger focus:ring-danger/40'
            : 'border-border-strong focus:border-primary focus:ring-primary/40',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          inputClassName
        )}
        {...rest}
      />

      {/* Helper text (sin error) */}
      {!hasError && helperText && (
        <p
          id={`${id}-helper`}
          className="mt-2 font-mono text-[10px] tracking-wider text-text-muted"
        >
          {helperText}
        </p>
      )}

      {/* Error message */}
      {hasError && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 font-mono text-[10px] tracking-wider text-danger flex items-center gap-1.5"
        >
          <span aria-hidden="true">▶</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  )
})

export default Input
