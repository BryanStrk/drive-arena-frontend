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

**Cyber Lime / Glassmorphism** — definido como design tokens en `src/index.css`.

### Colores

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-lime` | `#D4FF00` | CTAs, acentos, texto destacado |
| `--color-lime-glow` | `#D4FF0033` | Sombras neón |
| `--color-bg` | `#0A0A0A` | Fondo global |
| `--color-bg-card` | `#151515` | Fondo de cards |
| `--color-border` | `#1A1A1A` | Bordes sutiles |

### Tipografía

| Token | Familia | Uso |
|-------|---------|-----|
| `font-display` | Bebas Neue | Headings, números grandes |
| `font-mono` | Roboto Mono | Métricas, labels, datos |
| `font-sans` | Inter | Body, formularios |

---

## 📋 Convenciones de código

- **JavaScript estricto** — `.jsx` y `.js`. Prohibido `.tsx`/`.ts`.
- **Conventional Commits** — `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `build:`
- **Feature branches** — `git checkout -b feature/<nombre>` desde `dev`, merge con `--no-ff`.
- **Componentes pequeños y reutilizables** — cada page es composición.

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
