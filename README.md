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
- Filtrado por categoría, autor y estado
- Validación de variables de entorno con Zod
- Arquitectura modular (MVC pattern)
- Configuración de CORS para múltiples entornos

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

# JWT
JWT_SECRET=tu_secreto_jwt_minimo_32_caracteres_aqui
JWT_EXPIRES_IN=7d
```

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
│   │   ├── news.controller.ts
│   │   └── users.controller.ts
│   ├── interfaces/      # Interfaces TypeScript
│   ├── middlewares/     # Middlewares
│   │   └── auth.middleware.ts
│   ├── models/          # Modelos Mongoose
│   │   ├── news.model.ts
│   │   └── user.model.ts
│   ├── routes/          # Rutas de la API
│   ├── scripts/         # Scripts de utilidad
│   │   ├── createSuperAdmin.ts
│   │   └── deleteSuperAdmin.ts
│   └── services/        # Lógica de negocio
├── dist/                # Código compilado
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

## Modelo de Datos

### Usuario

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | String | ✅ | Email único |
| `password` | String | ✅ | Contraseña encriptada |
| `name` | String | ✅ | Nombre |
| `lastName` | String | ✅ | Apellido |
| `role` | Enum | ✅ | superadmin, admin, editor, user |
| `createdAt` | Date | Auto | Fecha de creación |
| `updatedAt` | Date | Auto | Fecha de actualización |

### Noticia

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `title` | String | ✅ | Título de la noticia |
| `slug` | String | ✅ | URL amigable (único) |
| `summary` | String | ✅ | Resumen breve |
| `content` | String | ✅ | Contenido completo |
| `highlights` | String[] | ❌ | Puntos destacados |
| `author` | ObjectId | Auto | Referencia al usuario |
| `category` | Enum | ✅ | Categoría |
| `variant` | Enum | ✅ | highlighted, featured, default |
| `status` | Enum | ❌ | draft, published |
| `mainImage` | String | ❌ | URL de imagen |
| `source` | String | ❌ | Fuente |
| `publicationDate` | Date | ❌ | Fecha de publicación |

## Roles de Usuario

El sistema implementa cuatro niveles de acceso:

- **Superadmin**: Acceso completo, incluyendo gestión de usuarios
- **Admin**: Gestión completa de noticias
- **Editor**: Creación y edición de noticias
- **User**: Solo lectura

## Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación mediante JWT
- Tokens con expiración configurable
- Middleware de autenticación para rutas protegidas
- Validación de roles para endpoints sensibles
- CORS configurado para orígenes específicos

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
- **Leonardo Alcedo** - Backend Developer - [GitHub](https://github.com/leo99902) | [LinkedIn](https://www.linkedin.com/in/leonardo-alcedo-45a83027b/)
- **Yanina Paez** - Frontend Developer - [GitHub](https://github.com/Yani02-gif) | [LinkedIn](https://www.linkedin.com/in/yanina-paez-1100582bb)

---

Para reportar problemas o sugerencias, abrir un issue en el repositorio.
