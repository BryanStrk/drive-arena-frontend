import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { mantenimientosApi } from '@/api/mantenimientos'

/**
 * Custom hook para gestionar la colección de mantenimientos.
 *
 * Replica el patrón de useLodges/useAtracciones con un añadido:
 *   - filtro por estado en el lado cliente (re-fetch al cambiar `estado`)
 *
 * Uso típico:
 *   const {
 *     mantenimientos, isLoading, error,
 *     estadoFilter, setEstadoFilter,
 *     refetch, createMantenimiento, updateMantenimiento, removeMantenimiento,
 *   } = useMantenimientos()
 */
export function useMantenimientos() {
  const [mantenimientos, setMantenimientos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [estadoFilter, setEstadoFilter] = useState(null) // null = todos

  const fetchMantenimientos = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const filters = estadoFilter ? { estado: estadoFilter } : {}
      const data = await mantenimientosApi.list(filters)
      setMantenimientos(data)
    } catch (err) {
      const message =
        err.response?.data?.message ??
        'No se pudieron cargar los mantenimientos'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [estadoFilter])

  useEffect(() => {
    fetchMantenimientos()
  }, [fetchMantenimientos])

  /**
   * Crea un mantenimiento. El estado se fuerza a PENDIENTE en backend.
   * @throws El error de Axios — el caller (form) lo captura.
   */
  const createMantenimiento = useCallback(async (payload) => {
    const created = await mantenimientosApi.create(payload)
    setMantenimientos((current) => [...current, created])
    toast.success('Mantenimiento programado correctamente')
    return created
  }, [])

  /**
   * Actualiza un mantenimiento (incluido cambio de estado).
   * @throws El error de Axios.
   */
  const updateMantenimiento = useCallback(async (id, payload) => {
    const updated = await mantenimientosApi.update(id, payload)
    setMantenimientos((current) =>
      current.map((m) => (m.id === id ? updated : m)),
    )
    toast.success('Mantenimiento actualizado correctamente')
    return updated
  }, [])

  /**
   * Eliminación con optimistic update + rollback en fallo.
   * @throws El error de Axios tras el rollback.
   */
  const removeMantenimiento = useCallback(async (id) => {
    let previous = []
    setMantenimientos((current) => {
      previous = current
      return current.filter((m) => m.id !== id)
    })

    try {
      await mantenimientosApi.remove(id)
      toast.success('Mantenimiento eliminado')
    } catch (err) {
      setMantenimientos(previous) // rollback
      const message =
        err.response?.data?.message ?? 'No se pudo eliminar el mantenimiento'
      toast.error(message)
      throw err
    }
  }, [])

  return {
    mantenimientos,
    isLoading,
    error,
    estadoFilter,
    setEstadoFilter,
    refetch: fetchMantenimientos,
    createMantenimiento,
    updateMantenimiento,
    removeMantenimiento,
  }
}
