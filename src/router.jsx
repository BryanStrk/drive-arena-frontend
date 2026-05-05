import { createBrowserRouter } from 'react-router'

// Layouts
import PublicLayout from '@/layouts/PublicLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

// Route guards
import ProtectedRoute from '@/components/ProtectedRoute'
import PublicOnlyRoute from '@/components/PublicOnlyRoute'

// Pages
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import NotFound from '@/pages/NotFound'

/**
 * Configuración central de rutas de la aplicación.
 *
 * Estructura:
 * - Rutas públicas (no requieren auth) usan PublicLayout
 * - /login está envuelto en PublicOnlyRoute para evitar que un usuario
 *   ya autenticado vuelva al formulario de login
 * - Rutas privadas usan DashboardLayout + ProtectedRoute
 * - Cualquier ruta no encontrada cae en NotFound (catch-all)
 */
export const router = createBrowserRouter([
  {
    // Rutas públicas — comparten PublicLayout
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/login',
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        ),
      },
    ],
  },
  {
    // Rutas privadas — requieren autenticación, usan DashboardLayout
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <Dashboard /> },
    ],
  },
  {
    // Catch-all — cualquier URL no definida arriba
    path: '*',
    element: <NotFound />,
  },
])
