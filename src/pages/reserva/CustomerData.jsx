import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useReserva, RESERVA_ACTIONS } from "@/context/ReservaContext";

// === Validación de letra DNI/NIE española ===
const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

function validateDniLetter(dni) {
  if (!dni) return false;
  const upper = dni.toUpperCase();
  // Sustituir prefijo NIE por su dígito equivalente: X→0, Y→1, Z→2
  const value = upper.replace(/^([XYZ])/, (_, l) =>
    l === "X" ? "0" : l === "Y" ? "1" : "2",
  );
  const numericPart = value.slice(0, -1);
  const letter = value.slice(-1);
  const num = parseInt(numericPart, 10);
  if (Number.isNaN(num)) return false;
  return DNI_LETTERS[num % 23] === letter;
}

// === Schema Zod ===
const clienteSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres"),
  apellidos: z
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres"),
  email: z.string().trim().email("Email no válido").max(120),
  telefono: z
    .string()
    .trim()
    .regex(
      /^[679]\d{8}$/,
      "Móvil español no válido (9 dígitos, empieza por 6, 7 o 9)",
    ),
  dni: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[XYZ]?\d{7,8}[A-Z]$/, "Formato DNI/NIE no válido")
    .refine(validateDniLetter, "Letra de DNI/NIE incorrecta"),
});

/**
 * Sub-componente de campo de formulario con label, input y mensaje de error.
 * Estilizado consistente con el design system de Drive Arena.
 */
function FormField({
  id,
  label,
  type = "text",
  placeholder,
  register,
  error,
  fullWidth = false,
}) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label
        htmlFor={id}
        className="block font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted"
      >
        {label} *
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        {...register}
        className={`
          mt-2 w-full px-4 py-3 rounded-lg bg-surface-1 text-text
          border-2 transition-colors
          ${
            error
              ? "border-primary"
              : "border-border-strong focus:border-primary"
          }
          focus:outline-none
        `}
      />
      {error && (
        <p className="font-mono text-xs text-primary mt-1" role="alert">
          ▶ {error}
        </p>
      )}
    </div>
  );
}

/**
 * PASO 3 — Datos del Cliente.
 * Formulario validado con React Hook Form + Zod.
 *
 * Estrategia de sincronización:
 * - El form mantiene su propio state interno (RHF)
 * - Cada cambio se valida con `mode: 'onBlur'`
 * - Cuando el form pasa a válido, los valores se dispatchan al ReservaContext
 * - Cuando deja de ser válido, el state de cliente vuelve a null
 *
 * Esto permite que el WizardNav del padre habilite "Siguiente" automáticamente
 * cuando el formulario esté completo y válido.
 */
function CustomerData() {
  const { state, dispatch } = useReserva();

  const {
    register,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: state.cliente ?? {
      nombre: "",
      apellidos: "",
      email: "",
      telefono: "",
      dni: "",
    },
    resolver: zodResolver(clienteSchema),
    mode: "onBlur",
  });

  const watchedValues = watch();

  // Sincronizar state del wizard con el form cuando es válido
  // JSON.stringify evita re-disparos por cambio de referencia del objeto
  useEffect(() => {
    dispatch({
      type: RESERVA_ACTIONS.SET_CLIENTE,
      payload: isValid ? watchedValues : null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, JSON.stringify(watchedValues)]);

  return (
    <section aria-label="Paso 3: Datos del cliente">
      <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">
        Tus Datos
      </h1>
      <p className="text-text-muted mt-4 max-w-2xl">
        Necesitamos algunos datos para confirmar la reserva y prepararte la
        bienvenida.
      </p>

      <form
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl"
        onSubmit={(e) => e.preventDefault()}
      >
        <FormField
          id="nombre"
          label="Nombre"
          placeholder="Bryan"
          register={register("nombre")}
          error={errors.nombre?.message}
        />
        <FormField
          id="apellidos"
          label="Apellidos"
          placeholder="Pacheco"
          register={register("apellidos")}
          error={errors.apellidos?.message}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="bryan@example.com"
          register={register("email")}
          error={errors.email?.message}
          fullWidth
        />
        <FormField
          id="telefono"
          label="Teléfono móvil"
          type="tel"
          placeholder="612345678"
          register={register("telefono")}
          error={errors.telefono?.message}
        />
        <FormField
          id="dni"
          label="DNI / NIE"
          placeholder="12345678A"
          register={register("dni")}
          error={errors.dni?.message}
        />
      </form>

      <p className="mt-6 font-mono text-[10px] tracking-wider text-text-muted">
        ▶ Tus datos se procesan según la LOPD y solo se usan para gestionar tu
        reserva.
      </p>
    </section>
  );
}

export default CustomerData;
