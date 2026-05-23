# Leyendo Star Wars — Frontend

## Stack
- React 18 + TypeScript + Vite
- React Router DOM v6
- Axios con interceptores (token JWT en localStorage)
- SCSS (tokens + global), sin módulos CSS — todo inline styles en componentes
- Sin Redux — Context API para auth y loading
- Hook `useApi.ts` propio para fetching

## Comandos
```bash
npm install        # instalar dependencias
npm run dev        # servidor dev en localhost:5173
npm run build      # build de producción
npm run preview    # previsualizar build
```

## Proxy
El servidor de dev proxea `/api` → `http://localhost:5000` (backend Flask).

## Design System
Tokens en `src/styles/_tokens.scss`:
- **Void**: `#0A0A0F` (fondo), **Surface**: `#14141C`, **Gold**: `#C9A84C` (acento)
- **Parchment**: `#F2EEDF` (texto), **Canon**: `#4B8FD9`, **Legends**: `#C25555`
- Fonts: Oswald (display) · DM Sans (body) · JetBrains Mono (código/fechas)

## Estructura de páginas
| Ruta | Página |
|------|--------|
| `/` | Home |
| `/timeline` | Timeline (eras + rail) |
| `/por-anno` | ByYear |
| `/colecciones` | Collections |
| `/publicaciones/:id` | PublicationDetail |
| `/resenas` | Reviews |
| `/buscar` | Search |
| `/admin` | Admin (requiere isAdmin) |
| `/perfil` | UserProfile |

## Auth
- Token guardado en `localStorage` como `access_token`
- `AuthContext` provee: `user`, `token`, `isAuthenticated`, `isAdmin`, `login()`, `logout()`
- El interceptor de Axios adjunta el token automáticamente
- 401 → limpiar token y redirigir a `/`

## Convenciones
- Inline styles para todos los componentes (replicar el design exacto)
- Datos hardcodeados de ejemplo en cada página (listo para conectar a la API)
- `TopNav` y `Footer` van dentro de cada página, no a nivel de layout global
- `VideoCard` es un componente local en `PublicationDetail.tsx`
- `ActivityGrid` es un componente local en `UserProfile.tsx`
