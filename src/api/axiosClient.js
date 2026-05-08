import axios from 'axios';

/**
 * Cliente HTTP global de la app.
 *
 * baseURL se lee de VITE_API_URL en .env (con fallback a localhost para dev).
 * Vite expone variables que empiezan por VITE_ al cliente vía import.meta.env.
 *
 * En el futuro, este cliente se puede extender con:
 * - Interceptor de request para inyectar JWT (cuando se use auth en frontend)
 * - Refresh de tokens
 * - Cancelación de requests en navigate
 */
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s — más que suficiente para reserva con email async
});

// Interceptor de respuesta: log estructurado en dev, transparente en prod
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error(
        '[API Error]',
        error.response?.status || 'NETWORK',
        error.config?.url,
        error.response?.data || error.message
      );
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
