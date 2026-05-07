import { useReserva, RESERVA_ACTIONS } from "@/context/ReservaContext";
import { ATRACCIONES_PUBLIC, LODGES_PUBLIC } from "@/data/reservaMocks";
import { OFFER_PACKS } from "@/data/homeMocks";

/**
 * PASO 1 — Selección de Pack o Pase a medida.
 *
 * Dos secciones:
 * 1. Packs Premium con descuento (atajo): seleccionar un pack rellena el
 *    state con pase + lodge incluidos y activa el flag esPack para que
 *    el wizard salte el paso 2 (Lodge) automáticamente.
 * 2. Reserva a medida: el flujo clásico de seleccionar atracción + tarifa.
 *
 * Cuando hay un pack seleccionado, las cards de atracciones se muestran
 * con opacidad reducida (visualmente "deshabilitadas") aunque siguen
 * siendo clicables — al click cambian al modo a medida automáticamente.
 */
function PassSelect() {
  const { state, dispatch } = useReserva();

  const selectedPackId = state.packId ?? null;
  const selectedAtraccion = state.pase?.atraccion ?? null;
  const selectedTarifa = state.pase?.tarifa ?? null;
  const isPackMode = state.esPack;

  const handleSelectPack = (pack) => {
    const atraccion = ATRACCIONES_PUBLIC.find(
      (a) => a.id === pack.atraccionId,
    );
    const tarifa = atraccion?.tarifas.find((t) => t.id === pack.tarifaId);
    const lodge = LODGES_PUBLIC.find((l) => l.id === pack.lodgeId);

    if (!atraccion || !tarifa || !lodge) {
      console.error("Pack mal configurado, IDs no encontrados:", pack);
      return;
    }

    dispatch({
      type: RESERVA_ACTIONS.SET_PACK,
      payload: {
        packId: pack.id,
        pase: { atraccion, tarifa },
        lodge: {
          lodge,
          fechaEntrada: null, // Se completará en paso de pago / TODO backend
          fechaSalida: null,
          regimen: pack.regimen,
        },
      },
    });
  };

  const handleSelectAtraccion = (atraccion) => {
    // Selección manual desactiva el modo pack automáticamente
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
    <section aria-label="Paso 1: Selección de reserva">
      <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">
        Selecciona tu Reserva
      </h1>
      <p className="text-text-muted mt-4 max-w-2xl">
        Elige un pack premium con descuento o configura tu reserva a medida.
      </p>

      {/* === PACKS PREMIUM === */}
      <div className="mt-12">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
          ▌ Packs Premium con Descuento
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {OFFER_PACKS.map((pack) => {
            const isSelected = selectedPackId === pack.id;
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => handleSelectPack(pack)}
                aria-pressed={isSelected}
                className={`
                  text-left rounded-2xl border-2 transition-all overflow-hidden
                  ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                      : "border-border-strong hover:border-primary/50"
                  }
                `}
              >
                <div className="relative h-32">
                  <img
                    src={pack.image}
                    alt={pack.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-md font-mono font-bold text-xs">
                    -{pack.discountPercentage}%
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-lg tracking-tight uppercase">
                    {pack.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-1 line-clamp-2">
                    {pack.description}
                  </p>
                  <div className="flex items-baseline gap-2 mt-3">
                    <p className="font-mono text-sm text-text-muted line-through">
                      {pack.originalPrice}€
                    </p>
                    <p className="font-display text-2xl font-extrabold text-primary">
                      {pack.currentPrice}€
                    </p>
                  </div>
                  <p className="font-mono text-[10px] tracking-wider uppercase text-text-muted mt-2">
                    {pack.availability}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* === DIVIDER === */}
      <div className="my-12 flex items-center gap-4">
        <div className="flex-1 h-[1px] bg-border-strong" />
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
          O reserva a medida
        </p>
        <div className="flex-1 h-[1px] bg-border-strong" />
      </div>

      {/* === ATRACCIONES === */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
          ▌ Atracción
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {ATRACCIONES_PUBLIC.map((atraccion) => {
            const isSelected =
              !isPackMode && selectedAtraccion?.id === atraccion.id;
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
                      : isPackMode
                        ? "border-border-strong opacity-50 hover:opacity-100"
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

      {/* === TARIFAS (solo si hay atracción seleccionada en modo a medida) === */}
      {!isPackMode && selectedAtraccion && (
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
