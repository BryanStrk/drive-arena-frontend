/**
 * PASO 3 — Datos del Cliente.
 * Formulario con React Hook Form + Zod.
 * Implementación funcional en BLOQUE B.
 */
function CustomerData() {
  return (
    <section aria-label="Paso 3: Datos del cliente">
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
        ▌ Paso 3 de 4
      </p>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mt-2">
        Tus Datos
      </h1>
      <p className="text-text-muted mt-4 max-w-2xl">
        Necesitamos algunos datos para confirmar la reserva y prepararte la
        bienvenida.
      </p>

      <div className="mt-12 p-8 border border-dashed border-border-strong rounded-2xl text-center">
        <p className="font-mono text-xs tracking-wider uppercase text-text-muted">
          [Placeholder Bloque A1]
        </p>
        <p className="text-text mt-2">
          Formulario: nombre, apellidos, email, teléfono, DNI/NIE.
        </p>
      </div>
    </section>
  );
}

export default CustomerData;
