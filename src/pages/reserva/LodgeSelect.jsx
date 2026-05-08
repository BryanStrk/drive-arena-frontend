import { useReserva, RESERVA_ACTIONS } from "@/context/ReservaContext";
import DateRangeField from "@/components/reserva/DateRangeField";
import { useReservaCatalogo } from "@/hooks/useReservaCatalogo";

const REGIMENES = [
  {
    id: "sin",
    label: "Solo alojamiento",
    description: "Sin servicio de comidas",
  },
  {
    id: "media",
    label: "Media pensión",
    description: "Desayuno + cena incluidos",
  },
  {
    id: "completa",
    label: "Pensión completa",
    description: "Todas las comidas",
  },
];

/**
 * Resuelve el precio por noche del lodge según régimen.
 * Espejo de ReservaPublicaService.calcularTotal en backend.
 */
function precioPorRegimen(lodge, regimen) {
  if (!lodge) return 0;
  switch (regimen) {
    case "sin":
      return 0;
    case "media":
      return Number(lodge.precioMediaPension ?? 0);
    case "completa":
      return Number(lodge.precioPensionCompleta ?? 0);
    default:
      return 0;
  }
}

function calcularNoches(entrada, salida) {
  if (!entrada || !salida) return 0;
  const ms = new Date(salida) - new Date(entrada);
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function LodgeSelect() {
  const { state, dispatch } = useReserva();
  const { hoteles, isLoading, error } = useReservaCatalogo();
  const isPack = state.esPack;

  const lodgeData = state.lodge ?? {};
  const selectedLodge = lodgeData.lodge ?? null;
  const fechaEntrada = lodgeData.fechaEntrada ?? "";
  const fechaSalida = lodgeData.fechaSalida ?? "";
  const regimen = lodgeData.regimen ?? null;
  const personas = state.personas ?? 1;

  const noches = calcularNoches(fechaEntrada, fechaSalida);

  // === Loading & error states ===
  if (isLoading) {
    return (
      <section className="py-20 text-center" aria-busy="true">
        <p className="font-mono text-sm tracking-[0.2em] uppercase text-text-muted">
          Cargando lodges...
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

  const lodgeOvercapacity =
    selectedLodge && personas > (selectedLodge.capacidadTotal ?? 0);

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

  // Recibe { fechaEntrada, fechaSalida } del DateRangeField (ambos strings ISO)
  const handleDateRangeChange = (dates) => updateLodge(dates);

  const handleSelectRegimen = (regimenId) =>
    updateLodge({ regimen: regimenId });

  // Régimen object para vista readonly de pack
  const regimenObj = REGIMENES.find((r) => r.id === regimen);

  return (
    <section aria-label="Paso 2: Selección de lodge">
      <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">
        {isPack ? "Confirma tus fechas" : "Elige tu Lodge"}
      </h1>
      <p className="text-text-muted mt-4 max-w-2xl">
        {isPack
          ? "El lodge y el régimen están incluidos en tu pack. Solo necesitamos saber cuándo quieres venir."
          : "Selecciona alojamiento, fechas de estancia y régimen de pensión."}
      </p>

      {/* Reminder de personas (informativo) */}
      <p className="mt-4 font-mono text-xs tracking-wider text-text-muted">
        ▶ Reserva para{" "}
        <span className="text-primary font-bold">
          {personas} {personas === 1 ? "persona" : "personas"}
        </span>
      </p>

      {/* === LODGES === */}
      <div className="mt-12">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
          ▌ {isPack ? "Tu alojamiento (incluido en pack)" : "Alojamiento"}
        </p>

        {isPack && selectedLodge ? (
          // Vista READONLY del lodge del pack
          <div className="mt-4 p-6 rounded-2xl border-2 border-primary bg-primary/5">
            <h3 className="font-display font-bold text-2xl tracking-tight uppercase">
              {selectedLodge.nombre}
            </h3>
            <p className="text-sm text-text-muted mt-2">
              {selectedLodge.descripcion}
            </p>
            <p className="font-mono text-[10px] tracking-wider uppercase text-text-muted mt-3">
              Hasta {selectedLodge.capacidadTotal} pers. ·{" "}
              {precioPorRegimen(selectedLodge, regimen)}€ / noche
            </p>
          </div>
        ) : (
          // Selector normal
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {hoteles.map((lodge) => {
              const isSelected = selectedLodge?.id === lodge.id;
              const insufficientCapacity =
                personas > (lodge.capacidadTotal ?? 0);
              const desdePrecio = Number(lodge.precioMediaPension ?? 0);

              return (
                <button
                  key={lodge.id}
                  type="button"
                  onClick={() => handleSelectLodge(lodge)}
                  aria-pressed={isSelected}
                  className={`
                    text-left p-4 rounded-2xl border-2 transition-all relative
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
                    <p
                      className={`font-mono text-[10px] tracking-wider uppercase ${
                        insufficientCapacity
                          ? "text-primary font-bold"
                          : "text-text-muted"
                      }`}
                    >
                      Hasta {lodge.capacidadTotal ?? 0} pers.
                      {insufficientCapacity && " ⚠"}
                    </p>
                    <p className="font-display text-2xl font-extrabold text-primary">
                      <span className="font-mono text-[10px] text-text-muted mr-1">
                        desde
                      </span>
                      {desdePrecio}€
                      <span className="font-mono text-[10px] text-text-muted ml-1">
                        / noche
                      </span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Aviso de capacidad insuficiente (solo en mode no-pack) */}
        {!isPack && lodgeOvercapacity && (
          <div className="mt-4 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
            <p className="font-mono text-xs tracking-wider text-primary">
              ⚠ AVISO DE CAPACIDAD
            </p>
            <p className="text-sm text-text mt-2">
              <strong>{selectedLodge.nombre}</strong> tiene capacidad para{" "}
              <strong>{selectedLodge.capacidadTotal} personas</strong>, pero tu
              reserva es para <strong>{personas}</strong>. Algunos
              acompañantes podrán necesitar alojamiento alternativo. Te
              contactaremos para confirmar opciones.
            </p>
          </div>
        )}
      </div>

      {/* === FECHAS === Calendario visual con react-day-picker */}
      <div className="mt-12">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
          ▌ Fechas de estancia
        </p>
        <div className="mt-4">
          <DateRangeField
            fechaEntrada={fechaEntrada}
            fechaSalida={fechaSalida}
            onChange={handleDateRangeChange}
          />
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
          ▌ {isPack ? "Tu régimen (incluido en pack)" : "Régimen de pensión"}
        </p>

        {isPack && regimenObj ? (
          // Vista READONLY del régimen del pack
          <div className="mt-4 p-6 rounded-2xl border-2 border-primary bg-primary/5">
            <h4 className="font-display font-bold text-2xl tracking-tight uppercase">
              {regimenObj.label}
            </h4>
            <p className="text-sm text-text-muted mt-2">
              {regimenObj.description}
            </p>
          </div>
        ) : (
          // Selector normal
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {REGIMENES.map((reg) => {
              const isSelected = regimen === reg.id;
              const precioReg = selectedLodge
                ? precioPorRegimen(selectedLodge, reg.id)
                : 0;

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
                  {selectedLodge && precioReg > 0 && (
                    <p className="mt-3 font-mono text-xs text-primary font-bold">
                      {precioReg}€ / noche
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default LodgeSelect;
