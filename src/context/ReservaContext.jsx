import { createContext, useContext, useReducer, useEffect } from "react";
import { RESERVA_INITIAL_STATE } from "@/data/reservaMocks";

const STORAGE_KEY = "drive-arena:reserva";

const ReservaContext = createContext(null);

// === ACCIONES (constantes para evitar typos) ===
export const RESERVA_ACTIONS = {
  SET_PASE: "SET_PASE",
  SET_LODGE: "SET_LODGE",
  SET_CLIENTE: "SET_CLIENTE",
  RESET: "RESET",
};

// === REDUCER ===
function reservaReducer(state, action) {
  switch (action.type) {
    case RESERVA_ACTIONS.SET_PASE:
      return { ...state, pase: action.payload };
    case RESERVA_ACTIONS.SET_LODGE:
      return { ...state, lodge: action.payload };
    case RESERVA_ACTIONS.SET_CLIENTE:
      return { ...state, cliente: action.payload };
    case RESERVA_ACTIONS.RESET:
      return RESERVA_INITIAL_STATE;
    default:
      return state;
  }
}

/**
 * Hidrata el state inicial desde localStorage.
 * Si no hay nada guardado o el JSON está corrupto, vuelve al inicial.
 */
function lazyInit(initial) {
  if (typeof window === "undefined") return initial;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initial;
  } catch {
    return initial;
  }
}

/**
 * Provider del flujo de reserva. Envuelve toda la ruta /reservar.
 * Persiste el state en localStorage en cada cambio para no perder
 * progreso si el usuario refresca o cierra accidentalmente.
 */
export function ReservaProvider({ children }) {
  const [state, dispatch] = useReducer(
    reservaReducer,
    RESERVA_INITIAL_STATE,
    lazyInit,
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage puede no estar disponible (modo incógnito en algunos navegadores)
    }
  }, [state]);

  return (
    <ReservaContext.Provider value={{ state, dispatch }}>
      {children}
    </ReservaContext.Provider>
  );
}

/**
 * Hook para consumir el state del wizard desde cualquier paso.
 * Lanza error si se usa fuera del Provider (catch temprano de bugs).
 */
export function useReserva() {
  const ctx = useContext(ReservaContext);
  if (!ctx) {
    throw new Error("useReserva debe usarse dentro de <ReservaProvider />");
  }
  return ctx;
}
