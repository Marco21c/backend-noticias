# backend-noticias

**Proyecto**: API REST para gestión de noticias (Node.js + TypeScript + Express + MongoDB).

**Descripción**: Este repositorio contiene el backend de una aplicación de noticias. Permite crear, leer, actualizar y eliminar noticias; filtrar por categoría y exponer endpoints REST consumibles por un frontend.

**Requisitos**
- Node.js (>= 16 recomendado)
- npm o yarn
- MongoDB (local o conexión remota)

**Instalación**
1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno creando un archivo `.env` en la raíz con (ejemplo):

```env
MONGODB_URI=mongodb://localhost/noticiasdb
PORT=3000
```

3. Iniciar la aplicación:

```bash
npm start
# o si existe script de desarrollo
npm run dev
```

**Conexión a la base de datos**
- Archivo: [src/config/database.ts](src/config/database.ts)
- Lee `MONGODB_URI` y conecta mongoose al arranque.

**Estructura principal**
- [index.ts](index.ts) — punto de entrada del servidor.
- [package.json](package.json) — dependencias y scripts.
- [tsconfig.json](tsconfig.json) — configuración TypeScript.
- [src/config/database.ts](src/config/database.ts) — configuración de mongoose.
- [src/models/news.model.ts](src/models/news.model.ts) — esquema Mongoose para noticias.
- [src/interfaces/news.interface.ts](src/interfaces/news.interface.ts) — interfaz TypeScript `INews`.
- [src/services/news.services.ts](src/services/news.services.ts) — lógica de acceso a datos (CRUD).
- [src/controllers/news.controller.ts](src/controllers/news.controller.ts) — controladores que manejan las peticiones.
- [src/routes/news.route.ts](src/routes/news.route.ts) — rutas de noticias.
- [src/routes/main.routes.ts](src/routes/main.routes.ts) — rutas principales / mounting.

**Modelo de datos (resumen)**
- Interfaz: [src/interfaces/news.interface.ts](src/interfaces/news.interface.ts)
- Campos principales:
  - `title`: string (requerido)
  - `slug`: string (requerido, único)
  - `summary`: string (requerido)
  - `content`: string (requerido)
  - `highlights`: string[]
  - `author`: string (requerido)
  - `category`: enum (politic, economy, sports, technology, health, entertainment, science, world, local, education, travel, lifestyle, international)
  - `variant`: enum (highlighted, featured, default)
  - `status`: enum (draft, published)
  - `publicationDate`: Date

Schema Mongoose: ver [src/models/news.model.ts](src/models/news.model.ts)

**Endpoints principales (prefijo asumido: `/api/news`)**
- `GET /api/news` — Obtener todas las noticias.
- `POST /api/news` — Crear una noticia. Enviar JSON con los campos definidos en `INews`.
- `GET /api/news/:id` — Obtener noticia por id.
- `GET /api/news/category?category=<categoria>` — Obtener noticias por categoría.
- `PUT /api/news` — Editar noticia. Ruta registrada como `PUT /` en [src/routes/news.route.ts](src/routes/news.route.ts); el controller `editNews` acepta el id desde `req.params.id` o desde `req.query._id`. Ejemplo de uso con query:

```bash
curl -X PUT "http://localhost:3000/api/news?_id=64f..." \
  -H "Content-Type: application/json" \
  -d '{ "title":"Título actualizado", "summary":"Resumén nuevo" }'
```

- `DELETE /api/news/:id` — Eliminar noticia por id.

Controladores y servicios
- Lógica de negocio y consultas en [src/services/news.services.ts](src/services/news.services.ts).
- Control de rutas y validaciones básicas en [src/controllers/news.controller.ts](src/controllers/news.controller.ts).

Notas de implementación relevantes
- El controlador `editNews` intenta resolver el id desde distintos orígenes: `req.params.id`, `req.query._id` (puede venir como array en algunos clientes). Asegúrate de proporcionar `_id` como query si llamas a `PUT /api/news`.
- El esquema de Mongoose define enums y valores por defecto; revisa [src/models/news.model.ts](src/models/news.model.ts) para cambios de validación o nuevos campos.

Próximos pasos sugeridos
- Añadir validaciones de entrada (ej. usando `express-validator` o `zod`).
- Añadir autenticación/autorización si es necesario para crear/editar/eliminar.
- Añadir tests unitarios y de integración.

¿Quieres que haga alguno de estos siguientes pasos (agregar validaciones, scripts de start/ dev, o preparar pruebas)?

## Scripts disponibles
- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm start`: Inicia el servidor en produccion 

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## 👥 Equipo de Trabajo

Proyecto desarrollado por un equipo de **4 desarrolladores**, con roles definidos para simular un entorno profesional real.

| Nombre | GitHub | LinkedIn |
|------|--------|----------|
| Andres Chaile | [GitHub](https://github.com/andres777c) | [LinkedIn](https://linkedin.com/in/usuario) |
| Marcos Condori | [GitHub](https://github.com/Marco21c) | [LinkedIn](https://www.linkedin.com/in/marcos-condori-23c/) |
| Leonardo Alcedo| [GitHub](https://github.com/leo99902) | [LinkedIn](https://www.linkedin.com/in/leonardo-alcedo-006189363/) |
| Ezequiel Pacheco | [GitHub](https://github.com/EzePacheco) | [LinkedIn](https://www.linkedin.com/in/ezepacheco-dev/) |
