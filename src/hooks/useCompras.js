import { useEffect, useState, useCallback } from 'react'
import { obtenerCompras } from '@/api/compras'

/**
 * Hook para obtener el listado de compras.
 * Soporta filtros opcionales por clienteId y hotelId.
 *
 * @param {{ clienteId?: number, hotelId?: number }} filtros
 * @returns {{ compras, isLoading, error, refetch }}
 */
export function useCompras(filtros = {}) {
  const [compras, setCompras] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const { clienteId, hotelId } = filtros

  const fetchCompras = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await obtenerCompras({ clienteId, hotelId })
      setCompras(data)
    } catch (err) {
      console.error('Error al cargar compras:', err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [clienteId, hotelId])

  useEffect(() => {
    fetchCompras()
  }, [fetchCompras])

  return { compras, isLoading, error, refetch: fetchCompras }
}
