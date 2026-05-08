import { useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import "react-day-picker/style.css";
import "./DateRangeField.css";

/**
 * Range picker para fechas de estancia.
 *
 * Recibe y emite fechas como strings ISO (YYYY-MM-DD) para mantener
 * compatibilidad con el state del wizard y el contrato del backend.
 * Internamente convierte a/desde objetos Date para el DayPicker.
 *
 * Características:
 * - Bloquea fechas pasadas (no se pueden seleccionar ni escribir)
 * - Sanitización defensiva: si recibe fechas pasadas o inválidas en props
 *   (ej: state stale tras refactor o tab vieja), las limpia al montar
 * - Mode "range": el usuario hace 2 clicks (entrada y salida)
 * - Locale español, semana empezando en lunes
 * - Estilizado con la paleta brand (rojo #E0162B sobre dark)
 * - Responsive: 2 meses en desktop, 1 en mobile
 */
function DateRangeField({ fechaEntrada, fechaSalida, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parseo defensivo de los strings ISO recibidos
  const fromDate = fechaEntrada ? parseISO(fechaEntrada) : null;
  const toDate = fechaSalida ? parseISO(fechaSalida) : null;

  // Una fecha es "válida y futura" si parseISO devolvió algo parseable Y >= today
  const validFrom = fromDate && isValid(fromDate) && fromDate >= today
    ? fromDate
    : undefined;
  const validTo = toDate && isValid(toDate) && toDate >= today
    ? toDate
    : undefined;

  // Detectar si llegan fechas stale (pasadas o inválidas) → auto-limpiar state
  const fromIsStale = fechaEntrada && !validFrom;
  const toIsStale = fechaSalida && !validTo;

  useEffect(() => {
    if (fromIsStale || toIsStale) {
      onChange({
        fechaEntrada: validFrom ? format(validFrom, "yyyy-MM-dd") : "",
        fechaSalida: validTo ? format(validTo, "yyyy-MM-dd") : "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const range = { from: validFrom, to: validTo };

  const handleSelect = (newRange) => {
    onChange({
      fechaEntrada: newRange?.from ? format(newRange.from, "yyyy-MM-dd") : "",
      fechaSalida: newRange?.to ? format(newRange.to, "yyyy-MM-dd") : "",
    });
  };

  return (
    <div className="date-range-picker-wrapper">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={{ before: today }}
        locale={es}
        weekStartsOn={1}
        ISOWeek
        showOutsideDays
        numberOfMonths={2}
        captionLayout="label"
      />
      <p className="date-range-hint">
        ▶ Haz click en la fecha de <span>entrada</span> y luego en la de{" "}
        <span>salida</span>
      </p>
    </div>
  );
}

export default DateRangeField;
