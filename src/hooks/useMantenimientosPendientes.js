import { useCallback, useEffect, useState } from 'react'

import { mantenimientosApi } from '@/api/mantenimientos'

/**
 * Custom hook ligero para el widget de Mantenimientos Pendientes del Dashboard.
 *
 * Difiere de `useMantenimientos` (módulo completo) en que:
 *   - Solo lee mantenimientos con estado=PENDIENTE
 *   - No expone CRUD: el dashboard es read-only
 *   - No muestra toast: el widget tiene su propio empty/error state
 *   - Limita el resultado a los 4 más próximos en fecha (para no sobrecargar el card)
 *
 * Uso:
 *   const { mantenimientos, isLoading, error, refetch } = useMantenimientosPendientes()
 */
export function useMantenimientosPendientes(limit = 4) {
  const [mantenimientos, setMantenimientos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMantenimientos = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await mantenimientosApi.list({ estado: 'PENDIENTE' })

      // Ordenar por fecha programada ascendente (los más urgentes primero)
      // y limitar al número configurado para el widget.
      const sorted = [...data]
        .sort(
          (a, b) =>
            new Date(a.fechaProgramada) - new Date(b.fechaProgramada),
        )
        .slice(0, limit)

      setMantenimientos(sorted)
    } catch (err) {
      const message =
        err.response?.data?.message ?? 'No se pudieron cargar los mantenimientos'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchMantenimientos()
  }, [fetchMantenimientos])

  return {
    mantenimientos,
    isLoading,
    error,
    refetch: fetchMantenimientos,
  }
}
