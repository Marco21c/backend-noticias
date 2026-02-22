# Backend - Sistema de Gestión de Noticias

API REST desarrollada con Node.js, TypeScript, Express y MongoDB para la gestión completa de noticias con sistema de autenticación, autorización basada en roles y administración de usuarios.

## Descripción

Backend robusto para sistema de gestión de noticias que proporciona autenticación JWT, control de acceso basado en roles (Superadmin, Admin, Editor, User), CRUD completo de noticias y usuarios, con arquitectura escalable y segura.

### Características principales

- Sistema de autenticación con JWT
- Control de acceso basado en roles
- Gestión de usuarios con encriptación de contraseñas (bcrypt)
- Sistema de inicialización de Superadmin
- CRUD completo de noticias y usuarios
- Sistema de suscripción a newsletter con preferencias por categoría
- Filtrado por categoría, autor y estado
- Validación de variables de entorno con Zod v4
- Arquitectura modular (Controller → Service → Repository)
- Configuración de CORS para múltiples entornos
- Sistema de logging estructurado con Pino
- Linting con ESLint y TypeScript

## Requisitos Previos

- Node.js >= 18.x
- npm o yarn
- MongoDB (local o remoto)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Marco21c/backend-noticias.git
cd backend-noticias
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Entorno
NODE_ENV=development

# Puertos
PORT=3000
PORT_DEV=3000
PORT_PROD=3000

# Base de datos
MONGODB_DEV=mongodb://localhost:27017/noticiasdb
MONGODB_URI=mongodb://usuario:password@host:puerto/noticiasdb

# URLs del cliente (CORS)
CLIENT_URL=http://localhost:5173
CLIENT_DEV_URL=http://localhost:5173
APP_URL=http://localhost:3000

# JWT (OBLIGATORIO - mínimo 32 caracteres)
JWT_SECRET=tu_secreto_jwt_minimo_32_caracteres_aqui
JWT_EXPIRES_IN=7d
```

> **Nota:** `JWT_SECRET` es obligatorio y debe tener al menos 32 caracteres.

### 4. Inicializar Superadmin

Crear el usuario superadmin inicial:

```bash
npm run create-superadmin
```

## Uso

### Comandos disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con hot reload
- `npm run build` - Compila el proyecto TypeScript
- `npm start` - Inicia el servidor en producción
- `npm run create-superadmin` - Crea usuario superadmin
- `npm run delete-superadmin` - Elimina usuario superadmin
- `npm run type-check` - Verifica tipos TypeScript
- `npm run lint` - Ejecuta ESLint para verificar código
- `npm run lint:fix` - Ejecuta ESLint y corrige errores automáticamente

### Modo Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000`.

### Modo Producción

```bash
npm run build
npm start
```

## Estructura del Proyecto

```
backend-noticias/
├── src/
│   ├── config/          # Configuraciones
│   │   ├── cors.ts      # Configuración CORS
│   │   ├── database.ts  # Conexión MongoDB
│   │   └── env.ts       # Validación de entorno
│   ├── controllers/     # Controladores
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── newsletter.controller.ts
│   │   ├── news.controller.ts
│   │   └── user.controller.ts
│   ├── dtos/            # Data Transfer Objects
│   ├── errors/          # Clases de error personalizadas
│   ├── helpers/         # Funciones de utilidad
│   ├── interfaces/      # Interfaces TypeScript
│   ├── middlewares/     # Middlewares
│   │   ├── auth.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/          # Modelos Mongoose
│   │   ├── category.model.ts
│   │   ├── newsletter.model.ts
│   │   ├── news.model.ts
│   │   └── user.model.ts
│   ├── repositories/    # Capa de acceso a datos
│   ├── routes/          # Rutas de la API
│   ├── scripts/         # Scripts de utilidad
│   │   ├── createSuperAdmin.ts
│   │   └── deleteSuperAdmin.ts
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades
│   │   └── logger.ts    # Sistema de logging con Pino
│   └── validations/     # Schemas de validación Zod
├── dist/                # Código compilado
├── eslint.config.mjs    # Configuración ESLint
└── index.ts             # Punto de entrada
```

