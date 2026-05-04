import axios from 'axios'

/**
 * Cliente Axios pre-configurado para hablar con el backend Drive Arena.
 *
 * - Base URL desde variable de entorno (VITE_API_URL).
 * - Content-Type JSON por defecto.
 * - Timeout 10s para evitar requests colgadas.
 * - Interceptor de request: añade el JWT automáticamente desde localStorage.
 * - Interceptor de response: detecta 401 y limpia la sesión local.
 *
 * Todos los servicios que hablen con el backend deben importar
 * esta instancia (no usar axios directo) para garantizar que
 * todas las requests pasan por estos interceptors.
 *
 * Backend: http://localhost:8080/api (configurable vía .env)
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor.
 * Inyecta el JWT en el header Authorization si existe en localStorage.
 *
 * Formato esperado: "Bearer <token>" según el contrato del backend.
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('drive_arena_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Response interceptor.
 * Maneja errores globales:
 * - 401 Unauthorized: token expirado o inválido → limpia la sesión local.
 *
 * El AuthContext escuchará el evento de localStorage para reaccionar
 * (logout automático y redirect al login). Lo implementamos en el
 * commit del AuthContext.
 *
 * Otros errores (4xx, 5xx, network) se devuelven al caller para que
 * cada servicio los maneje según su contexto (ej. toast.error).
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('drive_arena_token')
      localStorage.removeItem('drive_arena_user')
    }
    return Promise.reject(error)
  }
)

export default axiosClient