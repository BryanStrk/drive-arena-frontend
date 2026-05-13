import { createBrowserRouter, Navigate } from 'react-router'

// Layouts
import PublicLayout from '@/layouts/PublicLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import TecnicoLayout from '@/layouts/TecnicoLayout'

// Route guards
import ProtectedRoute from '@/components/ProtectedRoute'
import PublicOnlyRoute from '@/components/PublicOnlyRoute'

// Pages — públicas
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'

// Pages — ADMIN
import Dashboard from '@/pages/Dashboard'
import LodgesPage from '@/pages/LodgesPage'
import ComprasPage from '@/pages/ComprasPage'
import RankingPage from '@/pages/RankingPage'
import MantenimientoPage from '@/pages/MantenimientoPage'
import ClientesPage from '@/pages/ClientesPage'
import CircuitosPage from '@/pages/CircuitosPage'
import UsuariosPage from '@/pages/UsuariosPage'

// Pages — TECNICO
import MantenimientosTecnicoPage from '@/pages/tecnico/MantenimientosTecnicoPage'

// Pages — TAQUILLA
import NuevaCompraPage from '@/pages/taquilla/NuevaCompraPage'
import MisComprasPage from '@/pages/taquilla/MisComprasPage'
import TodasLasVentasPage from '@/pages/taquilla/TodasLasVentasPage'
import TaquillaClientesPage from '@/pages/taquilla/TaquillaClientesPage'

// Reserva wizard (standalone público)
import Reserva from '@/pages/Reserva'
import PassSelect from '@/pages/reserva/PassSelect'
import LodgeSelect from '@/pages/reserva/LodgeSelect'
import CustomerData from '@/pages/reserva/CustomerData'
import Summary from '@/pages/reserva/Summary'
import Confirmation from '@/pages/Confirmation'

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
    // Wizard de reserva pública — standalone
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
    path: '/reserva-confirmada',
    element: <Confirmation />,
  },
  {
    // Rutas ADMIN
    path: '/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'lodges', element: <LodgesPage /> },
      { path: 'compras', element: <ComprasPage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'mantenimiento', element: <MantenimientoPage /> },
      { path: 'clientes', element: <ClientesPage /> },
      { path: 'circuitos', element: <CircuitosPage /> },
      { path: 'usuarios', element: <UsuariosPage /> },
    ],
  },
  {
    // Rutas TAQUILLA
    path: '/taquilla',
    element: (
      <ProtectedRoute allowedRoles={['TAQUILLA']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="nueva-compra" replace /> },
      { path: 'nueva-compra', element: <NuevaCompraPage /> },
      { path: 'mis-compras',      element: <MisComprasPage />       },
      { path: 'todas-las-ventas', element: <TodasLasVentasPage />   },
      { path: 'clientes',         element: <TaquillaClientesPage /> },
    ],
  },
  {
    // Rutas TECNICO
    path: '/tecnico',
    element: (
      <ProtectedRoute allowedRoles={['TECNICO']}>
        <TecnicoLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="mantenimientos" replace /> },
      { path: 'mantenimientos', element: <MantenimientosTecnicoPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
