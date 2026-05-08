import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { atraccionesApi } from '@/api/atracciones'

/**
 * Custom hook para gestionar la colección de atracciones (circuitos).
 *
 * Encapsula toda la interacción con `atraccionesApi`:
 *   - Carga inicial automática (useEffect)
 *   - Estados derivados: isLoading, error
 *   - Refetch manual cuando lo necesites
 *   - removeAtraccion con optimistic update + rollback en caso de fallo
 *   - createAtraccion / updateAtraccion con refresco local (sin re-fetch)
 *
 * Replica el patrón de useLodges para mantener consistencia entre módulos.
 *
 * Uso típico:
 *   const {
 *     atracciones, isLoading, error,
 *     refetch, createAtraccion, updateAtraccion, removeAtraccion,
 *   } = useAtracciones()
 */
export function useAtracciones() {
  const [atracciones, setAtracciones] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAtracciones = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await atraccionesApi.list()
      setAtracciones(data)
    } catch (err) {
      const message =
        err.response?.data?.message ?? 'No se pudieron cargar los circuitos'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAtracciones()
  }, [fetchAtracciones])

  /**
   * Crea una nueva atracción y la añade al final de la lista local.
   * @throws El error de Axios — el caller (form) lo captura.
   */
  const createAtraccion = useCallback(async (payload) => {
    const created = await atraccionesApi.create(payload)
    setAtracciones((current) => [...current, created])
    toast.success('Circuito creado correctamente')
    return created
  }, [])

  /**
   * Actualiza una atracción y reemplaza la entrada correspondiente.
   * @throws El error de Axios — el caller decide qué hacer.
   */
  const updateAtraccion = useCallback(async (id, payload) => {
    const updated = await atraccionesApi.update(id, payload)
    setAtracciones((current) =>
      current.map((a) => (a.id === id ? updated : a)),
    )
    toast.success('Circuito actualizado correctamente')
    return updated
  }, [])

  /**
   * Eliminación con optimistic update:
   *   1. Quita la atracción de la lista al instante (UX inmediata).
   *   2. Llama al backend.
   *   3. Si falla, restaura el estado previo y muestra el error.
   *
   * Captura `previous` dentro del setter funcional para evitar stale closures.
   *
   * @throws El error de Axios tras el rollback.
   */
  const removeAtraccion = useCallback(async (id) => {
    let previous = []
    setAtracciones((current) => {
      previous = current
      return current.filter((a) => a.id !== id)
    })

    try {
      await atraccionesApi.remove(id)
      toast.success('Circuito eliminado')
    } catch (err) {
      setAtracciones(previous) // rollback
      const message =
        err.response?.data?.message ??
        'No se pudo eliminar el circuito. Puede tener tiempos asociados.'
      toast.error(message)
      throw err
    }
  }, [])

  return {
    atracciones,
    isLoading,
    error,
    refetch: fetchAtracciones,
    createAtraccion,
    updateAtraccion,
    removeAtraccion,
  }
}
