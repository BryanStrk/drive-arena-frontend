# Drive Arena — Frontend

Frontend del TFG **Drive Arena**: resort experiencial motorsport que combina hotel, atracciones, simuladores VR y sistema gamificado de pases gratuitos por récords y podios.

> 🎓 Trabajo Final de Grado — DAW · Sprint final: 22 mayo 2026

---

## 🏎️ Stack

| Capa | Tecnología |
|------|------------|
| Bundler | Vite 8 |
| UI | React 19 + JavaScript (sin TypeScript) |
| Estilos | Tailwind CSS v4 (Cyber Lime / Glassmorphism) |
| Routing | React Router 7 |
| HTTP | Axios |
| Forms | React Hook Form + Zod |
| Animación | Framer Motion |
| Iconos | Lucide React |
| Fechas | date-fns |
| Toasts | react-hot-toast |

---

## 🚀 Setup

​```bash
# 1. Clonar
git clone https://github.com/BryanStrk/drive-arena-frontend.git
cd drive-arena-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Arrancar en modo desarrollo
npm run dev
​```

Por defecto arranca en `http://localhost:5173`.

---

## 🔐 Variables de entorno

Todas las variables expuestas al frontend deben tener prefijo `VITE_`.

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del backend | `http://localhost:8080/api` |

⚠️ **Nunca commitear `.env`** — usar `.env.example` como plantilla pública.

---

## 📁 Estructura

​```
src/
├── api/          Clientes Axios y endpoints por entidad
├── components/   Componentes reutilizables
├── constants/    Enums del backend, valores fijos
├── context/      React Contexts (Auth, etc.)
├── hooks/        Custom hooks
├── layouts/      Layouts (Dashboard, Auth)
├── lib/          Lógica de negocio pura
├── pages/        Pantallas (rutas)
└── utils/        Helpers genéricos
​```

---

## 🎨 Sistema de diseño

**Drive Arena Design System V1.0** — definido como design tokens en `src/index.css`.

### Backgrounds

| Token | HEX | Uso |
|-------|-----|-----|
| `--color-bg` | `#0A0A0A` | Brand Black — fondo global |
| `--color-surface-1` | `#141414` | Cards, panels |
| `--color-surface-2` | `#1F1F1F` | Hover, elevated |
| `--color-border` | `#1A1A1A` | Bordes sutiles |
| `--color-border-strong` | `#2A2A2A` | Bordes definidos |

### Brand

| Token | HEX | Uso |
|-------|-----|-----|
| `--color-primary` | `#E0162B` | Primary Red — CTAs, acentos |
| `--color-primary-dark` | `#C01225` | Dark Red — hover, pressed |
| `--color-primary-glow` | `#E0162B33` | Sombras y halos rojos |

### Semantic

| Token | HEX | Uso |
|-------|-----|-----|
| `--color-success` | `#00C853` | Estado online, éxito |
| `--color-danger` | `#FF3B30` | Errores, alertas |
| `--color-warning` | `#FFB800` | Revisión, advertencias |

### Typography

| Token | Familia | Uso |
|-------|---------|-----|
| `font-display` | Saira | Headlines, números grandes |
| `font-sans` | Inter | Body, formularios, legibilidad |
| `font-mono` | JetBrains Mono | Datos, métricas, código |

### Conventions

- **Cards**: `bg-surface-1` con `border border-border-strong` y `rounded-card`
- **Inputs**: `bg-surface-2` sin border en estado normal
- **CTAs primarios**: `bg-primary hover:bg-primary-dark` con texto blanco mayúsculas
- **Status indicators**: dot 8px con shadow del color correspondiente
---

## 🔗 Backend

Repositorio: [drive-arena-backend](https://github.com/BryanStrk/drive-arena-backend)

- Spring Boot 4 + MySQL
- JWT authentication (roles `ADMIN` / `TAQUILLA`)
- API REST en `/api/*`
- Swagger UI en `/swagger-ui.html`

---

## 📜 Scripts disponibles

| Comando | Acción |
|---------|--------|
| `npm run dev` | Servidor de desarrollo (puerto 5173) |
| `npm run build` | Build de producción a `/dist` |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Linter ESLint |

---

## 👤 Autor

**Bryan Paico** · [@BryanStrk](https://github.com/BryanStrk)
