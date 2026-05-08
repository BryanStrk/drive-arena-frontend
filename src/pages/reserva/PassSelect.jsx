import { useReserva, RESERVA_ACTIONS } from "@/context/ReservaContext";
import { PERSONAS_MIN, PERSONAS_MAX } from "@/data/reservaMocks";
import { OFFER_PACKS } from "@/data/homeMocks";
import { useReservaCatalogo } from "@/hooks/useReservaCatalogo";
import { ASSETS_EXPERIENCES } from "@/data/cloudinaryAssets";

/**
 * Selector de cantidad de personas (1-10).
 */
function PersonasSelector({ value, onChange }) {
  const canDecrement = value > PERSONAS_MIN;
  const canIncrement = value < PERSONAS_MAX;

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={!canDecrement}
        aria-label="Quitar persona"
        className={`
          w-12 h-12 rounded-full border-2 font-display font-bold text-2xl
          transition-all flex items-center justify-center
          ${
            canDecrement
              ? "border-border-strong text-text hover:border-primary hover:text-primary"
              : "border-border-strong text-text-muted opacity-40 cursor-not-allowed"
          }
        `}
      >
        −
      </button>

      <div className="flex flex-col items-center min-w-[80px]">
        <span className="font-display font-extrabold text-4xl text-primary">
          {value}
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted mt-1">
          {value === 1 ? "persona" : "personas"}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={!canIncrement}
        aria-label="Añadir persona"
        className={`
          w-12 h-12 rounded-full border-2 font-display font-bold text-2xl
          transition-all flex items-center justify-center
          ${
            canIncrement
              ? "border-border-strong text-text hover:border-primary hover:text-primary"
              : "border-border-strong text-text-muted opacity-40 cursor-not-allowed"
          }
        `}
      >
        +
      </button>
    </div>
  );
}

/**
 * Resuelve la imagen de la atracción.
 * Prioriza imagenUrl del backend, con fallback a assets locales por id.
 * Esto permite que el wizard funcione aunque el backend aún no
 * devuelva URLs de Cloudinary, y migra de forma transparente cuando lo haga.
 */
function getAtraccionImage(atraccion) {
  if (atraccion.imagenUrl) return atraccion.imagenUrl;
  const fallbackById = {
    1: ASSETS_EXPERIENCES.phantomGt,
    2: ASSETS_EXPERIENCES.apexSimulator,
    3: ASSETS_EXPERIENCES.driftKing,
    4: ASSETS_EXPERIENCES.neonKarting,
  };
    return (
    fallbackById[atraccion.id] ??
    atraccion.imagenUrl ??
    atraccion.imagen_url ??
    ""
  );
}

/**
 * Etiqueta legible para mostrar el tipo de tarifa al usuario.
 */
function tarifaLabel(tipo) {
  const map = {
    NINO: "Niño",
    ADULTO: "Adulto",
    PENSIONISTA: "Pensionista",
  };
  return map[tipo] ?? tipo;
}

/**
 * PASO 1 — Selección de Pack o Pase a medida + número de personas.
 *
 * IMPORTANTE: el modelo de tarifas es ahora GLOBAL (NINO/ADULTO/PENSIONISTA)
 * en lugar de específico por atracción. Las tarifas se cargan del backend
 * y se aplican a cualquier atracción seleccionada.
 */
function PassSelect() {
  const { state, dispatch } = useReserva();
  const { atracciones, tarifas, hoteles, isLoading, error } =
    useReservaCatalogo();

  const selectedPackId = state.packId ?? null;
  const selectedAtraccion = state.pase?.atraccion ?? null;
  const selectedTarifa = state.pase?.tarifa ?? null;
  const isPackMode = state.esPack;
  const personas = state.personas ?? 1;

  // === Loading & error states ===
  if (isLoading) {
    return (
      <section className="py-20 text-center" aria-busy="true">
        <p className="font-mono text-sm tracking-[0.2em] uppercase text-text-muted">
          Cargando catálogo...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 text-center" role="alert">
        <p className="font-mono text-sm tracking-wider uppercase text-red-500">
          {error}
        </p>
      </section>
    );
  }

  // === Handlers ===
  const handleSelectPack = (pack) => {
    const atraccion = atracciones.find((a) => a.id === pack.atraccionId);
    const tarifa = tarifas.find((t) => t.id === pack.tarifaId);
    const lodge = hoteles.find((h) => h.id === pack.lodgeId);

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
          fechaEntrada: null,
          fechaSalida: null,
          regimen: pack.regimen,
        },
      },
    });
  };

  const handleSelectAtraccion = (atraccion) => {
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

  const handlePersonasChange = (newValue) => {
    dispatch({
      type: RESERVA_ACTIONS.SET_PERSONAS,
      payload: newValue,
    });
  };

  const showPersonas =
    isPackMode || (selectedAtraccion && selectedTarifa);

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
                    <span className="font-mono text-[10px] text-text-muted">
                      / persona
                    </span>
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
          {atracciones.map((atraccion) => {
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
                    src={getAtraccionImage(atraccion)}
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
                      {atraccion.tamano}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* === TARIFAS GLOBALES === */}
      {!isPackMode && selectedAtraccion && (
        <div className="mt-12">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
            ▌ Tipo de Pase
          </p>
          <p className="text-sm text-text-muted mt-2">
            Elige tu tarifa para acceder a {selectedAtraccion.nombre}.
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {tarifas.map((tarifa) => {
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
                    {tarifa.tipo}
                  </p>
                  <h4 className="font-display font-bold text-xl tracking-tight uppercase mt-2">
                    {tarifaLabel(tarifa.tipo)}
                  </h4>
                  <p className="text-xs text-text-muted mt-1 line-clamp-2 min-h-[32px]">
                    {tarifa.descripcion}
                  </p>
                  <p className="font-display text-3xl font-extrabold text-primary mt-3">
                    {tarifa.precio}€
                    <span className="font-mono text-[10px] text-text-muted ml-1">
                      / persona
                    </span>
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* === SELECTOR DE PERSONAS === */}
      {showPersonas && (
        <div className="mt-12 p-6 rounded-2xl border-2 border-border-strong bg-surface-1/50">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
            ▌ ¿Cuántos sois?
          </p>
          <p className="text-sm text-text-muted mt-2">
            Incluyéndote a ti. Máximo {PERSONAS_MAX} personas por reserva.
          </p>
          <div className="mt-6 flex justify-center">
            <PersonasSelector
              value={personas}
              onChange={handlePersonasChange}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default PassSelect;
