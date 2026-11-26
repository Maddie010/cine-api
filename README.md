# API Cine - Práctica TAW-251

API REST para administrar las salas, la cartelera de películas, las funciones programadas y la venta de
boletos de un cine. Hecha con **NestJS + TypeORM + MySQL**, con arquitectura en N-capas
(Controller → Service → Repository), validaciones con `class-validator`, borrado lógico (soft delete),
documentación con **Scalar** y autenticación **JWT** (extra).

## Requisitos

- Node.js 18 o superior
- MySQL (por ejemplo el que trae Laragon) o PostgreSQL

## Instalación

```bash
npm install
```

Si faltara alguna dependencia:

```bash
npm i @nestjs/typeorm typeorm mysql2 @nestjs/config
npm i class-validator class-transformer
npm i @nestjs/swagger @scalar/nestjs-api-reference
npm i @nestjs/jwt bcryptjs
```

## Configuración

1. Crear una base de datos vacía llamada `cine_db`:

   ```sql
   CREATE DATABASE cine_db CHARACTER SET utf8mb4;
   ```

2. Copiar `.env.example` como `.env` y ajustar los valores:

   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=cine_db
   JWT_SECRET=cambia_este_secreto
   ```

Las tablas se crean automáticamente al iniciar la aplicación (`synchronize: true`), incluida la tabla
intermedia `pelicula_genero`.

## Ejecución

```bash
npm run start:dev
```

- API: http://localhost:3000
- Documentación (Scalar): http://localhost:3000/reference

## Entidades y relaciones

| Relación | Tipo | Implementación |
|---|---|---|
| Sala → Funcion | 1 a N | `@OneToMany` / `@ManyToOne` + `@JoinColumn` |
| Pelicula → Funcion | 1 a N | `@OneToMany` / `@ManyToOne` + `@JoinColumn` |
| Pelicula ↔ Genero | N a M **automática** | `@ManyToMany` + `@JoinTable` (TypeORM crea `pelicula_genero`, sin entidad propia) |
| Funcion ↔ Cliente | N a M **a mano** | Entidad `Boleto` con dos `@ManyToOne` y los datos de la venta (`numeroAsiento`, `precioPagado`) |

Todas las entidades tienen `creadoEn`, `actualizadoEn` y `eliminadoEn`
(`@CreateDateColumn`, `@UpdateDateColumn`, `@DeleteDateColumn`). Los `DELETE` hacen borrado lógico con `softDelete`.

## Endpoints

| Módulo | Endpoints |
|---|---|
| Salas | `GET /salas`, `GET /salas/:id` (incluye funciones), `POST`, `PATCH /:id`, `DELETE /:id` |
| Géneros | `GET /generos`, `GET /generos/:id` (incluye películas), `POST`, `PATCH /:id`, `DELETE /:id` |
| Películas | `GET /peliculas` (incluye géneros), `GET /peliculas/:id` (géneros y funciones), `POST` (acepta `idGeneros`), `PATCH /:id`, `DELETE /:id`, `POST /peliculas/:id/generos`, `DELETE /peliculas/:id/generos/:idGenero` |
| Funciones | `GET /funciones` (sala y película), `GET /funciones/:id` (sala, película y boletos), `POST`, `PATCH /:id`, `DELETE /:id` |
| Clientes | `GET /clientes`, `GET /clientes/:id` (boletos con su función), `POST`, `PATCH /:id`, `DELETE /:id` |
| Boletos | `GET /boletos`, `GET /boletos/:id` (función y cliente), `POST` (vender), `PATCH /:id`, `DELETE /:id` (anular) |
| Auth (extra) | `POST /auth/register`, `POST /auth/login` |

### Reglas de negocio de los boletos

- No se puede vender el mismo `numeroAsiento` dos veces para la misma función → `BadRequestException`.
- El `numeroAsiento` debe estar entre 1 y la capacidad de la sala de la función → `BadRequestException`.
- Si no se envía `precioPagado`, se guarda el precio de la función.
- Las mismas reglas se validan en el `PATCH`. Un boleto anulado libera su asiento.

### Manejo de errores

- `404 NotFoundException` cuando un recurso o una llave foránea del body no existe
  (ej.: `"La función con id 7 no existe"`).
- `400 BadRequestException` cuando se incumple una regla de negocio o falla una validación del DTO.
- `401 UnauthorizedException` cuando falta el token o no es válido.

## Autenticación JWT (extra)

Los endpoints `POST`, `PATCH` y `DELETE` están protegidos con un Guard; los `GET` son públicos.

1. `POST /auth/register` con `{ "username": "admin", "email": "admin@cine.com", "password": "123456" }`
   (la contraseña se guarda encriptada).
2. `POST /auth/login` con `{ "email": "admin@cine.com", "password": "123456" }` → devuelve `access_token`.
3. En Scalar, abrir **Authentication → Bearer Token** y pegar el `access_token`; o enviar el header
   `Authorization: Bearer <access_token>`.

## Estructura

```
src/
├── auth/         usuarios, registro/login, Guard JWT y decorador @Protegido
├── salas/        controller, service, entity, dto
├── generos/
├── peliculas/
├── funciones/
├── clientes/
├── boletos/
├── common/       transformer para columnas DECIMAL
├── app.module.ts
└── main.ts       ValidationPipe y Scalar
```

## Notas

- `fechaHora` se envía en formato ISO 8601 (ej.: `2026-12-15T18:30:00`) y la API la devuelve en UTC.
- `synchronize: true` es solo para desarrollo; en producción se usarían migraciones.
