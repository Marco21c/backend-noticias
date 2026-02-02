# 📰 Backend Noticias

API REST desarrollada con Node.js, TypeScript, Express y MongoDB para la gestión completa de noticias. Proporciona endpoints para crear, leer, actualizar y eliminar noticias, con soporte para filtrado por categoría y gestión de estados de publicación.

## 📋 Descripción

Este proyecto es el backend de una aplicación de gestión de noticias que permite:

- **CRUD completo** de noticias (Crear, Leer, Actualizar, Eliminar)
- **Filtrado por categoría** para organizar contenido
- **Gestión de estados** (borrador/publicado)
- **Variantes de noticias** (destacadas, destacadas principales, por defecto)
- **Validación de variables de entorno** con Zod
- **Configuración de CORS** para desarrollo y producción
- **Arquitectura escalable** con separación de responsabilidades (controllers, services, models)

## ✨ Características

- 🚀 **TypeScript** para tipado estático y mejor desarrollo
- 🔒 **Validación de entorno** con Zod
- 🗄️ **MongoDB** con Mongoose para persistencia de datos
- 🌐 **Express.js** para el servidor HTTP
- 🔄 **CORS configurado** para múltiples entornos
- 📦 **Arquitectura modular** (MVC pattern)
- ⚡ **Hot reload** en desarrollo con `tsx watch`

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 16.x (recomendado 18.x o superior)
- **npm** o **yarn** como gestor de paquetes
- **MongoDB** (local o remoto)
  - Local: MongoDB Community Server
  - Remoto: MongoDB Atlas o cualquier instancia de MongoDB

## 📦 Instalación

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

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Entorno
NODE_ENV=development

# Puertos
PORT=3000
PORT_DEV=3000
PORT_PROD=3000

# Base de datos
# Para desarrollo (obligatorio si NODE_ENV=development)
MONGODB_DEV=mongodb://localhost:27017/noticiasdb
# Para producción (obligatorio si NODE_ENV=production)
MONGODB_URI=mongodb://usuario:password@host:puerto/noticiasdb

# URLs del cliente (opcionales, para CORS)
CLIENT_URL=http://localhost:5173
CLIENT_DEV_URL=http://localhost:5173
APP_URL=http://localhost:3000

# JWT (opcional, para futuras funcionalidades)
JWT_SECRET=tu_secreto_jwt_minimo_32_caracteres_aqui
JWT_EXPIRES_IN=7d
```

**Nota**: Si usas MongoDB local en el puerto por defecto (27017), puedes usar:
```env
MONGODB_DEV=mongodb://localhost:27017/noticiasdb
```

### 4. Verificar la conexión a MongoDB

Asegúrate de que MongoDB esté corriendo:

```bash
# En Windows (si MongoDB está instalado como servicio, debería iniciarse automáticamente)
# Verifica con:
mongosh

# En Linux/Mac
sudo systemctl start mongod
# o
brew services start mongodb-community
```

## 🚀 Uso

### Modo Desarrollo

Inicia el servidor en modo desarrollo con hot reload:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000` (o el puerto configurado en `PORT_DEV`).

### Modo Producción

1. Compilar el proyecto:

```bash
npm run build
```

2. Iniciar el servidor:

```bash
npm start:prod
```

O simplemente:

```bash
npm start
```

### Otros Scripts Disponibles

```bash
# Verificar tipos TypeScript sin compilar
npm run type-check

# Iniciar en modo desarrollo con variables de entorno explícitas
npm run start:dev
```

## 📁 Estructura del Proyecto

