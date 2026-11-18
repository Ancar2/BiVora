# BiVora API

API REST para un sistema de alquiler de bicicletas por estaciones. Gestiona usuarios, estaciones, bicicletas y alquileres, y calcula el costo de cada alquiler según los minutos de uso.

El frontend está en [BiVora-Front](https://github.com/Ancar2/BiVora-Front).

## Funcionalidades

Todas las rutas cuelgan de `/api`. Las operaciones de escritura requieren un token JWT, salvo el registro de usuarios y el login.

| Recurso | Endpoints |
|---|---|
| Usuarios | `GET /users`, `GET /users/:id`, `POST /users/create`, `PUT /users/update/:id`, `DELETE /users/delete/:id` |
| Estaciones | `GET /estaciones`, `GET /estaciones/:id`, `POST /estaciones/create`, `PUT /estaciones/update/:id`, `DELETE /estaciones/delete/:id` |
| Bicicletas | `GET /bicicletas` (filtro por estación), `GET /bicicletas/:id`, `POST /bicicletas/create`, `PUT /bicicletas/update/:id`, `DELETE /bicicletas/delete/:id` |
| Alquileres | `GET /alquiler`, `GET /alquiler/:id`, `POST /alquiler/create`, `PUT /alquiler/finalizar/:id` |
| Sesión | `POST /login` |
| Estado | `GET /health` |

Al finalizar un alquiler se calcula el costo multiplicando los minutos de uso por el valor de `COSTO_MINUTO`.

## Tecnologías

Node.js · Express 5 · MongoDB (Mongoose) · JWT · bcrypt

## Requisitos

- Node.js (versión LTS reciente)
- Una instancia de MongoDB accesible

## Instalación

```bash
git clone https://github.com/Ancar2/BiVora.git
cd BiVora
npm install
```

## Configuración

Crea un archivo `.env` en la raíz con estas variables:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que escucha la API |
| `DB_URL` | Cadena de conexión a MongoDB |
| `SECRET_JWT_KEY` | Clave para firmar los tokens JWT |
| `TOKEN_EXPIRE` | Tiempo de expiración del token |
| `COSTO_MINUTO` | Costo por minuto de alquiler |

## Ejecución

```bash
npm run dev   # node --watch index.js
```

## Estructura del proyecto

```text
config/       Conexión a la base de datos
controller/   Lógica de usuarios, estaciones, bicicletas, alquileres y login
middleware/   Verificación de JWT
models/       Esquemas de Mongoose (user, estacion, bicicleta, alquiler)
routes/       Definición de rutas
index.js      Arranque del servidor
```

## Autor

Andrés Cárdenas ([Ancar](https://github.com/Ancar2)) · [cardenaslabs.com](https://cardenaslabs.com/)
