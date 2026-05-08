/**
 * Extrae un mensaje human-friendly de un error de Axios.
 *
 * Cubre los casos del GlobalExceptionHandler del backend:
 * - BusinessException → 400 con `{ message: "..." }`
 * - ResourceNotFoundException → 404 con `{ message: "..." }`
 * - MethodArgumentNotValidException (Bean Validation) → 400 con `{ errors: [...] }`
 * - Errores de red sin response (servidor caído, CORS, timeout)
 *
 * @param {Error} error - error capturado en catch
 * @returns {string} mensaje listo para mostrar al usuario
 */
export function extractApiError(error) {
  // Sin respuesta del servidor (red caída, CORS, timeout)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'La petición tardó demasiado. Inténtalo de nuevo.';
    }
    return 'No se pudo conectar con el servidor. Verifica tu conexión.';
  }

  const { status, data } = error.response;

  // Mensaje custom del backend (BusinessException, ResourceNotFoundException)
  if (data?.message) return data.message;

  // Errores de validación Jakarta Bean (lista de campos)
  if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors
      .map((e) => e.defaultMessage || e.message || e.field)
      .filter(Boolean)
      .join('. ');
  }

  // Fallback por status code
  if (status === 400) return 'Los datos enviados no son válidos.';
  if (status === 401) return 'No autorizado. Recarga la página.';
  if (status === 403) return 'No tienes permisos para esta acción.';
  if (status === 404) return 'No se encontró el recurso solicitado.';
  if (status === 409) return 'Ya existe un cliente con ese email o DNI.';
  if (status >= 500) return 'Error en el servidor. Intenta de nuevo en unos minutos.';

  return 'Error desconocido. Inténtalo de nuevo.';
}
