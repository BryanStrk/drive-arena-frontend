<div align="center">

# 🏁 Drive Arena — Frontend

**Interfaz de operación del resort experiencial · React 19 + Vite + Tailwind v4**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Version](https://img.shields.io/badge/Version-v2.1.0-FF2D2D)](#-versionado)

</div>

---

## 🔗 Demo en vivo

🌐 **[drive-arena-frontend.vercel.app](https://drive-arena-frontend.vercel.app)**

Prueba la aplicación con las cuentas de demostración (cada rol ve una operativa distinta):

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| 🎟️ Taquilla | `demo` | `demo12345` |
| 🔧 Técnico | `demotecnico` | `demo12345` |

> Cuentas de demostración para evaluación. Los datos pueden reiniciarse periódicamente.
>
> **Arquitectura del despliegue:** frontend en **Vercel**, backend Spring Boot en **VPS de IONOS** tras **Nginx (HTTPS + reverse proxy)** sobre `https://drivearena.appdeploytest.com/api`.

---

## 📋 Tabla de contenidos

- [Visión general](#-visión-general)
- [Stack tecnológico](#-stack-tecnológico)
- [Design System](#-design-system)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Variables de entorno](#-variables-de-entorno)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Routing y roles](#-routing-y-roles)
- [Arquitectura de componentes](#-arquitectura-de-componentes)
- [Gestión de estado y data fetching](#-gestión-de-estado-y-data-fetching)
- [Responsive design](#-responsive-design)
- [Despliegue](#-despliegue)
- [Versionado](#-versionado)
- [Convenciones de Git](#-convenciones-de-git)
- [Autor](#-autor)

---

## 🎯 Visión general

**Drive Arena Frontend** es la SPA que da forma a la operación diaria del resort: gestiona el turno de taquilla, el panel de control del administrador, y el flujo Kanban del técnico de mantenimiento. Consume la API REST del [backend](https://github.com/BryanStrk/drive-arena-backend) mediante Axios autenticado con JWT, y materializa un sistema de diseño propio inspirado en la estética de circuitos nocturnos: dark + rojo de marca + tipografía condensada.

La aplicación está construida con **React 19, Vite 7, Tailwind CSS v4 y React Router 7**, organizada por rol con tres layouts independientes (`DashboardLayout` para escritorio, `TecnicoLayout` para tablet, `PublicLayout` para landing y reserva pública).

---

## 🛠 Stack tecnológico

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework | React | 19 |
| Build tool | Vite | 7 |
| Estilos | Tailwind CSS | v4 (CSS variables, sin config JS) |
| Routing | React Router | 7 |
| Formularios | react-hook-form + zod + @hookform/resolvers | 7 / 3 |
| HTTP | Axios | 1.x |
| Animaciones | framer-motion | 12 |
| Iconografía | lucide-react | 0.x |
| Notificaciones | react-hot-toast | 2.x |
| Fechas | react-day-picker + date-fns | 9 |
| Linting | ESLint | 9 |

> Cero dependencias UI heavyweight: ni Material UI, ni Chakra, ni Headless UI. Todo el sistema visual está construido sobre **Tailwind v4 + tokens CSS personalizados**.

---

## 🎨 Design System

### Paleta

| Token Tailwind | Color | Uso |
|---|---|---|
| `bg-primary` | `#FF2D2D` (Drive Arena Red) | CTAs, KPI signature, badges activos, marca |
| `bg-bg` | `#0A0A0F` | Fondo global |
| `bg-surface-1` | `#13131A` | Cards, modales, headers |
| `bg-surface-2` | `#1A1A22` | Hover states, sub-superficies |
| `border-border-strong` | `#2A2A35` | Bordes y divisores |
| `text-text` | `#F5F5F7` | Texto principal |
| `text-text-muted` | `#A0A0AB` | Texto secundario |
| `text-text-dim` | `#6B6B75` | Texto terciario |

### Tipografía

| Familia | Token | Uso |
|---|---|---|
| **Bebas Neue** | `font-display` | Headings, KPIs, números grandes |
| **Roboto Mono** | `font-mono` | Etiquetas, metadata, micro-copy técnico |
| **Inter** | `font-sans` | Cuerpo de texto, formularios |

### Signature effects

- **KPI glow**: valores numéricos principales con `text-primary` + `drop-shadow-[0_0_8px_rgba(255,45,45,0.3)]`.
- **CTA glow**: botones `size="lg"` con `hover:shadow-xl hover:shadow-primary/50`.
- **Micro-interactions**: cards con `hover:bg-surface-2/50`, botones con `active:scale-[0.98]`.
- **Stagger animations**: listas con `framer-motion` entrando escalonadas (50 ms).
- **Skeleton loaders**: componente `<SkeletonCard />` reutilizable con `animate-pulse`.

---

## ⚡ Features

### Operativa por rol

- **ADMIN**: panel de control con KPIs en tiempo real, dashboard con widgets editables (ingresos mensuales, top lodges, ventas por edad, mantenimientos pendientes), gestión completa de clientes, ventas, lodges, circuitos, mantenimientos y usuarios sistema.
- **TAQUILLA**: flujo de venta optimizado (`/taquilla/nueva-compra`), gestión de clientes, listado de "mis ventas" y "todas las ventas".
- **TÉCNICO**: vista Kanban a 3 columnas (Pendiente / En curso / Resuelto), asignación dinámica de mantenimientos, reportes de finalización.

### UX detallada

- **Sidebar drawer** con hamburger menu en mobile (`<md`), comportamiento idéntico al sidebar fijo en desktop (`md:`).
- **Tablas con reflow tabla→cards** en mobile (las páginas de listado mantienen `<table>` en desktop pero muestran cards apiladas en mobile, sin scroll horizontal).
- **Modales bottom-sheet** en mobile (entran desde abajo) y centrados en desktop, todo con `framer-motion`.
- **Filtros con wrap automático** (`flex-wrap`) para evitar overflow horizontal.
- **Formularios con validación zod** y feedback de errores inline.
- **Notificaciones toast** para todas las acciones CRUD.
- **Skeleton states** durante carga para evitar layout shift.
- **Imágenes desde Cloudinary** con componente `<ImageWithFallback />` (las URLs llegan desde la API; la subida la gestiona el backend).

### Performance y DX

- **Code splitting** automático por ruta vía React Router.
- **HMR** instantáneo con Vite.
- **ESLint** con reglas de hooks y react-refresh.
- **Build producción** ~460 ms, gzip ~540 KB total.

---

## 🚀 Quick Start

### Prerequisitos

- **Node.js** ≥ 20
- **npm** ≥ 10
- Backend corriendo en `http://localhost:8080` (ver [backend repo](https://github.com/BryanStrk/drive-arena-backend))

### Pasos

```bash
# 1. Clonar
git clone https://github.com/BryanStrk/drive-arena-frontend.git
cd drive-arena-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables (ver siguiente sección)
cp .env.example .env

# 4. Arrancar dev server
npm run dev
```

La app quedará disponible en `http://localhost:5173`.

### Scripts disponibles

```bash
npm run dev       # Dev server con HMR (Vite)
npm run build     # Build producción → dist/
npm run preview   # Preview del build de producción
npm run lint      # ESLint sobre src/
```

---

## 🔐 Variables de entorno

La app lee la URL del backend desde `VITE_API_URL`. Si no está definida, usa por defecto `http://localhost:8080/api`.

```env
# Desarrollo local
VITE_API_URL=http://localhost:8080/api

# Producción (backend en VPS IONOS, vía Nginx + HTTPS)
# VITE_API_URL=https://drivearena.appdeploytest.com/api
```

> **Importante:** Vite expone al cliente **solo** las variables prefijadas con `VITE_`. Nunca pongas secretos (API keys de servidor, credenciales) en estas variables: cualquier `VITE_*` acaba en el bundle público.

En **producción (Vercel)**, `VITE_API_URL` se define en el panel del proyecto (Settings → Environment Variables) con el valor de producción, y se hornea en el build. Cambiarla requiere un redeploy.

---

## 📁 Estructura del proyecto

```
drive-arena-frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   ├── axiosClient.js     ← Axios instance con interceptors JWT (lee VITE_API_URL)
│   │   ├── usuarios.js        ← Endpoints de usuario sistema
│   │   └── ...                ← Un módulo por recurso (clientes, compras, etc.)
│   ├── components/
│   │   ├── Button.jsx, Input.jsx, Card.jsx, KpiCard.jsx,
│   │   ├── Badge.jsx, SkeletonCard.jsx, ImageWithFallback.jsx
│   │   ├── circuitos/         ← Modales y forms específicos de circuitos
│   │   ├── clientes/
│   │   ├── compras/
│   │   ├── dashboard/         ← Widgets del panel
│   │   │   ├── MonthlyRevenueWidget.jsx
│   │   │   ├── TopLodgesWidget.jsx
│   │   │   ├── AgeRangeSalesWidget.jsx
│   │   │   └── MantenimientosWidget.jsx
│   │   ├── layout/            ← Sidebar y elementos de chrome
│   │   ├── lodges/
│   │   ├── mantenimiento/     ← MantenimientoCard, modales
│   │   ├── taquilla/          ← Modales detalle venta, ticket, cliente
│   │   ├── tecnico/           ← Kanban, reporte de mantenimiento
│   │   └── usuarios/          ← UsuarioFormModal y gestión usuario sistema
│   ├── layouts/
│   │   ├── DashboardLayout.jsx  ← ADMIN + TAQUILLA (sidebar + breadcrumbs)
│   │   ├── TecnicoLayout.jsx    ← TÉCNICO (header simple, optimizado tablet)
│   │   └── PublicLayout.jsx     ← Landing y reserva pública
│   ├── lib/
│   │   ├── storage.js          ← Helpers de sesión (token/usuario en localStorage)
│   │   ├── motion.js           ← Variantes framer-motion reutilizables
│   │   └── utils.js            ← Formatters (fechas, moneda, etc)
│   ├── pages/
│   │   ├── Login.jsx, Landing.jsx, NotFound.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ClientesPage.jsx, UsuariosPage.jsx,
│   │   ├── ComprasPage.jsx, LodgesPage.jsx, CircuitosPage.jsx,
│   │   ├── MantenimientoPage.jsx, RankingPage.jsx
│   │   ├── taquilla/
│   │   │   ├── NuevaCompraPage.jsx
│   │   │   ├── MisComprasPage.jsx
│   │   │   ├── TodasLasVentasPage.jsx
│   │   │   └── TaquillaClientesPage.jsx
│   │   └── tecnico/
│   │       └── KanbanPage.jsx
│   ├── hooks/
│   │   └── ...                 ← Hooks reutilizables (auth, debounce, etc.)
│   ├── router/
│   │   └── index.jsx           ← Definición de rutas + ProtectedRoute por rol
│   ├── styles/
│   │   └── globals.css         ← Tokens CSS + @import tailwindcss
│   ├── App.jsx
│   └── main.jsx
├── vercel.json                 ← Rewrite SPA
├── vite.config.js              ← Plugins React + Tailwind, alias @/
├── eslint.config.js
├── package.json
└── README.md
```

> La estructura del token de sesión vive en `src/lib/storage.js`; las keys de `localStorage` son `drive_arena_token` y `drive_arena_user`.

---

## 🛣 Routing y roles

El routing usa **React Router 7** con un wrapper `<ProtectedRoute>` que valida el rol antes de renderizar.

### Mapa de rutas

```
/                              → PublicLayout (Landing)
/login                         → Login (sin layout)
/reservar                      → PublicLayout (Reserva pública)

/dashboard                     → DashboardLayout · ADMIN
  ├── /clientes
  ├── /lodges
  ├── /circuitos
  ├── /usuarios
  ├── /mantenimiento
  └── /compras

/taquilla                      → DashboardLayout · TAQUILLA
  ├── /nueva-compra
  ├── /mis-compras
  ├── /todas-las-ventas
  └── /clientes

/tecnico                       → TecnicoLayout · TÉCNICO
  └── /kanban
```

### ProtectedRoute

```jsx
<ProtectedRoute allowedRoles={['ADMIN']}>
  <DashboardLayout>
    <UsuariosPage />
  </DashboardLayout>
</ProtectedRoute>
```

Si el usuario no está autenticado, redirección a `/login`. Si tiene un rol que no está en `allowedRoles`, redirección a su home por rol.

---

## 🧩 Arquitectura de componentes

### Componentes atómicos reutilizables

- **`<Button variant size>`** — variants: `primary` (rojo), `secondary` (outline), `ghost`, `danger`. Sizes: `sm`, `md`, `lg`.
- **`<Input>`** — wrapper sobre `<input>` con focus ring de marca, error state, label embebido.
- **`<Card>`** — superficie con `bg-surface-1`, `border-border-strong`, `rounded-card`.
- **`<Badge variant dot>`** — pills de estado con punto de color opcional.
- **`<KpiCard>`** — número grande con `drop-shadow` rojo signature.
- **`<SkeletonCard count>`** — loader con `animate-pulse`.

### Patrón de modales

Todos los modales del proyecto siguen el mismo patrón con **`framer-motion`**:

```jsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-surface-1 rounded-t-card sm:rounded-card max-h-[90vh] overflow-y-auto"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* contenido */}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

→ **Bottom-sheet en mobile**, **centrado en desktop**.

### Patrón de páginas de listado

```jsx
<PageHeader title="Clientes" cta={<Button>Nuevo Cliente</Button>} />
<SearchAndFilters />
{isLoading
  ? <SkeletonList count={5} />
  : <>
      <table className="hidden md:block">...</table>   {/* desktop */}
      <motion.ul className="md:hidden">...</motion.ul>  {/* mobile cards con stagger */}
    </>
}
<Pagination />
```

---

## 🔌 Gestión de estado y data fetching

### Estado global

- **Auth** — usuario actual y token JWT persistidos en `localStorage` (`drive_arena_token`, `drive_arena_user`), gestionados desde `src/lib/storage.js`.
- **Sin Redux ni Zustand** — el estado global se reduce a la sesión; el resto se gestiona localmente con `useState` / `useReducer`.

### Data fetching

- **Axios instance** (`src/api/axiosClient.js`) con interceptor que inyecta el JWT en cada request y maneja `401` (limpia sesión + redirect a `/login`, salvo en el propio login para evitar bucle).
- **Módulos por recurso** en `src/api/*.js` (p.ej. `usuarios.js`) que encapsulan las llamadas a cada endpoint.
- **Patrón ad-hoc con `useEffect`** y `useState({ data, loading, error })`.
- **No se usa SWR ni React Query**: el alcance del proyecto no lo justifica y mantiene la curva de aprendizaje baja.

### Ejemplo

```jsx
import axiosClient from '@/api/axiosClient';

const [clientes, setClientes] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  axiosClient.get('/clientes', { params: { page, search } })
    .then(res => setClientes(res.data.content))
    .catch(() => toast.error('Error al cargar clientes'))
    .finally(() => setIsLoading(false));
}, [page, search]);
```

---

## 📱 Responsive design

### Breakpoints

| Token | Pixels | Uso |
|---|---|---|
| `sm:` | ≥ 640px | Ajustes de spacing y tipografía |
| `md:` | ≥ 768px | **Breakpoint principal mobile/desktop** |
| `lg:` | ≥ 1024px | Grids multi-columna |
| `xl:` | ≥ 1280px | Dashboard a 3 columnas |

### Estrategia mobile-first

A partir de la versión `v2.1.0`, todo el código sigue una estrategia **mobile-first**: clases base aplican al mobile, los modificadores `sm:` / `md:` aplican a desktop. Esto evita el anti-patrón de "desktop primero con `max-md:` para mobile".

### Patrones aplicados

- **Sidebar**: drawer overlay con backdrop en mobile (`<md`), sidebar fijo en desktop (`md:`).
- **Tablas**: `<table className="hidden md:block">` + `<ul className="md:hidden">` para reflow a cards.
- **Modales**: `items-end sm:items-center` (bottom-sheet vs centrado).
- **Filtros**: `flex-wrap` para wrap automático sin overflow.
- **Headers**: `flex-col sm:flex-row` para stack vertical en mobile.

---

## 🚢 Despliegue

### Vercel

El frontend se despliega automáticamente en **Vercel** con auto-deploy desde la rama `main`. Cada push dispara un build.

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

> El rewrite es **necesario** para que React Router gestione las rutas SPA sin que Vercel devuelva 404 al refrescar una ruta interna.

**Variable de entorno en Vercel:** define `VITE_API_URL` en Settings → Environment Variables apuntando al backend de producción (`https://drivearena.appdeploytest.com/api`). Al ser build-time, un cambio requiere redeploy.

### Backend de producción

El backend Spring Boot corre en un **VPS de IONOS** (Ubuntu), como servicio `systemd` escuchando solo en loopback (`127.0.0.1:8081`), detrás de **Nginx** que termina TLS (Let's Encrypt) y hace de reverse proxy sobre `https://drivearena.appdeploytest.com`. La BD MySQL es local al VPS y nunca se expone a Internet.

### Build

```bash
npm run build         # → dist/
```

El output (`dist/`) es estático y puede servirse desde cualquier CDN o servidor estático.

---

## 🏷 Versionado

| Tag | Hito |
|---|---|
| `v1.0.0` | Primera versión funcional con CRUDs básicos |
| `v1.5.0` | Sistema de auth + rutas protegidas por rol |
| `v1.8.0` | Dashboard con widgets y métricas |
| `v2.0.0` | Multi-técnico, roles TÉCNICO + TAQUILLA, paginación |
| **`v2.1.0`** | **Responsive mobile completo + visual polish (micro-interactions, stagger animations, signature effects)** |

---

## 📝 Convenciones de Git

Mismas convenciones que el backend: **Conventional Commits** + **GitFlow** simplificado + merges `--no-ff`.

| Tipo | Uso |
|---|---|
| `feat` | Nueva feature de UI |
| `fix` | Bug visual o funcional |
| `refactor` | Reorganización de componentes |
| `chore` | Dependencias, config |
| `style` | Cambios CSS sin lógica |
| `docs` | README, comentarios |

### Workflow

```bash
git checkout -b feature/nombre-acotado
# trabajo + commits temáticos por área
git checkout main
git merge feature/nombre-acotado --no-ff
git tag -a vX.Y.Z -m "..."
git push origin main --tags
```

---

## 👤 Autor

**Bryan Alejandro Paico Albines** — _Desarrollo de Aplicaciones Web (DAW) · 2026_

- GitHub: [@BryanStrk](https://github.com/BryanStrk)
- Proyecto backend: [drive-arena-backend](https://github.com/BryanStrk/drive-arena-backend)

---

## 📄 Licencia

Proyecto académico desarrollado como **Trabajo académico de Desarrollo de Aplicaciones Web**. Uso no comercial.

---

<div align="center">

**Drive Arena** · _Conduce · Compite · Domina_

</div>
