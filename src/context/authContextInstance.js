import { createContext } from 'react'

/**
 * Instancia interna del AuthContext.
 *
 * Se exporta solo para que AuthProvider y useAuth puedan usarla.
 * Los consumidores de la app SIEMPRE deben usar useAuth(), nunca este context directo.
 */
export const AuthContext = createContext(null)