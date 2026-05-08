import { createBrowserRouter, Navigate } from 'react-router'

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
import ComprasPage from '@/pages/ComprasPage'
import RankingPage from '@/pages/RankingPage'
import MantenimientoPage from '@/pages/MantenimientoPage'
import NotFound from '@/pages/NotFound'


// Reserva wizard (standalone)
import Reserva from '@/pages/Reserva'
import PassSelect from '@/pages/reserva/PassSelect'
import LodgeSelect from '@/pages/reserva/LodgeSelect'
import CustomerData from '@/pages/reserva/CustomerData'
import Summary from '@/pages/reserva/Summary'
import Confirmation from '@/pages/Confirmation'

/**
 * Configuración central de rutas de la aplicación.
 *
 * Estructura:
 * - Rutas públicas (no requieren auth) usan PublicLayout
 * - /login está envuelto en PublicOnlyRoute para evitar que un usuario
 *   ya autenticado vuelva al formulario de login
 * - /reservar es un wizard standalone: sin PublicLayout (foco total en
 *   la tarea de reserva). Las sub-rutas /paso-N comparten state vía
 *   ReservaContext provisto desde la página padre Reserva.jsx
 * - /reserva-confirmada es la página de éxito post-reserva, también
 *   standalone (no comparte stepper ni layout del wizard)
 * - Rutas privadas usan DashboardLayout + ProtectedRoute, organizadas
 *   como rutas anidadas con `index: true` para `/dashboard` y `path: 'xxx'`
 *   para los sub-módulos
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
    // Wizard de reserva pública — standalone (sin layouts)
    path: '/reservar',
    element: <Reserva />,
    children: [
      { index: true, element: <Navigate to="paso-1" replace /> },
      { path: 'paso-1', element: <PassSelect /> },
      { path: 'paso-2', element: <LodgeSelect /> },
      { path: 'paso-3', element: <CustomerData /> },
      { path: 'paso-4', element: <Summary /> },
    ],
  },
  {
    // Página de éxito post-reserva — standalone
    path: '/reserva-confirmada',
    element: <Confirmation />,
  },
  {
    // Rutas privadas anidadas bajo /dashboard
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'lodges', element: <LodgesPage /> },
      { path: 'compras', element: <ComprasPage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'mantenimiento', element: <MantenimientoPage /> },
      // Próximos módulos:
      // { path: 'circuitos', element: <CircuitosPage /> },
      // { path: 'clientes', element: <ClientesPage /> },
      // { path: 'empleados', element: <EmpleadosPage /> },
      // { path: 'tarifas', element: <TarifasPage /> },
    ],
  },
  {
    // Catch-all
    path: '*',
    element: <NotFound />,
  },
])
