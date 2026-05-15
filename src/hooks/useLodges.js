import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { lodgesApi } from '@/api/lodges'

/**
 * Custom hook para gestionar la colección de lodges.
 *
 * Encapsula toda la interacción con `lodgesApi`:
 *   - Carga inicial automática (useEffect)
 *   - Estados derivados: isLoading, error
 *   - Refetch manual cuando lo necesites
 *   - removeLodge con optimistic update + rollback en caso de fallo
 *   - createLodge / updateLodge con refresco local (sin re-fetch)
 *
 * Decisiones:
 * - Los toasts de éxito/error se disparan aquí para evitar duplicar lógica
 *   en cada página que use el hook. Si en algún caso quieres silenciarlos,
 *   se puede parametrizar más adelante.
 * - createLodge y updateLodge propagan el error al caller (con `throw`) para
 *   que el formulario pueda mostrar errores de validación del backend
 *   (ej. unique violation, FK violation, 400 con campos específicos).
 * - removeLodge también propaga el error tras el rollback, por si el caller
 *   quiere reaccionar (ej. cerrar un confirm dialog).
 *
 * Uso típico:
 *   const {
 *     lodges, isLoading, error,
 *     refetch, createLodge, updateLodge, removeLodge,
 *   } = useLodges()
 */
export function useLodges() {
  const [lodges, setLodges] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Carga la lista completa desde el backend.
   * Se ejecuta automáticamente al montar el componente y se puede invocar
   * manualmente desde el caller (ej. botón "Reintentar" en el error state).
   */
  const fetchLodges = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await lodgesApi.list()
      setLodges(data)
    } catch (err) {
      const message =
        err.response?.data?.message ?? 'No se pudieron cargar los lodges'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLodges()
  }, [fetchLodges])

  /**
   * Crea un nuevo lodge y lo añade al final de la lista local.
   * No hace re-fetch: confiamos en la respuesta del backend (que devuelve
   * el lodge ya con `id` generado).
   *
   * @throws El error de Axios — el caller (form) lo captura y muestra
   *         feedback específico al usuario.
   */
  const createLodge = useCallback(async (payload) => {
    const created = await lodgesApi.create(payload)
    setLodges((current) => [...current, created])
    toast.success('Lodge creado correctamente')
    return created
  }, [])

  /**
   * Actualiza un lodge y reemplaza la entrada correspondiente en la lista.
   *
   * @throws El error de Axios — el caller decide qué hacer.
   */
  const updateLodge = useCallback(async (id, payload) => {
    const updated = await lodgesApi.update(id, payload)
    setLodges((current) =>
      current.map((lodge) => (lodge.id === id ? updated : lodge))
    )
    toast.success('Lodge actualizado correctamente')
    return updated
  }, [])

  /**
   * Eliminación con optimistic update:
   *   1. Quita el lodge de la lista al instante (UX inmediata).
   *   2. Llama al backend.
   *   3. Si el backend falla, restaura el estado previo y muestra el error.
   *
   * Captura `previous` dentro del setter funcional para evitar stale closures
   * y dependencias en `lodges` (que rompería la referencia estable del hook).
   *
   * @throws El error de Axios tras el rollback, por si el caller reacciona.
   */
  const removeLodge = useCallback(async (id) => {
    let previous = []
    setLodges((current) => {
      previous = current
      return current.filter((lodge) => lodge.id !== id)
    })

    try {
      await lodgesApi.remove(id)
      toast.success('Lodge eliminado')
    } catch (err) {
      setLodges(previous) // rollback
      const message =
        err.response?.data?.message ??
        'No se pudo eliminar el lodge. Puede tener ventas asociadas.'
      toast.error(message)
      throw err
    }
  }, [])

  return {
    lodges,
    isLoading,
    error,
    refetch: fetchLodges,
    createLodge,
    updateLodge,
    removeLodge,
  }
}