## Endpoints de la API

### Autenticación

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña"
}
```

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña",
  "name": "Nombre",
  "lastName": "Apellido"
}
```

### Noticias

#### Obtener todas las noticias
```http
GET /api/news
GET /api/news?category=technology
GET /api/news?author=authorId
GET /api/news?status=published
```

#### Obtener noticia por ID
```http
GET /api/news/:id
```

#### Crear noticia (requiere autenticación)
```http
POST /api/news
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Título de la noticia",
  "slug": "titulo-de-la-noticia",
  "summary": "Resumen",
  "content": "Contenido completo",
  "category": "technology",
  "variant": "default",
  "status": "published"
}
```

#### Actualizar noticia (requiere autenticación)
```http
PUT /api/news?_id=<newsId>
Authorization: Bearer <token>
```

#### Eliminar noticia (requiere autenticación)
```http
DELETE /api/news/:id
Authorization: Bearer <token>
```

### Usuarios (solo Superadmin)

#### Obtener todos los usuarios
```http
GET /api/users
Authorization: Bearer <token>
```

#### Crear usuario
```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña",
  "name": "Nombre",
  "lastName": "Apellido",
  "role": "admin"
}
```

#### Actualizar usuario
```http
PUT /api/users/:id
Authorization: Bearer <token>
```

#### Eliminar usuario
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

### Newsletter

Sistema de suscripción a newsletter con selección de categorías preferidas (máximo 3).

#### Suscribirse al newsletter
```http
POST /api/newsletter/subscribe
Authorization: Bearer <token>
Content-Type: application/json

{
  "preferredCategories": ["categoryId1", "categoryId2", "categoryId3"]
}
```

#### Actualizar preferencias de categorías
```http
PUT /api/newsletter/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "preferredCategories": ["categoryId1", "categoryId2"]
}
```

#### Desuscribirse del newsletter
```http
DELETE /api/newsletter/unsubscribe
Authorization: Bearer <token>
```

#### Obtener mi suscripción
```http
GET /api/newsletter/my-subscription
Authorization: Bearer <token>
```

### Newsletter Admin (solo Admin/Superadmin)

#### Listar todos los suscriptores activos
```http
GET /api/newsletter/admin/subscribers
Authorization: Bearer <token>
```

#### Buscar suscriptor por ID
```http
GET /api/newsletter/admin/subscribers/:id
Authorization: Bearer <token>
```

#### Buscar suscriptor por email
```http
GET /api/newsletter/admin/subscribers/email/:email
Authorization: Bearer <token>
```

#### Listar suscriptores por categoría
```http
GET /api/newsletter/admin/subscribers/category/:categoryId
Authorization: Bearer <token>
```

## Modelo de Datos

### Usuario

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | String | Sí | Email único |
| `password` | String | Sí | Contraseña encriptada |
| `name` | String | Sí | Nombre |
| `lastName` | String | Sí | Apellido |
| `role` | Enum | Sí | superadmin, admin, editor, user |
| `createdAt` | Date | Auto | Fecha de creación |
| `updatedAt` | Date | Auto | Fecha de actualización |

### Noticia

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `title` | String | Sí | Título de la noticia |
| `slug` | String | Sí | URL amigable (único) |
| `summary` | String | Sí | Resumen breve |
| `content` | String | Sí | Contenido completo |
| `highlights` | String[] | No | Puntos destacados |
| `author` | ObjectId | Auto | Referencia al usuario |
| `category` | Enum | Sí | Categoría |
| `variant` | Enum | Sí | highlighted, featured, default |
| `status` | Enum | No | draft, published |
| `mainImage` | String | No | URL de imagen |
| `source` | String | No | Fuente |
| `publicationDate` | Date | No | Fecha de publicación |