```
backend-noticias/
├── src/
│   ├── config/
│   │   ├── cors.ts          # Configuración de CORS
│   │   ├── database.ts      # Conexión a MongoDB
│   │   └── env.ts           # Validación de variables de entorno
│   ├── controllers/
│   │   ├── auth.controller.ts    # Controladores de autenticación
│   │   ├── news.controller.ts    # Controladores de noticias
│   │   └── user.controller.ts    # Controladores de usuarios
│   ├── interfaces/
│   │   ├── login.interface.ts    # Interfaz de login
│   │   ├── news.interface.ts     # Interfaces de noticias
│   │   └── user.interface.ts     # Interfaces de usuarios
│   ├── middlewares/
│   │   └── auth.middleware.ts    # Middleware de autenticación
│   ├── models/
│   │   ├── news.model.ts         # Modelo Mongoose de noticias
│   │   └── user.model.ts         # Modelo Mongoose de usuarios
│   ├── routes/
│   │   ├── auth.route.ts         # Rutas de autenticación
│   │   ├── main.routes.ts        # Rutas principales
│   │   ├── news.route.ts         # Rutas de noticias
│   │   └── user.route.ts         # Rutas de usuarios
│   └── services/
│       ├── auth.services.ts      # Servicios de autenticación
│       ├── news.services.ts      # Servicios de noticias
│       └── user.services.ts      # Servicios de usuarios
├── dist/                        # Código compilado (generado)
├── index.ts                     # Punto de entrada
├── .env                         # Variables de entorno (no incluir en git)
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

## � Modelo de Datos

### Modelo de Noticia

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | ObjectId | Auto | Identificador único de MongoDB |
| `title` | String | ✅ | Título de la noticia |
| `slug` | String | ✅ | URL amigable (único) |
| `summary` | String | ✅ | Resumen breve |
| `content` | String | ✅ | Contenido completo |
| `highlights` | String[] | ❌ | Array de puntos destacados |
| `author` | ObjectId | ✅ | Referencia al usuario (ID) |
| `category` | Enum | ✅ | Categoría: `politic`, `economy`, `sports`, `technology`, `health`, `entertainment`, `science`, `world`, `local`, `education`, `travel`, `lifestyle`, `international` |
| `variant` | Enum | ✅ | Tipo: `highlighted`, `featured`, `default` |
| `status` | Enum | ❌ | Estado: `draft`, `in_review`, `approved`, `published`, `rejected` |
| `mainImage` | String | ❌ | URL de imagen principal |
| `source` | String | ❌ | Fuente de la noticia |
| `publicationDate` | Date | ❌ | Fecha de publicación (default: ahora) |
| `createdAt` | Date | Auto | Fecha de creación |
| `updatedAt` | Date | Auto | Fecha de actualización |

### Modelo de Usuario

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | ObjectId | Auto | Identificador único de MongoDB |
| `email` | String | ✅ | Email único en minúsculas |
| `password` | String | ✅ | Contraseña hasheada |
| `role` | Enum | ✅ | Rol: `admin`, `editor`, `user` |
| `name` | String | ❌ | Nombre del usuario |
| `lastName` | String | ❌ | Apellido del usuario |
| `createdAt` | Date | Auto | Fecha de creación |
| `updatedAt` | Date | Auto | Fecha de actualización |

---

## �🔌 Endpoints de la API

### Endpoints de Autenticación

#### Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Body (ejemplo):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

---

### Endpoints de Noticias

#### Obtener todas las noticias (público)

```http
GET /api/news
```

**Respuesta exitosa (200):**
```json
[
  {
    "_id": "...",
    "title": "Título de la noticia",
    "slug": "titulo-de-la-noticia",
    "summary": "Resumen de la noticia",
    "content": "Contenido completo...",
    "highlights": ["punto 1", "punto 2"],
    "author": "64f...",
    "category": "technology",
    "variant": "default",
    "status": "published",
    "mainImage": "https://ejemplo.com/imagen.jpg",
    "source": "Fuente de la noticia",
    "publicationDate": "2024-01-15T10:00:00.000Z",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
]
```

#### Obtener noticia por ID (público)

```http
GET /api/news/:id
```

#### Obtener noticias por categoría (público)

```http
GET /api/news/category?category=technology
```

**Categorías disponibles:**
- `politic`, `economy`, `sports`, `technology`, `health`, `entertainment`, `science`, `world`, `local`, `education`, `travel`, `lifestyle`, `international`

#### Crear una noticia (autenticado - editor/admin)

```http
POST /api/news
Content-Type: application/json
Authorization: Bearer <token>
```

**Body (ejemplo):**
```json
{
  "title": "Nueva noticia tecnológica",
  "slug": "nueva-noticia-tecnologica",
  "summary": "Resumen de la noticia",
  "content": "Contenido completo de la noticia...",
  "highlights": ["Punto destacado 1", "Punto destacado 2"],
  "author": "64f...",
  "category": "technology",
  "variant": "default",
  "status": "draft",
  "mainImage": "https://ejemplo.com/imagen.jpg",
  "source": "Fuente de la noticia"
}
```

#### Actualizar una noticia (autenticado - editor/admin)

```http
PUT /api/news
Content-Type: application/json
Authorization: Bearer <token>
```

**Body (ejemplo):**
```json
{
  "_id": "64f...",
  "title": "Título actualizado",
  "summary": "Resumen actualizado",
  "status": "published"
}
```

#### Eliminar una noticia (autenticado - editor/admin)

```http
DELETE /api/news/:id
Authorization: Bearer <token>
```

---
### Filtros de Noticias

Los endpoints de noticias soportan los siguientes filtros como query parameters:

- **`status`**: Filtra noticias por estado (`draft`, `in_review`, `approved`, `published`, `rejected`)
  ```http
  GET /api/news?status=published
  ```

- **`author`**: Filtra noticias por ID del autor (ObjectId)
  ```http
  GET /api/news?author=64f...
  ```

- **Combinados**: Puedes usar ambos filtros juntos
  ```http
  GET /api/news?status=published&author=64f...
  ```

- **`category`**: Filtra por categoría (endpoint dedicado)
  ```http
  GET /api/news/category?category=technology
  ```

### Endpoints de Usuarios

#### Obtener todos los usuarios

```http
GET /api/users
```

#### Obtener usuario por ID

```http
GET /api/users/:id
```

#### Crear un usuario

```http
POST /api/users
Content-Type: application/json
```

**Body (ejemplo):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña_segura",
  "name": "Juan",
  "lastName": "Pérez",
  "role": "user"
}
```

#### Actualizar usuario

```http
PUT /api/users/:id
Content-Type: application/json
```

**Body (ejemplo):**
```json
{
  "name": "Juan",
  "lastName": "García",
  "role": "editor"
}
```

#### Eliminar usuario

```http
DELETE /api/users/:id
```



---

## ✅ Características Implementadas

### 🔐 Autenticación y Autorización (JWT)

Se ha implementado un sistema completo de autenticación basado en JWT con protección de endpoints.

**Componentes implementados:**

- **AuthService** ([src/services/auth.services.ts](src/services/auth.services.ts)): Maneja la lógica de autenticación
  - Generación y verificación de tokens JWT
  - Validación de credenciales de usuario
  - Recuperación de información del usuario desde el token

- **Middleware de Autenticación** (`authenticate`) en [src/middlewares/auth.middleware.ts](src/middlewares/auth.middleware.ts):
  - Extrae el token del header `Authorization: Bearer <token>`
  - Verifica la validez del token
  - Maneja errores de tokens expirados o inválidos
  - Inyecta la información del usuario en la request

- **Middleware de Autorización** (`requireRole`) en [src/middlewares/auth.middleware.ts](src/middlewares/auth.middleware.ts):
  - Valida que el usuario tenga los roles requeridos (`admin`, `editor`, `user`)
  - Se aplica a endpoints protegidos (crear, editar, eliminar noticias)
  - Retorna error 403 si el usuario no tiene permisos suficientes

**Ejemplo de uso en rutas:**
```typescript
// Crear noticia: requiere estar autenticado y tener rol editor o admin
router.post('/', authenticate, requireRole('editor', 'admin'), newsController.createNews);

// Eliminar noticia: requiere estar autenticado y tener rol editor o admin
router.delete('/:id', authenticate, requireRole('editor', 'admin'), newsController.deleteNews);
```

---

### ✔️ Validación de Entrada con Middleware

Se implementó validación robusta de entrada en toda la aplicación:

**Validación de Variables de Entorno** ([src/config/env.ts](src/config/env.ts)) con Zod:
- Valida todas las variables de entorno al iniciar la aplicación
- Proporciona mensajes de error específicos y claros
- Asegura que las variables requeridas estén presentes según el entorno
- Tipos y valores por defecto para cada variable

**Validación en Controllers** ([src/controllers/](src/controllers/)):
- Verificación de parámetros (IDs válidos)
- Validación de tipos de query parameters
- Manejo de errores y respuestas consistentes
- Validación de datos en el body de requests

**Ejemplos en endpoints:**
- `getNewsById`: Valida que el ID sea una cadena válida
- `getNewsByCategory`: Valida que la categoría sea válida
- `createNews`: Valida que el usuario esté autenticado
- Filtros de noticias: Convierte y valida tipos de datos

**Ventajas implementadas:**
- Previene errores por datos malformados
- Proporciona respuestas de error claras al cliente
- Protege la aplicación de datos inesperados
- Facilita debugging y logging

---

## 🔧 Configuración Avanzada

### Variables de Entorno por Entorno

El sistema valida automáticamente las variables según el entorno (usando Zod):

- **Desarrollo**: Requiere `MONGODB_DEV`
- **Producción**: Requiere `MONGODB_URI`
- **Puertos**: `PORT`, `PORT_DEV`, `PORT_PROD` (default: 3000)
- **JWT**: `JWT_SECRET` (mínimo 32 caracteres), `JWT_EXPIRES_IN` (default: 7d)

### CORS

La configuración de CORS permite:
- Orígenes definidos en `CLIENT_URL`, `CLIENT_DEV_URL`, `APP_URL`
- En desarrollo, permite todos los orígenes
- Credenciales habilitadas
- Métodos: GET, POST, PUT, DELETE
- Headers permitidos: `Content-Type`, `Authorization`
- Solicitudes sin origen (Postman, curl) son permitidas


### Filtros de Noticias

Los endpoints de noticias soportan los siguientes filtros como query parameters:

- **`status`**: Filtra noticias por estado (`draft`, `in_review`, `approved`, `published`, `rejected`)
  ```http
  GET /api/news?status=published
  ```

- **`author`**: Filtra noticias por ID del autor (ObjectId)
  ```http
  GET /api/news?author=64f...
  ```

- **Combinados**: Puedes usar ambos filtros juntos
  ```http
  GET /api/news?status=published&author=64f...
  ```

- **`category`**: Filtra por categoría (endpoint dedicado)
  ```http
  GET /api/news/category?category=technology
  ```

---

## 🧪 Próximos Pasos Sugeridos
- [ ] Añadir tests unitarios y de integración
- [ ] Implementar paginación en los endpoints GET
- [ ] Añadir búsqueda de noticias avanzada
- [ ] Implementar subida de imágenes
- [ ] Añadir logging estructurado
- [ ] Documentación con Swagger/OpenAPI
- [ ] Rate limiting para endpoints
- [ ] Caché de respuestas

## 📝 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**. Consulta el archivo `LICENSE` para más detalles.

## 👥 Autores

Este proyecto es desarrollado por un equipo de **4 desarrolladores**:

| Nombre | GitHub | LinkedIn |
|--------|--------|----------|
| **Andres Chaile** | [@andres777c](https://github.com/andres777c) | [LinkedIn](https://linkedin.com/in/usuario) |
| **Marcos Condori** | [@Marco21c](https://github.com/Marco21c) | [LinkedIn](https://www.linkedin.com/in/marcos-condori-23c/) |
| **Leonardo Alcedo** | [@leo99902](https://github.com/leo99902) | [LinkedIn](https://www.linkedin.com/in/leonardo-alcedo-006189363/) |
| **Ezequiel Pacheco** | [@EzePacheco](https://github.com/EzePacheco) | [LinkedIn](https://www.linkedin.com/in/ezepacheco-dev/) |

## 🐛 Reportar Problemas

Si encuentras algún problema o tienes sugerencias, por favor abre un [issue](https://github.com/Marco21c/backend-noticias/issues) en el repositorio.

## 📚 Recursos Adicionales

- [Documentación de Express.js](https://expressjs.com/)
- [Documentación de Mongoose](https://mongoosejs.com/)
- [Documentación de TypeScript](https://www.typescriptlang.org/)
- [Documentación de MongoDB](https://www.mongodb.com/docs/)

---

⭐ Si este proyecto te resulta útil, ¡no olvides darle una estrella!
