import axios from 'axios';

/**
 * Cliente HTTP global de la app.
 *
 * baseURL se lee de VITE_API_URL en .env (con fallback a localhost para dev).
 * Vite expone variables que empiezan por VITE_ al cliente vía import.meta.env.
 *
 * Interceptors:
 * - REQUEST: inyecta automáticamente el JWT desde localStorage en cada petición.
 *   Si no hay token (usuario no logueado o ruta pública), pasa la petición
 *   sin Authorization. El backend decide si permite o deniega según SecurityConfig.
 * - RESPONSE: log estructurado de errores en dev, transparente en prod.
 */
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Key del JWT en localStorage. Debe coincidir con la usada en src/lib/storage.js
const TOKEN_STORAGE_KEY = 'drive_arena_token';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s — más que suficiente para reserva con email async
});

// Interceptor de request: inyecta JWT en todas las peticiones autenticadas.
axiosClient.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (raw) {
      // Soporta tanto valor en plano como JSON-stringified (por si storage.js
      // serializa con JSON.stringify al guardar).
      const token = raw.startsWith('"') ? JSON.parse(raw) : raw;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
