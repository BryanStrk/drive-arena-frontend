/**
 * PASO 4 — Resumen y Pago.
 * Resumen de la reserva, total calculado, selección de método de pago,
 * y botón de confirmación que dispara el submit a `/compras`.
 * Implementación funcional en BLOQUE C.
 */
function Summary() {
  return (
    <section aria-label="Paso 4: Resumen y pago">
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
        ▌ Paso 4 de 4
      </p>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mt-2">
        Resumen y Pago
      </h1>
      <p className="text-text-muted mt-4 max-w-2xl">
        Revisa los detalles de tu reserva antes de confirmar.
      </p>

      <div className="mt-12 p-8 border border-dashed border-border-strong rounded-2xl text-center">
        <p className="font-mono text-xs tracking-wider uppercase text-text-muted">
          [Placeholder Bloque A1]
        </p>
        <p className="text-text mt-2">
          Resumen del pase + lodge + cliente · método de pago · botón Confirmar.
        </p>
      </div>
    </section>
  );
}

export default Summary;