### Newsletter

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `user` | ObjectId | Sí | Referencia al usuario (único) |
| `preferredCategories` | ObjectId[] | No | Categorías seleccionadas (máx 3) |
| `isActive` | Boolean | Sí | Estado de suscripción |
| `createdAt` | Date | Auto | Fecha de suscripción |
| `updatedAt` | Date | Auto | Fecha de actualización |

Nota: `email` y `name` se obtienen del usuario referenciado mediante populate.

## Roles de Usuario

El sistema implementa cuatro niveles de acceso:

- **Superadmin**: Acceso completo, incluyendo gestión de usuarios y administración completa del newsletter
- **Admin**: Gestión completa de noticias y administración del newsletter (listar suscriptores, buscar por email/categoría)
- **Editor**: Creación y edición de noticias, puede suscribirse al newsletter
- **User**: Solo lectura, puede suscribirse al newsletter y gestionar sus preferencias

## Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación mediante JWT
- Tokens con expiración configurable
- Middleware de autenticación para rutas protegidas
- Validación de roles para endpoints sensibles
- CORS configurado para orígenes específicos
- Validación de autor en edición/eliminación de noticias
- Protección contra creación de usuarios superadmin vía API

## Calidad de Código

### ESLint

El proyecto utiliza ESLint con configuración para TypeScript. Las reglas principales incluyen:

- `no-console`: Prohibe uso de console (usar logger)
- `@typescript-eslint/no-explicit-any`: Advierte sobre uso de `any`
- `@typescript-eslint/consistent-type-imports`: Fuerza imports de tipo
- `import/order`: Ordena imports automáticamente

```bash
# Verificar errores
npm run lint

# Corregir errores automáticamente
npm run lint:fix
```

### Sistema de Logging

El proyecto utiliza Pino para logging estructurado:

- **Desarrollo**: Logs colorizados y legibles con pino-pretty
- **Producción**: Logs en formato JSON

```typescript
import logger from './utils/logger.js';

logger.info('Mensaje de información');
logger.error({ err }, 'Mensaje de error');
logger.debug({ data }, 'Mensaje de debug');
```

## Tecnologías Utilizadas

### Core
- Node.js
- TypeScript ^5.9.3
- Express ^5.2.1

### Base de Datos
- MongoDB
- Mongoose ^9.1.3

### Autenticación y Seguridad
- jsonwebtoken ^9.0.3
- bcryptjs ^3.0.3

### Validación y Configuración
- Zod ^4.3.5
- dotenv ^17.2.3
- cors ^2.8.5

### Logging y Calidad de Código
- pino ^10.3.1
- pino-pretty ^13.1.3
- eslint ^9.39.3
- typescript-eslint ^8.56.0

### Desarrollo
- tsx ^4.21.0
- cross-env ^7.0.3

## Gestión del Proyecto

Este proyecto se gestiona mediante **GitHub Projects**, donde se organizan los sprints, tareas y el seguimiento del desarrollo. La metodología ágil permite una planificación iterativa y una mejor colaboración entre los miembros del equipo.

### Organización

- **Sprints**: Ciclos de desarrollo de 2 semanas
- **Tareas**: Organizadas en el tablero de GitHub Projects
- **Issues**: Seguimiento de bugs y nuevas funcionalidades
- **Pull Requests**: Revisión de código antes de merge

## Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## Integrantes

- **Marcos Condori** - Fullstack Developer - [GitHub](https://github.com/Marco21c) | [LinkedIn](https://www.linkedin.com/in/marcos-condori-23c/)
- **Ezequiel Pacheco** - Scrum Master & Fullstack Developer - [GitHub](https://github.com/EzePacheco) | [LinkedIn](https://www.linkedin.com/in/ezepacheco-dev/)
- **Andres Chaile** - Backend Developer - [GitHub](https://github.com/andres777c) | [LinkedIn](https://www.linkedin.com/in/andres-chaile-491a6127b/)
- **Yanina Paez** - Frontend Developer - [GitHub](https://github.com/Yani02-gif) | [LinkedIn](https://www.linkedin.com/in/yanina-paez-1100582bb)

---

Para reportar problemas o sugerencias, abrir un issue en el repositorio.
