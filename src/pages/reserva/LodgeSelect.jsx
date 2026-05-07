import { useReserva, RESERVA_ACTIONS } from "@/context/ReservaContext";
import { LODGES_PUBLIC } from "@/data/reservaMocks";

const REGIMENES = [
  { id: "sin", label: "Solo alojamiento", description: "Sin servicio de comidas" },
  { id: "media", label: "Media pensión", description: "Desayuno + cena incluidos" },
  { id: "completa", label: "Pensión completa", description: "Todas las comidas" },
];

/**
 * Devuelve la fecha de hoy en formato YYYY-MM-DD para usar como `min`
 * en los inputs type="date".
 */
function getToday() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Calcula las noches entre dos fechas YYYY-MM-DD.
 */
function calcularNoches(entrada, salida) {
  if (!entrada || !salida) return 0;
  const ms = new Date(salida) - new Date(entrada);
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

/**
 * PASO 2 — Selección de Lodge.
 * Lee y escribe directamente en el ReservaContext (sin state local).
 * Cualquier cambio actualiza el state, que se persiste en localStorage.
 */
function LodgeSelect() {
  const { state, dispatch } = useReserva();

  const lodgeData = state.lodge ?? {};
  const selectedLodge = lodgeData.lodge ?? null;
  const fechaEntrada = lodgeData.fechaEntrada ?? "";
  const fechaSalida = lodgeData.fechaSalida ?? "";
  const regimen = lodgeData.regimen ?? null;

  const today = getToday();
  const noches = calcularNoches(fechaEntrada, fechaSalida);

  // Helper para actualizar el state preservando los demás campos
  const updateLodge = (changes) => {
    dispatch({
      type: RESERVA_ACTIONS.SET_LODGE,
      payload: {
        lodge: selectedLodge,
        fechaEntrada,
        fechaSalida,
        regimen,
        ...changes,
      },
    });
  };

  const handleSelectLodge = (lodge) => updateLodge({ lodge });

  const handleFechaEntradaChange = (e) => {
    const newEntrada = e.target.value;
    // Si la nueva entrada es posterior o igual a la salida actual, limpiar salida
    const shouldClearSalida = fechaSalida && newEntrada >= fechaSalida;
    updateLodge({
      fechaEntrada: newEntrada,
      fechaSalida: shouldClearSalida ? "" : fechaSalida,
    });
  };

  const handleFechaSalidaChange = (e) => {
    updateLodge({ fechaSalida: e.target.value });
  };

  const handleSelectRegimen = (regimenId) => updateLodge({ regimen: regimenId });

  return (
    <section aria-label="Paso 2: Selección de lodge">
      <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">
        Elige tu Lodge
      </h1>
      <p className="text-text-muted mt-4 max-w-2xl">
        Selecciona alojamiento, fechas de estancia y régimen de pensión.
      </p>

      {/* === LODGES === */}
      <div className="mt-12">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
          ▌ Alojamiento
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {LODGES_PUBLIC.map((lodge) => {
            const isSelected = selectedLodge?.id === lodge.id;
            return (
              <button
                key={lodge.id}
                type="button"
                onClick={() => handleSelectLodge(lodge)}
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
                <h3 className="font-display font-bold text-lg tracking-tight uppercase">
                  {lodge.nombre}
                </h3>
                <p className="text-sm text-text-muted mt-2 line-clamp-3">
                  {lodge.descripcion}
                </p>
                <div className="flex items-baseline justify-between mt-4">
                  <p className="font-mono text-[10px] tracking-wider uppercase text-text-muted">
                    Hasta {lodge.capacidad} pers.
                  </p>
                  <p className="font-display text-2xl font-extrabold text-primary">
                    {lodge.priceFull}€
                    <span className="font-mono text-[10px] text-text-muted ml-1">
                      / noche
                    </span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* === FECHAS === */}
      <div className="mt-12">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
          ▌ Fechas de estancia
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="fechaEntrada"
              className="block font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted"
            >
              Entrada
            </label>
            <input
              id="fechaEntrada"
              type="date"
              min={today}
              value={fechaEntrada}
              onChange={handleFechaEntradaChange}
              className="mt-2 w-full px-4 py-3 rounded-lg bg-surface-1 text-text border-2 border-border-strong focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="fechaSalida"
              className="block font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted"
            >
              Salida
            </label>
            <input
              id="fechaSalida"
              type="date"
              min={fechaEntrada || today}
              value={fechaSalida}
              onChange={handleFechaSalidaChange}
              disabled={!fechaEntrada}
              className="mt-2 w-full px-4 py-3 rounded-lg bg-surface-1 text-text border-2 border-border-strong focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
        {noches > 0 && (
          <p className="mt-3 font-mono text-xs tracking-wider text-text-muted">
            ▶ {noches} {noches === 1 ? "noche" : "noches"} de estancia
          </p>
        )}
      </div>

      {/* === RÉGIMEN === */}
      <div className="mt-12">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
          ▌ Régimen de pensión
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {REGIMENES.map((reg) => {
            const isSelected = regimen === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => handleSelectRegimen(reg.id)}
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
                <h4 className="font-display font-bold text-lg tracking-tight uppercase">
                  {reg.label}
                </h4>
                <p className="text-xs text-text-muted mt-1">
                  {reg.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LodgeSelect;
