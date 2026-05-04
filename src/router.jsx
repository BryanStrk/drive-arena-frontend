import { createBrowserRouter } from 'react-router'

// Layouts
import PublicLayout from '@/layouts/PublicLayout'

// Pages
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'

/**
 * Configuración central de rutas de la aplicación.
 *
 * Estructura:
 * - Rutas públicas (no requieren auth) usan PublicLayout
 * - Rutas privadas (futuras) usarán DashboardLayout + ProtectedRoute
 * - Cualquier ruta no encontrada cae en NotFound (catch-all)
 */
export const router = createBrowserRouter([
  {
    // Rutas públicas — comparten PublicLayout
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
    ],
  },
  {
    // Catch-all — cualquier URL no definida arriba
    path: '*',
    element: <NotFound />,
  },
])