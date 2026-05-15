import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { clientesApi } from '@/api/clientes'

/**
 * Custom hook para gestionar la colección de clientes.
 *
 * Encapsula toda la interacción con `clientesApi`:
 *   - Carga inicial automática
 *   - Estados derivados: isLoading, error
 *   - Refetch manual
 *   - removeCliente con optimistic update + rollback
 *   - createCliente / updateCliente con refresco local
 *
 * Replica el patrón de useLodges para consistencia entre módulos.
 *
 * Particularidad: los errores 409 (email/dni duplicado) tienen mensaje
 * específico para guiar al usuario hacia la corrección.
 */
export function useClientes() {
  const [clientes, setClientes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchClientes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await clientesApi.list()
      setClientes(data)
    } catch (err) {
      const message =
        err.response?.data?.message ?? 'No se pudieron cargar los clientes'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

  const createCliente = useCallback(async (payload) => {
    const created = await clientesApi.create(payload)
    setClientes((current) => [...current, created])
    toast.success('Cliente registrado correctamente')
    return created
  }, [])

  const updateCliente = useCallback(async (id, payload) => {
    const updated = await clientesApi.update(id, payload)
    setClientes((current) =>
      current.map((c) => (c.id === id ? updated : c)),
    )
    toast.success('Cliente actualizado correctamente')
    return updated
  }, [])

  const removeCliente = useCallback(async (id) => {
    let previous = []
    setClientes((current) => {
      previous = current
      return current.filter((c) => c.id !== id)
    })

    try {
      await clientesApi.remove(id)
      toast.success('Cliente eliminado')
    } catch (err) {
      setClientes(previous) // rollback
      const message =
        err.response?.data?.message ??
        'No se pudo eliminar el cliente. Puede tener ventas asociadas.'
      toast.error(message)
      throw err
    }
  }, [])

  return {
    clientes,
    isLoading,
    error,
    refetch: fetchClientes,
    createCliente,
    updateCliente,
    removeCliente,
  }
}
