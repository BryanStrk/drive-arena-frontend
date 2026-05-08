import { useEffect, useState } from 'react';
import {
  obtenerAtracciones,
  obtenerTarifas,
  obtenerHoteles,
} from '@/api/reservaApi';

/**
 * Carga el catálogo completo necesario para el wizard de reserva pública:
 *   - atracciones
 *   - tarifas (globales: NINO, ADULTO, PENSIONISTA)
 *   - hoteles (lodges)
 *
 * Las 3 peticiones se ejecutan en paralelo con Promise.all para minimizar
 * el TTFB del wizard. Si cualquiera falla, se marca error y se descartan
 * los datos parciales (evita estado inconsistente).
 *
 * Uso:
 *   const { atracciones, tarifas, hoteles, isLoading, error, refetch } = useReservaCatalogo();
 */
export function useReservaCatalogo() {
  const [atracciones, setAtracciones] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [atraccionesData, tarifasData, hotelesData] = await Promise.all([
        obtenerAtracciones(),
        obtenerTarifas(),
        obtenerHoteles(),
      ]);
      setAtracciones(atraccionesData);
      setTarifas(tarifasData);
      setHoteles(hotelesData);
    } catch (err) {
      const message =
        err.response?.data?.message ??
        'No se pudo cargar el catálogo de reserva. Inténtalo de nuevo.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    atracciones,
    tarifas,
    hoteles,
    isLoading,
    error,
    refetch: cargar,
  };
}
