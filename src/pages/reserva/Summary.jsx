import { useReserva } from "@/context/ReservaContext";
import {
  calcularTotalReserva,
  calcularNoches,
  formatearFecha,
} from "@/utils/reservaCalc";

const REGIMEN_LABELS = {
  sin: "Solo alojamiento",
  media: "Media pensión",
  completa: "Pensión completa",
};

const TARIFA_LABELS = {
  NINO: "Niño",
  ADULTO: "Adulto",
  PENSIONISTA: "Pensionista",
};

function tarifaLabel(tipo) {
  return TARIFA_LABELS[tipo] ?? tipo;
}

/**
 * PASO 4 — Resumen y Confirmación.
 *
 * Muestra el detalle completo de la reserva en dos columnas:
 * - Izquierda: bloques de pase, alojamiento y titular
 * - Derecha: desglose de precio (con subtotal y descuento si pack), total
 *   y aviso de pago al llegar
 *
 * El total mostrado replica la fórmula de ReservaPublicaService.calcularTotal
 * del backend. El backend es autoritativo y devuelve el código y total reales
 * al confirmar — la página de Confirmation muestra esos valores definitivos.
 */
function Summary() {
  const { state } = useReserva();
  const { total, subtotal, descuentoPct, descuentoImporte, desglose } =
    calcularTotalReserva(state);
  const personas = state.personas ?? 1;
  const noches = calcularNoches(
    state.lodge?.fechaEntrada,
    state.lodge?.fechaSalida
  );

  const tarifa = state.pase?.tarifa;
  const atraccion = state.pase?.atraccion;
  const lodge = state.lodge?.lodge;
  const regimen = state.lodge?.regimen;

  return (
    <section aria-label="Paso 4: Resumen y confirmación">
      <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">
        Resumen y Confirmación
      </h1>
      <p className="text-text-muted mt-4 max-w-2xl">
        Revisa los detalles de tu reserva. El pago se realiza al llegar al
        resort y recibirás la confirmación inmediata por email.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* === COLUMNA IZQUIERDA: detalles de la reserva === */}
        <div className="md:col-span-2 space-y-6">
          {/* Bloque pase */}
          {tarifa && atraccion && (
            <div className="p-6 rounded-2xl border-2 border-border-strong bg-surface-1/50">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
                ▌ {state.esPack ? "Pack incluido" : "Pase"}
              </p>
              <h3 className="font-display font-bold text-2xl tracking-tight uppercase mt-2">
                {atraccion.nombre}
              </h3>
              <p className="text-sm text-text-muted mt-1">
                Pase {tarifaLabel(tarifa.tipo)}
                {tarifa.descripcion ? ` · ${tarifa.descripcion}` : ""}
              </p>
            </div>
          )}

          {/* Bloque lodge */}
          {lodge && (
            <div className="p-6 rounded-2xl border-2 border-border-strong bg-surface-1/50">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
                ▌ Alojamiento
              </p>
              <h3 className="font-display font-bold text-2xl tracking-tight uppercase mt-2">
                {lodge.nombre}
              </h3>
              <p className="text-sm text-text-muted mt-1">
                {REGIMEN_LABELS[regimen] ?? regimen ?? "—"}
              </p>

              {state.lodge?.fechaEntrada && state.lodge?.fechaSalida ? (
                <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-3 font-mono text-xs">
                  <div>
                    <span className="text-text-muted uppercase tracking-wider text-[10px] block">
                      Entrada
                    </span>
                    <span className="text-text">
                      {formatearFecha(state.lodge.fechaEntrada)}
                    </span>
                  </div>
                  <div className="text-primary text-lg leading-none pb-1">→</div>
                  <div>
                    <span className="text-text-muted uppercase tracking-wider text-[10px] block">
                      Salida
                    </span>
                    <span className="text-text">
                      {formatearFecha(state.lodge.fechaSalida)}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted uppercase tracking-wider text-[10px] block">
                      Noches
                    </span>
                    <span className="text-primary font-bold">{noches}</span>
                  </div>
                </div>
              ) : (
                state.esPack && (
                  <p className="mt-3 font-mono text-xs text-text-muted italic">
                    Te contactaremos para confirmar fechas tras la reserva.
                  </p>
                )
              )}
            </div>
          )}

          {/* Bloque cliente */}
          {state.cliente && (
            <div className="p-6 rounded-2xl border-2 border-border-strong bg-surface-1/50">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
                ▌ Titular de la reserva
              </p>
              <h3 className="font-display font-bold text-2xl tracking-tight uppercase mt-2">
                {state.cliente.nombre} {state.cliente.apellidos}
              </h3>
              <div className="mt-3 space-y-1 text-sm text-text-muted">
                <p>{state.cliente.email}</p>
                <p>{state.cliente.telefono}</p>
                <p className="font-mono text-xs uppercase">
                  {state.cliente.dni}
                </p>
              </div>
              <p className="mt-4 font-mono text-xs tracking-wider text-text-muted">
                ▶ Reserva para{" "}
                <span className="text-primary font-bold">
                  {personas} {personas === 1 ? "persona" : "personas"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* === COLUMNA DERECHA: total + aviso de pago === */}
        <div className="md:col-span-1">
          <div className="p-6 rounded-2xl border-2 border-primary bg-primary/5 sticky top-6">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
              ▌ Total estimado
            </p>

            {/* Desglose */}
            <div className="mt-4 space-y-3">
              {desglose.map((item, idx) => (
                <div key={idx} className="text-xs">
                  <p className="text-text font-bold uppercase tracking-tight">
                    {item.concepto}
                  </p>
                  <div className="flex items-baseline justify-between mt-1">
                    <p className="text-text-muted">{item.detalle}</p>
                    <p className="font-mono font-bold text-text shrink-0 ml-2">
                      {item.importe.toFixed(2)}€
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal y descuento (solo si hay pack) */}
            {descuentoPct > 0 && (
              <div className="mt-4 pt-3 border-t border-border-strong space-y-2">
                <div className="flex items-baseline justify-between text-xs">
                  <p className="text-text-muted uppercase tracking-wider">
                    Subtotal
                  </p>
                  <p className="font-mono text-text-muted">
                    {subtotal.toFixed(2)}€
                  </p>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <p className="text-primary uppercase tracking-wider font-bold">
                    Descuento Pack {(descuentoPct * 100).toFixed(0)}%
                  </p>
                  <p className="font-mono text-primary font-bold">
                    -{descuentoImporte.toFixed(2)}€
                  </p>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="mt-6 pt-4 border-t border-primary/30">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-xs tracking-wider uppercase text-text-muted">
                  Total
                </p>
                <p className="font-display font-extrabold text-4xl text-primary">
                  {total.toFixed(2)}€
                </p>
              </div>
            </div>

            {/* Aviso pago al llegar */}
            <div className="mt-6 p-3 rounded-lg bg-surface-1/80 border border-border-strong">
              <p className="font-mono text-[10px] tracking-wider uppercase text-primary">
                💰 Pago al llegar
              </p>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">
                No se realiza ningún cobro ahora. Recibirás un email con el
                código de reserva y abonas el total al hacer check-in en el
                resort.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Summary;
