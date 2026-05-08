import { useEffect, useState, useCallback } from 'react'
import { obtenerRanking, obtenerRecord } from '@/api/ranking'

/**
 * Hook para obtener ranking + récord histórico de una atracción.
 *
 * Hace ambos fetches en paralelo y devuelve estado unificado.
 * Si atraccionId es null/undefined, no hace ningún fetch.
 *
 * @param {number} atraccionId   id de la atracción a consultar
 * @param {{ top?: number }} options
 * @returns {{ ranking, record, isLoading, error, refetch }}
 */
export function useRanking(atraccionId, { top = 20 } = {}) {
  const [ranking, setRanking] = useState([])
  const [record, setRecord] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    if (!atraccionId) {
      setRanking([])
      setRecord(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const [rankingData, recordData] = await Promise.all([
        obtenerRanking(atraccionId, top),
        obtenerRecord(atraccionId),
      ])
      setRanking(rankingData)
      setRecord(recordData)
    } catch (err) {
      console.error('Error al cargar ranking:', err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [atraccionId, top])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return { ranking, record, isLoading, error, refetch: fetchAll }
}
