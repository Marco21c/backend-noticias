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
│   │   └── news.controller.ts  # Controladores de noticias
│   ├── interfaces/
│   │   └── news.interface.ts   # Interfaces TypeScript
│   ├── models/
│   │   └── news.model.ts       # Modelo Mongoose
│   ├── routes/
│   │   ├── main.routes.ts      # Rutas principales
│   │   └── news.route.ts       # Rutas de noticias
│   └── services/
│       └── news.services.ts    # Lógica de negocio
├── dist/                      # Código compilado (generado)
├── index.ts                   # Punto de entrada
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

## 🔌 Endpoints de la API

Todos los endpoints están bajo el prefijo `/api/news`.

### Obtener todas las noticias

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
    "author": "Nombre del autor",
    "category": "technology",
    "variant": "default",
    "status": "published",
    "publicationDate": "2024-01-15T10:00:00.000Z",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
]
```

### Obtener noticia por ID

```http
GET /api/news/:id
```

### Obtener noticias por categoría

```http
GET /api/news/category?category=technology
```

**Categorías disponibles:**
- `politic`, `economy`, `sports`, `technology`, `health`, `entertainment`, `science`, `world`, `local`, `education`, `travel`, `lifestyle`, `international`

### Crear una noticia

```http
POST /api/news
Content-Type: application/json
```

**Body (ejemplo):**
```json
{
  "title": "Nueva noticia tecnológica",
  "slug": "nueva-noticia-tecnologica",
  "summary": "Resumen de la noticia",
  "content": "Contenido completo de la noticia...",
  "highlights": ["Punto destacado 1", "Punto destacado 2"],
  "author": "Juan Pérez",
  "category": "technology",
  "variant": "default",
  "status": "published",
  "mainImage": "https://ejemplo.com/imagen.jpg",
  "source": "Fuente de la noticia"
}
```

### Actualizar una noticia

```http
PUT /api/news?_id=64f...
Content-Type: application/json
```

**Body (ejemplo):**
```json
{
  "title": "Título actualizado",
  "summary": "Resumen actualizado",
  "status": "published"
}
```

**Nota**: El `_id` puede enviarse como query parameter (`?_id=...`) o en el body.

### Eliminar una noticia

```http
DELETE /api/news/:id
```

## 📊 Modelo de Datos

### Campos de la Noticia

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `title` | String | ✅ | Título de la noticia |
| `slug` | String | ✅ | URL amigable (único) |
| `summary` | String | ✅ | Resumen breve |
| `content` | String | ✅ | Contenido completo |
| `highlights` | String[] | ❌ | Array de puntos destacados |
| `author` | String | ✅ | Nombre del autor |
| `category` | Enum | ✅ | Categoría de la noticia |
| `variant` | Enum | ✅ | Variante (highlighted, featured, default) |
| `status` | Enum | ❌ | Estado (draft, published) |
| `mainImage` | String | ❌ | URL de imagen principal |
| `source` | String | ❌ | Fuente de la noticia |
| `publicationDate` | Date | ❌ | Fecha de publicación (default: ahora) |
| `createdAt` | Date | Auto | Fecha de creación |
| `updatedAt` | Date | Auto | Fecha de actualización |

## 🔧 Configuración Avanzada

### Variables de Entorno por Entorno

El sistema valida automáticamente las variables según el entorno:

- **Desarrollo**: Requiere `MONGODB_DEV`
- **Producción**: Requiere `MONGODB_URI`

### CORS

La configuración de CORS permite:
- Orígenes definidos en `CLIENT_URL`, `CLIENT_DEV_URL`, `APP_URL`
- En desarrollo, permite todos los orígenes
- Credenciales habilitadas
- Métodos: GET, POST, PUT, DELETE

## 🧪 Próximos Pasos Sugeridos

- [ ] Añadir autenticación y autorización (JWT)
- [ ] Implementar validación de entrada con middleware
- [ ] Añadir tests unitarios y de integración
- [ ] Implementar paginación en los endpoints GET
- [ ] Añadir búsqueda y filtros avanzados
- [ ] Implementar subida de imágenes
- [ ] Añadir logging estructurado
- [ ] Documentación con Swagger/OpenAPI

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
