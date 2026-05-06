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
import LodgesPage from '@/pages/LodgesPage'
import NotFound from '@/pages/NotFound'

/**
 * Configuración central de rutas de la aplicación.
 *
 * Estructura:
 * - Rutas públicas (no requieren auth) usan PublicLayout
 * - /login está envuelto en PublicOnlyRoute para evitar que un usuario
 *   ya autenticado vuelva al formulario de login
 * - Rutas privadas usan DashboardLayout + ProtectedRoute, organizadas
 *   como rutas anidadas con `index: true` para `/dashboard` y `path: 'xxx'`
 *   para los sub-módulos. Este patrón escala limpiamente: cada nuevo CRUD
 *   se añade como un nuevo hijo sin tocar la estructura.
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
    // Rutas privadas anidadas bajo /dashboard
    // El DashboardLayout renderiza los hijos en su <Outlet />
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'lodges', element: <LodgesPage /> },
      // Próximos módulos:
      // { path: 'circuitos', element: <CircuitosPage /> },
      // { path: 'clientes', element: <ClientesPage /> },
      // { path: 'empleados', element: <EmpleadosPage /> },
      // { path: 'tarifas', element: <TarifasPage /> },
    ],
  },
  {
    // Catch-all — cualquier URL no definida arriba
    path: '*',
    element: <NotFound />,
  },
])
