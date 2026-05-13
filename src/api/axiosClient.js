import axios from 'axios';
import { clearSession } from '@/lib/storage';

/**
 * Cliente HTTP global de la app.
 *
 * Interceptors:
 * - REQUEST: inyecta JWT desde localStorage en cada petición autenticada.
 * - RESPONSE: en 401 limpia la sesión y redirige a /login (excepto en el
 *   propio endpoint de login para evitar bucle infinito).
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

// Interceptor de respuesta: 401 → logout forzado; log en dev
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

    const is401 = error.response?.status === 401;
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    if (is401 && !isLoginRequest) {
      clearSession();
      window.location.replace('/login');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
