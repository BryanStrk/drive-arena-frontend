import { useState, useEffect, useCallback } from 'react'
import axiosClient from '@/api/axiosClient'

/**
 * Hook que carga el resumen del dashboard desde GET /api/dashboard/resumen.
 * Solo accesible con rol ADMIN.
 *
 * Los setState solo se ejecutan dentro de callbacks de promesa (.then / .catch /
 * .finally), nunca en el cuerpo síncrono del effect, para satisfacer
 * react-hooks/set-state-in-effect.
 *
 * @returns {{ data, isLoading, error, refetch }}
 */
export function useDashboard() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const doFetch = useCallback(
    () =>
      axiosClient
        .get('/dashboard/resumen')
        .then(({ data: resumen }) => {
          setData(resumen)
          setError(null)
        })
        .catch((err) => {
          setError(err)
        })
        .finally(() => {
          setIsLoading(false)
        }),
    []
  )

  // doFetch no llama setState síncronamente → el linter no lo marca
  useEffect(() => {
    doFetch()
  }, [doFetch])

  const refetch = useCallback(() => {
    setIsLoading(true)
    setError(null)
    doFetch()
  }, [doFetch])

  return { data, isLoading, error, refetch }
}
