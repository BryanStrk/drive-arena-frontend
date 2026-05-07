import { createContext, useContext, useReducer, useEffect } from "react";
import { RESERVA_INITIAL_STATE } from "@/data/reservaMocks";

const STORAGE_KEY = "drive-arena:reserva";

const ReservaContext = createContext(null);

export const RESERVA_ACTIONS = {
  SET_PASE: "SET_PASE",
  SET_LODGE: "SET_LODGE",
  SET_CLIENTE: "SET_CLIENTE",
  SET_PACK: "SET_PACK",
  CLEAR_PACK: "CLEAR_PACK",
  RESET: "RESET",
};

function reservaReducer(state, action) {
  switch (action.type) {
    case RESERVA_ACTIONS.SET_PASE: {
      // Selección manual deshace el pack. Si venía de pack mode,
      // limpiar también el lodge (que era el del pack) para no
      // dejar state inconsistente.
      const wasPackMode = state.esPack;
      return {
        ...state,
        pase: action.payload,
        esPack: false,
        packId: null,
        lodge: wasPackMode ? null : state.lodge,
      };
    }
    case RESERVA_ACTIONS.SET_LODGE:
      return { ...state, lodge: action.payload };
    case RESERVA_ACTIONS.SET_CLIENTE:
      return { ...state, cliente: action.payload };
    case RESERVA_ACTIONS.SET_PACK:
      return {
        ...state,
        pase: action.payload.pase,
        lodge: action.payload.lodge,
        esPack: true,
        packId: action.payload.packId,
      };
    case RESERVA_ACTIONS.CLEAR_PACK:
      return {
        ...state,
        pase: null,
        lodge: null,
        esPack: false,
        packId: null,
      };
    case RESERVA_ACTIONS.RESET:
      return RESERVA_INITIAL_STATE;
    default:
      return state;
  }
}

function lazyInit(initial) {
  if (typeof window === "undefined") return initial;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initial;
  } catch {
    return initial;
  }
}

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
      // localStorage puede no estar disponible
    }
  }, [state]);

  return (
    <ReservaContext.Provider value={{ state, dispatch }}>
      {children}
    </ReservaContext.Provider>
  );
}

export function useReserva() {
  const ctx = useContext(ReservaContext);
  if (!ctx) {
    throw new Error("useReserva debe usarse dentro de <ReservaProvider />");
  }
  return ctx;
}
