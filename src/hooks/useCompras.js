import { useEffect, useState, useCallback } from 'react'
import { obtenerCompras } from '@/api/compras'

/**
 * Hook para obtener el listado de compras.
 * El backend devuelve Page<CompraResumenDTO> — extrae .content y expone
 * totalElements para los contadores de UI.
 *
 * @param {{ clienteId?: number, hotelId?: number, soloMias?: boolean }} filtros
 * @returns {{ compras, totalElements, isLoading, error, refetch }}
 */
export function useCompras(filtros = {}) {
  const [compras, setCompras] = useState([])
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const { clienteId, hotelId, soloMias } = filtros

  const fetchCompras = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await obtenerCompras({ clienteId, hotelId, soloMias })
      const content = data?.content
      if (Array.isArray(content)) {
        setCompras(content)
        setTotalElements(data.totalElements ?? content.length)
      } else {
        // Fallback: backend returned a plain array
        const arr = Array.isArray(data) ? data : []
        setCompras(arr)
        setTotalElements(arr.length)
      }
    } catch (err) {
      console.error('Error al cargar compras:', err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [clienteId, hotelId, soloMias])

  useEffect(() => {
    fetchCompras()
  }, [fetchCompras])

  return { compras, totalElements, isLoading, error, refetch: fetchCompras }
}
