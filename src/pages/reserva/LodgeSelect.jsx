/**
 * PASO 2 — Selección de Lodge.
 * Listado de lodges + fechas + régimen de pensión.
 * Implementación funcional en BLOQUE B.
 */
function LodgeSelect() {
  return (
    <section aria-label="Paso 2: Selección de lodge">
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
        ▌ Paso 2 de 4
      </p>
      <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mt-2">
        Elige tu Lodge
      </h1>
      <p className="text-text-muted mt-4 max-w-2xl">
        Selecciona alojamiento, fechas de estancia y régimen de pensión.
      </p>

      <div className="mt-12 p-8 border border-dashed border-border-strong rounded-2xl text-center">
        <p className="font-mono text-xs tracking-wider uppercase text-text-muted">
          [Placeholder Bloque A1]
        </p>
        <p className="text-text mt-2">
          Aquí irán las cards de lodges + date range picker + selector de
          régimen.
        </p>
      </div>
    </section>
  );
}

export default LodgeSelect;
