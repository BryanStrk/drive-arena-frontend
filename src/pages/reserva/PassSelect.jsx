/**
 * PASO 1 — Selección de Pase.
 * Listado de atracciones + tarifas disponibles.
 * Implementación funcional en BLOQUE A2.
 */
function PassSelect() {
  return (
    <section aria-label="Paso 1: Selección de pase">
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
        ▌ Paso 1 de 4
      </p>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mt-2">
        Selecciona tu Pase
      </h1>
      <p className="text-text-muted mt-4 max-w-2xl">
        Elige la atracción y la tarifa que mejor se ajuste a tu nivel de
        adrenalina.
      </p>

      <div className="mt-12 p-8 border border-dashed border-border-strong rounded-2xl text-center">
        <p className="font-mono text-xs tracking-wider uppercase text-text-muted">
          [Placeholder Bloque A1]
        </p>
        <p className="text-text mt-2">
          Aquí irán las cards de atracciones con sus tarifas seleccionables.
        </p>
      </div>
    </section>
  );
}

export default PassSelect;
