<div align="center">

# 🏎️ Drive Arena · Frontend

### Panel de administración + frontend público para resort de motorsport

[![React](https://img.shields.io/badge/React-19-61DAFB.svg)]()
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)]()
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4.svg)]()
[![React Router](https://img.shields.io/badge/Router-v7-CA4245.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()
[![Version](https://img.shields.io/badge/version-1.6.1-blue.svg)]()

**Aplicación SPA construida con React 19 + Vite que sirve dos experiencias en una sola base de código: una zona pública con wizard de reserva y una zona privada con panel de administración del resort.**

[Resumen](#-resumen) ·
[Stack](#-stack-tecnológico) ·
[Módulos](#-módulos-implementados) ·
[Estructura](#-estructura-del-proyecto) ·
[Instalación](#-instalación-y-puesta-en-marcha) ·
[Diseño](#-diseño-y-experiencia-de-usuario) ·
[Roadmap](#-roadmap)

> **Backend asociado:** [drive-arena-backend](https://github.com/BryanStrk/drive-arena-backend) (Spring Boot 4 + Java 25 + MySQL)

</div>

---

## 📋 Resumen

Este repositorio contiene el **frontend** del proyecto **Drive Arena**, una SPA en **React 19** con dos zonas claramente diferenciadas:

- **Zona pública**: home del resort, catálogo de packs y lodges, y un wizard de reserva multi-paso que culmina con confirmación por email.
- **Zona privada**: panel de administración con 7 módulos para gestionar todos los recursos del negocio (compras, clientes, lodges, circuitos, mantenimientos y ranking de pilotos).

El frontend consume la **API REST** del backend mediante un cliente Axios con interceptor JWT, gestiona el estado local con React Hook Form + Zod, y aplica un sistema de diseño propio basado en TailwindCSS v4.

> Trabajo de Fin de Grado del ciclo **FP Superior en Desarrollo de Aplicaciones Web (DAW)** — Convocatoria mayo 2026.

---

## 🛠️ Stack tecnológico

### Core

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| Framework | **React** | 19 |
| Build tool | **Vite** | 7 |
| Routing | **React Router** | 7 |
| Estilos | **TailwindCSS** | v4 |
| Lenguaje | JavaScript (ES2024+) | — |

> **Nota técnica**: el proyecto utiliza **JavaScript puro** (`.jsx` / `.js`), no TypeScript. Esto es una decisión consciente del autor para mantener el foco en la lógica del dominio durante el TFG.

### Forms y validación

| Librería | Uso |
|----------|-----|
| **react-hook-form** | Gestión de formularios con re-renders mínimos |
| **zod** | Schemas de validación tipados |
| **@hookform/resolvers** | Bridge entre Zod y React Hook Form |

### HTTP y comunicación

| Librería | Uso |
|----------|-----|
| **axios** | Cliente HTTP con interceptor JWT centralizado |
| **react-hot-toast** | Notificaciones de feedback (éxito / error) |

### UX y animación

| Librería | Uso |
|----------|-----|
| **framer-motion** | Animaciones de entrada/salida y transiciones de listas |
| **lucide-react** | Iconografía consistente en toda la app |
| **react-day-picker** | Selector de rangos de fechas en el wizard |

---

## 🎯 Funcionalidades destacadas

### Zona pública

- **Home** con hero, listado de packs, listado de lodges, sección de localización con mapa y bottom nav sticky en mobile.
- **Wizard de reserva** multi-step con persistencia de estado entre pasos:
  1. Selección de fechas (entrada / salida)
  2. Selección de lodge
  3. Selección de pase de circuito
  4. Datos del cliente
  5. Resumen y confirmación
- **Email automático** de confirmación tras reserva exitosa.

### Zona privada (panel admin)

| Módulo | Operaciones | Características destacadas |
|--------|-------------|----------------------------|
| **Dashboard** | Lectura | Widget de mantenimientos pendientes con datos reales del backend y lógica de urgencia automática |
| **Compras** | Lectura, eliminación | Tabla con badges WEB / TAQUILLA, modal de detalle con entradas anidadas |
| **Clientes** | CRUD completo | CRM con avatar de iniciales, búsqueda multicampo (nombre / email / DNI) |
| **Lodges** | CRUD completo | Subida de imagen a Cloudinary mediante `POST /api/upload` |
| **Circuitos** | CRUD completo | Selector de tamaño + frecuencia de revisión |
| **Mantenimiento** | CRUD completo | Filtros por estado en chips, selector de circuito y técnico, gestión de transiciones de estado |
| **Ranking** | Lectura | Selector de circuito + podio top 3 + récord absoluto |

### Características transversales

- **Lógica de urgencia automática**: el dashboard calcula client-side la criticidad de cada mantenimiento (`VENCIDO` / `CRÍTICO` / `REVISIÓN` / `PROGRAMADO`) en función de la diferencia entre fecha programada y hoy.
- **Optimistic updates** en todas las eliminaciones, con rollback automático si el backend devuelve error.
- **Estados visuales coherentes** en todos los módulos: `loading` (skeleton), `empty`, `emptyFilter`, `error` (con botón de reintentar), `data`.
- **Validación dual**: client-side con Zod antes de enviar, y server-side con Bean Validation en el backend.
- **Reutilización de componentes**: el modal de edición de mantenimiento se invoca tanto desde la página completa como desde el widget del dashboard, recibiendo las funciones CRUD por props (inversión de control).

---

## 📦 Estructura del proyecto

```
drive-arena-frontend/
├── src/
│   ├── api/                          # Clientes HTTP por dominio
│   │   ├── axiosClient.js            # Cliente base con interceptor JWT
│   │   ├── atracciones.js
│   │   ├── clientes.js
│   │   ├── compras.js
│   │   ├── empleados.js
│   │   ├── lodges.js
│   │   ├── mantenimientos.js
│   │   ├── ranking.js
│   │   └── reservaApi.js
│   │
│   ├── components/                   # Componentes organizados por dominio
│   │   ├── circuitos/
│   │   │   ├── AtraccionCard.jsx
│   │   │   └── AtraccionFormModal.jsx
│   │   ├── clientes/
│   │   │   ├── ClienteCard.jsx
│   │   │   └── ClienteFormModal.jsx
│   │   ├── compras/
│   │   │   └── CompraDetailModal.jsx
│   │   ├── dashboard/
│   │   │   ├── AgeRangeSalesWidget.jsx
│   │   │   ├── MonthlyRevenueWidget.jsx
│   │   │   ├── PendingMaintenanceWidget.jsx
│   │   │   └── TopLodgesWidget.jsx
│   │   ├── home/                     # Hero, LodgeCard, PackCard, etc.
│   │   ├── lodges/
│   │   ├── mantenimiento/
│   │   ├── reserva/                  # Wizard multi-step
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── KpiCard.jsx
│   │
│   ├── context/                      # Auth + Reserva (estado global)
│   │   ├── AuthContext.jsx
│   │   └── ReservaContext.jsx
│   │
│   ├── hooks/                        # Custom hooks por módulo
│   │   ├── useAtracciones.js
│   │   ├── useClientes.js
│   │   ├── useCompras.js
│   │   ├── useLodges.js
│   │   ├── useMantenimientos.js
│   │   ├── useMantenimientosPendientes.js
│   │   ├── useRanking.js
│   │   └── useReservaCatalogo.js
│   │
│   ├── layouts/
│   │   └── DashboardLayout.jsx       # Sidebar + topbar + breadcrumbs
│   │
│   ├── lib/
│   │   ├── cn.js                     # Helper de classNames
│   │   ├── storage.js                # Wrapper de localStorage
│   │   └── schemas/                  # Schemas Zod por dominio
│   │       ├── atraccionSchema.js
│   │       ├── clienteSchema.js
│   │       ├── lodgeSchema.js
│   │       └── mantenimientoSchema.js
│   │
│   ├── pages/                        # Páginas (rutas)
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ComprasPage.jsx
│   │   ├── ClientesPage.jsx
│   │   ├── LodgesPage.jsx
│   │   ├── CircuitosPage.jsx
│   │   ├── MantenimientoPage.jsx
│   │   ├── RankingPage.jsx
│   │   ├── Reserva.jsx               # Layout del wizard
│   │   ├── reserva/                  # Pasos del wizard
│   │   │   ├── LodgeSelect.jsx
│   │   │   ├── PassSelect.jsx
│   │   │   ├── CustomerData.jsx
│   │   │   └── Summary.jsx
│   │   ├── Confirmation.jsx
│   │   └── NotFound.jsx
│   │
│   ├── utils/
│   │   ├── extractApiError.js
│   │   ├── reservaCalc.js
│   │   └── mapsUrls.js
│   │
│   ├── router.jsx                    # Definición de rutas
│   ├── App.jsx
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Tailwind + Google Fonts
│
├── public/
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🎨 Diseño y experiencia de usuario

### Sistema de diseño "Drive Arena"

El proyecto aplica un **design system propio** con tokens centralizados en TailwindCSS v4:

| Token | Uso |
|-------|-----|
| `bg-bg` | Fondo general (oscuro) |
| `bg-surface-1`, `bg-surface-2` | Superficies elevadas |
| `bg-primary`, `bg-primary-dark` | Color de acento (rojo Drive Arena) |
| `border-border-strong` | Bordes de cards y separadores |
| `text-text`, `text-text-muted`, `text-text-dim` | Jerarquía tipográfica |
| `font-display`, `font-sans`, `font-mono` | Familias tipográficas (display + sans + mono) |
| `rounded-card`, `rounded-inner` | Radios consistentes |

### Principios visuales

- **Tema oscuro** por defecto en toda la aplicación.
- **Tipografía display** para títulos y métricas grandes; tipografía mono para datos técnicos (DNIs, IDs, fechas).
- **Cards consistentes** con bordes sutiles y hover states uniformes.
- **Animaciones de entrada/salida** con Framer Motion en listados y modales.
- **Iconografía Lucide** para coherencia visual.

### Patrones de UX aplicados

- **Estados explícitos** en todas las páginas: skeleton de carga, empty state inicial, empty state de filtro, error con retry, lista poblada.
- **Feedback inmediato** mediante toasts (`react-hot-toast`) tras cada operación de éxito o error.
- **Confirmaciones explícitas** antes de operaciones destructivas (eliminar).
- **Búsqueda local** en módulos con datasets pequeños (filtrado client-side memoizado).
- **Filtros server-side** en módulos con datasets que crecen (mantenimientos por estado).

---

## 🚀 Instalación y puesta en marcha

### Requisitos previos

- **Node.js 20+** y **npm** (o `pnpm` / `yarn`)
- Backend de Drive Arena corriendo en `http://localhost:8080` ([drive-arena-backend](https://github.com/BryanStrk/drive-arena-backend))

### 1. Clonar el repositorio

```bash
git clone https://github.com/BryanStrk/drive-arena-frontend.git
cd drive-arena-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

Crear el archivo `.env.local` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080/api
```

> Las variables de Vite que se exponen al cliente deben empezar siempre por `VITE_`.

### 4. Arrancar el servidor de desarrollo

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### 5. Build de producción

```bash
npm run build
npm run preview
```

El bundle optimizado se genera en `dist/`. Listo para desplegar en cualquier hosting estático (Vercel, Netlify, S3 + CloudFront).

---

## 🔐 Autenticación

El frontend gestiona la sesión mediante **JWT** almacenado en `localStorage` bajo la clave `drive_arena_token`.

### Flujo

1. El usuario hace login en `/login` con credenciales (`username` + `password`).
2. El backend devuelve un token JWT.
3. El token se guarda mediante el helper `storage.js` (`setSession` / `getSession` / `clearSession`).
4. El **interceptor de Axios** en `axiosClient.js` inyecta automáticamente la cabecera `Authorization: Bearer <token>` en cada petición.
5. Al cerrar sesión, se ejecuta `clearSession()` y se redirige a `/login`.

### Rutas protegidas

Las rutas bajo `/dashboard/*` requieren autenticación. El componente `AuthContext` expone el estado de sesión y un `ProtectedRoute` redirige a login si el usuario no está autenticado.

---

## 🧠 Patrones aplicados

### Arquitectura por dominio

Cada módulo (clientes, lodges, mantenimientos…) sigue la **misma estructura**:

```
api/{modulo}.js                 → Cliente HTTP (objeto con métodos list/getById/create/update/remove)
hooks/use{Modulo}.js            → Custom hook con estado + CRUD + optimistic updates
lib/schemas/{modulo}Schema.js   → Schema Zod + defaults
components/{modulo}/Card.jsx    → Card individual
components/{modulo}/FormModal.jsx → Modal de alta/edición con react-hook-form
pages/{Modulo}Page.jsx          → Página con grid + búsqueda + estados
```

Esta uniformidad acelera el desarrollo y simplifica el onboarding mental al saltar entre módulos.

### Inversión de control en componentes

Los modales (ej. `MantenimientoFormModal`) **no saben de dónde vienen sus datos**: reciben las funciones CRUD por props. Esto permite que el mismo modal se reutilice tanto desde la página completa de Mantenimiento como desde el widget del Dashboard, cada uno con su propia implementación de las funciones.

### Custom hooks como capa de abstracción

Los componentes de página **no llaman directamente a la API**: llaman a un custom hook (`useClientes`, `useMantenimientos`, ...) que encapsula la carga inicial, los estados (`isLoading`, `error`), las funciones de CRUD y los toasts. Esto mantiene los componentes enfocados solo en presentación.

### Optimistic updates con rollback

```
1. Usuario hace click en "Eliminar"
2. El UI elimina el item localmente (optimistic)
3. Se llama a la API
4. Si OK → se muestra toast de éxito
5. Si error → se restaura el estado anterior (rollback) + toast de error
```

### Convenciones de código

- Componentes en **PascalCase**, hooks con prefijo `use`, helpers en **camelCase**.
- Archivos `.jsx` para componentes con JSX, `.js` para utilidades puras y schemas.
- **Conventional Commits** estricto: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.

---

## 🗺️ Roadmap

### Funcionalidades pendientes

- [ ] **Nueva venta interna**: wizard de reserva para empleados de taquilla (similar al wizard público pero con búsqueda/creación de cliente integrada)
- [ ] **CRUD de empleados**, **tarifas** y **turnos** desde el panel admin
- [ ] **Página "Mi perfil"** para usuarios del sistema
- [ ] **Modal de detalle público de lodge** con galería de imágenes
- [ ] **Pre-selección de pack/lodge** al entrar al wizard desde una card del home

### Mejoras del Dashboard

- [ ] Conectar los **4 KPIs superiores** a datos reales agregados (ventas hoy, reservas activas, tiempos en pista, nuevos clientes)
- [ ] Conectar **Top 3 Lodges del mes** a agregación real de compras por hotel
- [ ] Conectar **Evolución mensual de ingresos** a agregación real
- [ ] Reemplazar **"Ventas por rango de edad"** por una métrica calculable (ej. ventas por tipo de pensión o canal)

### Mejoras técnicas

- [ ] **Interceptor de respuesta** en Axios que detecte HTTP 401 y redirija automáticamente al login (gestión de token expirado)
- [ ] **Drag & drop kanban** en la página de Mantenimiento para cambiar estado arrastrando
- [ ] **Validación de NIE** en el regex de DNI de cliente (formato `[XYZ][0-9]{7}[A-Za-z]`)
- [ ] **Tests** con Vitest + Testing Library para componentes críticos

---

## 📦 Versiones

| Versión | Hito |
|---------|------|
| `1.0.0` | Estructura base + login + Lodges como módulo gold standard |
| `1.3.0` | Frontend público completo (home + wizard de reserva + confirmación) |
| `1.4.0` | Mantenimiento + Ranking + refactor visual de Compras |
| `1.5.0` | Módulo de Clientes (CRM con avatar de iniciales) |
| `1.5.1` | Hotfix: recuperación de archivos del módulo Circuitos |
| `1.6.0` | Dashboard con widget de mantenimientos conectado a datos reales |
| `1.6.1` | UX: edición rápida de mantenimientos desde el widget del dashboard |

---

## 👨‍💻 Autor

**Bryan Paico Albines**

- 🎓 Estudiante de FP Superior en **Desarrollo de Aplicaciones Web (DAW)**
- 💼 [GitHub @BryanStrk](https://github.com/BryanStrk)

Proyecto desarrollado como **Trabajo de Fin de Grado** del ciclo DAW.

---

## 📄 Licencia

Distribuido bajo licencia **MIT**. Ver `LICENSE` para más detalles.

---

## 📊 Estado del proyecto

> 🟢 **Activo** — En desarrollo y mantenimiento. Última versión estable: **v1.6.1**.

<div align="center">

---

Hecho con ☕ y mucho asfalto en Barcelona.

</div>
