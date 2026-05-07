import { useReserva, RESERVA_ACTIONS } from "@/context/ReservaContext";
import { ATRACCIONES_PUBLIC } from "@/data/reservaMocks";

/**
 * PASO 1 — Selección de Pase.
 *
 * Flujo: el usuario selecciona una atracción → aparecen sus tarifas → elige una.
 * El state se actualiza en cada selección (sin botón "Confirmar paso"), así
 * el WizardNav del padre habilita "Siguiente" automáticamente cuando ambas
 * selecciones están hechas.
 *
 * No tiene state local: lee y escribe directamente en el ReservaContext.
 * Esto garantiza que si el usuario regresa a este paso, ve sus selecciones
 * previas reflejadas en la UI.
 */
function PassSelect() {
  const { state, dispatch } = useReserva();

  const selectedAtraccion = state.pase?.atraccion ?? null;
  const selectedTarifa = state.pase?.tarifa ?? null;

  const handleSelectAtraccion = (atraccion) => {
    // Cambiar de atracción resetea la tarifa
    dispatch({
      type: RESERVA_ACTIONS.SET_PASE,
      payload: { atraccion, tarifa: null },
    });
  };

  const handleSelectTarifa = (tarifa) => {
    if (!selectedAtraccion) return;
    dispatch({
      type: RESERVA_ACTIONS.SET_PASE,
      payload: { atraccion: selectedAtraccion, tarifa },
    });
  };

  return (
    <section aria-label="Paso 1: Selección de pase">
      <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">
        Selecciona tu Pase
      </h1>
      <p className="text-text-muted mt-4 max-w-2xl">
        Elige la atracción y la tarifa que mejor se ajuste a tu nivel de
        adrenalina.
      </p>

      {/* === Selección de atracción === */}
      <div className="mt-12">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
          ▌ Atracción
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {ATRACCIONES_PUBLIC.map((atraccion) => {
            const isSelected = selectedAtraccion?.id === atraccion.id;
            return (
              <button
                key={atraccion.id}
                type="button"
                onClick={() => handleSelectAtraccion(atraccion)}
                aria-pressed={isSelected}
                className={`
                  text-left p-4 rounded-2xl border-2 transition-all
                  ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                      : "border-border-strong hover:border-primary/50"
                  }
                `}
              >
                <div className="flex gap-4">
                  <img
                    src={atraccion.image}
                    alt={atraccion.nombre}
                    className="w-20 h-20 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg tracking-tight uppercase">
                      {atraccion.nombre}
                    </h3>
                    <p className="text-sm text-text-muted mt-1 line-clamp-2">
                      {atraccion.descripcion}
                    </p>
                    <p className="font-mono text-[10px] tracking-wider uppercase text-primary mt-2">
                      {atraccion.duracionMinutos}min ·{" "}
                      {atraccion.tarifas.length} tarifas
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* === Selección de tarifa (solo si hay atracción) === */}
      {selectedAtraccion && (
        <div className="mt-12">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
            ▌ Tarifa para {selectedAtraccion.nombre}
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedAtraccion.tarifas.map((tarifa) => {
              const isSelected = selectedTarifa?.id === tarifa.id;
              return (
                <button
                  key={tarifa.id}
                  type="button"
                  onClick={() => handleSelectTarifa(tarifa)}
                  aria-pressed={isSelected}
                  className={`
                    text-left p-4 rounded-2xl border-2 transition-all
                    ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                        : "border-border-strong hover:border-primary/50"
                    }
                  `}
                >
                  <p className="font-mono text-[10px] tracking-wider uppercase text-text-muted">
                    {tarifa.sesiones}{" "}
                    {tarifa.sesiones > 1 ? "sesiones" : "sesión"}
                  </p>
                  <h4 className="font-display font-bold text-xl tracking-tight uppercase mt-2">
                    {tarifa.nombre}
                  </h4>
                  <p className="font-display text-3xl font-extrabold text-primary mt-3">
                    {tarifa.precio}€
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default PassSelect;
