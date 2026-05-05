<div align="center">

# 🏎️ Drive Arena — Frontend

**Sistema operativo del resort experiencial motorsport**

Frontend del TFG (Trabajo Fin de Grado) de Desarrollo de Aplicaciones Web — Drive Arena, un resort que combina hospedaje premium, circuitos, simuladores VR y experiencias de conducción gamificada.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-Educational-orange)]()
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)]()

[Demo](#) · [Backend repo](https://github.com/BryanStrk/drive-arena-backend) · [Reportar bug](https://github.com/BryanStrk/drive-arena-frontend/issues)

</div>

---

## 📖 Sobre el proyecto

**Drive Arena** es un resort experiencial dedicado al motorsport. El sistema operativo (este frontend) gestiona toda la operativa del resort: ventas en taquilla, gestión de lodges, mantenimiento de vehículos, ranking de pilotos, turnos de empleados y métricas analíticas en tiempo real.

El frontend está dividido en dos zonas:

- **Zona pública** — Landing del resort donde los visitantes descubren circuitos, lodges, packs y rankings.
- **Zona privada** — Sistema operativo (back office) para administradores y personal de taquilla.

---

## 🛠️ Stack técnico

### Core
| Tecnología | Versión | Rol |
|---|---|---|
| **React** | 19 | Librería UI |
| **Vite** | 8 | Build tool y dev server |
| **JavaScript** | ES2024 | Lenguaje (sin TypeScript por requisito académico) |
| **Tailwind CSS** | v4 | Sistema de estilos utility-first |

### Routing & estado
- **React Router** 7 — Routing declarativo con layout routes y guards
- **React Context** + lazy initial state — Estado global de autenticación
- **localStorage** — Persistencia de sesión (token JWT + datos de usuario)

### Formularios & validación
- **react-hook-form** 7 — Gestión de formularios performante
- **Zod** 4 — Validación de schemas type-safe

### HTTP & autenticación
- **Axios** — Cliente HTTP con interceptors para JWT
- **JWT (Bearer token)** — Autenticación contra API Spring Boot

### UI/UX
- **Recharts** 3 — Gráficos para dashboards analíticos
- **react-hot-toast** — Notificaciones no intrusivas
- **Framer Motion** — Animaciones declarativas
- **Lucide React** — Iconografía consistente
- **Cloudinary** — CDN de imágenes (logo, avatares, lodges, packs)

---

## 🎨 Sistema de diseño

Drive Arena tiene una identidad visual **cyber-motorsport** definida por:

### Paleta de colores
| Token | Hex | Uso |
|---|---|---|
| `--color-bg` | `#0A0A0A` | Fondo global |
| `--color-surface-1` | `#141414` | Superficies primarias (cards, sidebar) |
| `--color-surface-2` | `#1F1F1F` | Superficies secundarias (hover, inputs) |
| `--color-primary` | `#E0162B` | CTAs, acentos, glow |
| `--color-success` | `#00C853` | Estados positivos |
| `--color-warning` | `#FFB800` | Estados de revisión |
| `--color-danger` | `#FF3B30` | Errores y estados críticos |

### Tipografía
- **Saira** — Display (títulos, números grandes)
- **Inter** — Sans-serif (cuerpo de texto)
- **JetBrains Mono** — Mono (labels, métricas, tracking wide)

---

## 📂 Estructura del proyecto

\`\`\`
drive-arena-frontend/
├── public/                       # Assets estáticos
├── src/
│   ├── api/                      # Cliente HTTP y endpoints
│   │   ├── axiosClient.js        # Axios + interceptors JWT
│   │   └── authApi.js            # Endpoints de autenticación
│   ├── components/
│   │   ├── Badge.jsx             # Etiquetas con variantes
│   │   ├── Button.jsx            # Botón base (primary/secondary/ghost/danger)
│   │   ├── Card.jsx              # Contenedor con borde y radio
│   │   ├── Input.jsx             # Input accesible (forwardRef + WCAG AA)
│   │   ├── KpiCard.jsx           # Tarjeta de métrica para dashboard
│   │   ├── ProtectedRoute.jsx    # Guard para rutas privadas
│   │   ├── PublicOnlyRoute.jsx   # Guard para login (no autenticados)
│   │   ├── home/                 # Componentes del Home público
│   │   └── dashboard/            # Widgets del dashboard privado
│   ├── context/
│   │   ├── AuthContext.jsx       # Provider de autenticación
│   │   ├── authContextInstance.js
│   │   └── useAuth.js            # Hook personalizado
│   ├── data/
│   │   ├── cloudinaryAssets.js   # URLs de imágenes Cloudinary
│   │   └── homeMocks.js          # Mock data para Home público
│   ├── layouts/
│   │   ├── PublicLayout.jsx      # Wrapper de zona pública
│   │   └── DashboardLayout.jsx   # Shell privado (sidebar + topbar)
│   ├── lib/
│   │   ├── cn.js                 # Utility para merge de classNames
│   │   ├── storage.js            # Helpers de localStorage
│   │   └── validators.js         # Schemas Zod
│   ├── pages/
│   │   ├── Home.jsx              # Landing público
│   │   ├── Login.jsx             # Formulario de acceso
│   │   ├── Dashboard.jsx         # Panel de control privado
│   │   └── NotFound.jsx          # 404
│   ├── router.jsx                # Configuración de rutas
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Tailwind + tokens del design system
├── .env                          # Variables de entorno (no commiteado)
├── .env.example                  # Plantilla de .env
├── package.json
└── vite.config.js
\`\`\`

---

## 🚀 Instalación y arranque

### Requisitos previos

- **Node.js** ≥ 20
- **npm** ≥ 10
- Backend de Drive Arena corriendo en `localhost:8080` ([repo backend](https://github.com/BryanStrk/drive-arena-backend))

### Pasos

\`\`\`bash
# 1. Clonar el repositorio
git clone https://github.com/BryanStrk/drive-arena-frontend.git
cd drive-arena-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con la URL de tu API si es necesario

# 4. Arrancar el servidor de desarrollo
npm run dev
\`\`\`

La aplicación estará disponible en \`http://localhost:5173\`.

### Variables de entorno

\`\`\`env
VITE_API_URL=http://localhost:8080/api
\`\`\`

---

## 🔐 Autenticación

El sistema usa **JWT** contra el backend Spring Boot. Los usuarios prueba disponibles:

| Username | Password | Rol |
|---|---|---|
| \`admin\` | \`admin123\` | ADMIN |
| \`taquilla\` | \`taquilla123\` | TAQUILLA |

El token se almacena en \`localStorage\` y se inyecta automáticamente en cada petición vía \`axiosClient\` interceptor. La sesión se rehidrata al recargar la página gracias a \`useState\` con lazy initial state.

---

## 🗺️ Mapa de rutas

\`\`\`
/                  Home público
/login             Formulario de acceso (redirige a /dashboard si ya logueado)
/dashboard         Panel de control (requiere auth)
/*                 NotFound (404)
\`\`\`

---

## 🎯 Estado actual del proyecto

### ✅ Completado

- [x] Sistema de diseño con tokens (colores, tipografías, radios)
- [x] Componentes base (Badge, Button, Card, Input)
- [x] Routing público con layout
- [x] Home público completo (Hero, Stats, Experiences, Ranking, Packs, Lodges, Location, Footer)
- [x] Sistema de autenticación JWT contra Spring Boot
- [x] Rutas protegidas y rutas exclusivas para no autenticados
- [x] Layout privado con sidebar rica + topbar (breadcrumbs, buscador, notificaciones)
- [x] Dashboard analítico con widgets:
  - [x] 4 KPIs del día (ventas, reservas, tiempo en pista, nuevos clientes)
  - [x] Distribución de ventas por rango de edad
  - [x] Top 3 Lodges del mes con podio
  - [x] Evolución mensual de ingresos (Recharts)
  - [x] Tabla de mantenimientos pendientes con estados

### 🚧 En progreso / Próximamente

- [ ] CRUD de Lodges (listado, crear, editar, borrar)
- [ ] CRUD de Clientes
- [ ] Asistente de Nueva Venta (wizard de 4 pasos)
- [ ] CRUDs minimales (Atracciones, Tarifas, Empleados)
- [ ] Integración real con backend (sustituir mocks)
- [ ] Estados de loading y error en widgets
- [ ] Página de perfil de usuario
- [ ] Página de mantenimientos completa
- [ ] Gestión de turnos
- [ ] Ranking administrable
- [ ] Deployment a producción (Vercel)

---

## 📦 Scripts disponibles

\`\`\`bash
npm run dev          # Servidor de desarrollo (Vite)
npm run build        # Build de producción
npm run preview      # Preview del build de producción
npm run lint         # Linter (ESLint)
\`\`\`

---

## 🌳 Workflow de Git

El proyecto sigue un workflow basado en **Conventional Commits** y **feature branches**:

### Ramas
- \`main\` — Releases estables (taggeadas con SemVer)
- \`dev\` — Integración de features completas
- \`feature/*\` — Desarrollo de funcionalidades nuevas

### Tipos de commit
- \`feat:\` — Nueva funcionalidad
- \`fix:\` — Corrección de bugs
- \`refactor:\` — Refactor sin cambio funcional
- \`chore:\` — Tareas de mantenimiento
- \`docs:\` — Cambios en documentación
- \`build:\` — Cambios en sistema de build o dependencias

### Releases publicadas
- **v0.1.0** — Home público completo
- **v0.2.0** — Sistema de autenticación API
- **v0.3.0** — Rutas protegidas, dashboard layout y logout

---

## 📚 Backend

Este frontend consume la API REST de **Drive Arena Backend**:

- Repo: [github.com/BryanStrk/drive-arena-backend](https://github.com/BryanStrk/drive-arena-backend)
- Stack: Spring Boot 4 · Java 25 · MySQL · JWT · Spring Security 7

---

## 🎓 Contexto académico

Este proyecto forma parte del **TFG (Trabajo Fin de Grado)** del Ciclo Formativo de Grado Superior en **Desarrollo de Aplicaciones Web (DAW)**.

**Sprint final:** 22 de mayo de 2026

---

## 👤 Autor

**Bryan** — [@BryanStrk](https://github.com/BryanStrk)

---

## 📄 Licencia

Proyecto educativo · Todos los derechos reservados.
