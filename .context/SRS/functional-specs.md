# Functional Specifications: SolarFlow
---
## EPIC-SOLAR-001: Autenticación y Seguridad de Cuenta
**FR-001: El sistema debe permitir el registro de nuevos usuarios.**
-   **Relacionado a:** EPIC-SOLAR-001, US 1.1
-   **Input:**
-   `email` (string, formato RFC 5322, max 254 chars)
-   `password` (string, min 8 chars, 1 mayúscula, 1 número)
-   **Processing:**
1.  Validar el formato del `email` y la fortaleza del `password` según las reglas.
2.  Verificar que el `email` no exista previamente en la base de datos de usuarios
       (Supabase Auth).
3.  Llamar al servicio de autenticación (Supabase) para crear el nuevo usuario.
-   **Output:**
-   **Success (201):** Objeto de sesión del usuario, incluyendo un access_token (JWT).
-   **Error (400):** Mensaje indicando si el email es inválido, el password es débil o
       el email ya está en uso.
-   **Validations:**
-   El campo `email` es obligatorio.
-   El campo `password` es obligatorio.
-   El email debe ser único en el sistema.
**FR-002: El sistema debe permitir el inicio de sesión de usuarios existentes.**
-   **Relacionado a:** EPIC-SOLAR-001, US 1.2
-   **Input:**
-   `email` (string)
-   `password` (string)
-   **Processing:**
1.  Validar que los campos no estén vacíos.
2.  Llamar al servicio de autenticación (Supabase) para verificar las credenciales.
-   **Output:**
-   **Success (200):** Objeto de sesión del usuario, incluyendo un access_token (JWT).
-   **Error (400/401):** Mensaje de "Credenciales inválidas".
-   **Validations:**
-   Ambos campos `email` y `password` son obligatorios.
**FR-003: El sistema debe proveer una funcionalidad de recuperación de contraseña.**
-   **Relacionado a:** EPIC-SOLAR-001, US 1.3
-   **Input:**
-   `email` (string)
-   **Processing:**
1.  Validar el formato del `email`.
2.  Verificar que el `email` exista en la base de datos.
3.  Llamar al servicio de autenticación (Supabase) para iniciar el flujo de reseteo de
       contraseña (enviar un email con un enlace mágico).
-   **Output:**
-   **Success (200):** Mensaje genérico: "Si existe una cuenta con este email, recibir
       un correo para restablecer tu contraseña."
-   **Validations:**
-   El campo `email` es obligatorio.
**FR-004: El sistema debe permitir el cierre de sesión.**
-   **Relacionado a:** EPIC-SOLAR-001, US 1.4
-   **Input:**
-   `access_token` (JWT) del usuario autenticado.
-   **Processing:**
1.  Llamar al servicio de autenticación (Supabase) para invalidar la sesión/token.
2.  Limpiar cualquier dato de sesión del lado del cliente.
-   **Output:**
-   **Success (200):** Mensaje de "Sesión cerrada con éxito".
-   **Validations:**
-   El usuario debe estar autenticado para poder cerrar sesión.
---
## EPIC-SOLAR-002: Gestión de Entidades (Clientes y Empresas)
**FR-005: El sistema debe permitir las operaciones CRUD para Clientes.**
-   **Relacionado a:** EPIC-SOLAR-002, US 2.1
-   **Input:**
-   **Create/Update:** Objeto `cliente` con `nombre` (string, requerido), `direccion`
       (string), `telefono` (string).
-   **Read/Delete:** `clienteId` (UUID).
-   **Processing:**
-   **Create:** Insertar un nuevo registro en la tabla `clientes`, asociado al `userId
       del usuario autenticado.
-   **Read:** Obtener todos los clientes asociados al `userId`. Obtener un cliente por
       su `clienteId`, verificando que pertenece al usuario.
-   **Update:** Actualizar un cliente existente, verificando que pertenece al usuario.
-   **Delete:** Eliminar un cliente, verificando que pertenece al usuario.
-   **Output:**
-   **Success (200/201):** El objeto(s) del cliente. Para Delete, un mensaje de éxito.
-   **Error (400/403/404):** Mensajes de validación, error de permisos o "no
       encontrado".
-   **Validations:**
-   El `nombre` es obligatorio.
-   Todas las operaciones deben estar protegidas por RLS (Row Level Security) para que
       un usuario solo pueda acceder a sus propios clientes.
**FR-006: El sistema debe permitir las operaciones CRUD para Empresas Contratantes.**
-   **Relacionado a:** EPIC-SOLAR-002, US 2.2
-   **Input:**
-   **Create/Update:** Objeto `empresa` con `nombre` (string, requerido),
       `contacto_responsable` (string), `telefono_contacto` (string).
-   **Read/Delete:** `empresaId` (UUID).
-   **Processing:**
-   Lógica CRUD similar a la de Clientes (FR-005), operando sobre la tabla `empresas`
       asegurando la pertenencia al `userId`.
-   **Output:**
-   Similar a FR-005.
-   **Validations:**
-   El `nombre` es obligatorio.
-   Todas las operaciones deben estar protegidas por RLS.
---
## EPIC-SOLAR-003: Gestión de Trabajos de Instalación (Core)
**FR-007: El sistema debe permitir la creación de un nuevo trabajo.**
-   **Relacionado a:** EPIC-SOLAR-003, US 3.1
-   **Input:**
-   Objeto `trabajo` con `clienteId` (UUID, requerido), `empresaId` (UUID, opcional),
       `fecha` (date, requerido), `hora` (time, requerido), `ubicacion` (string, opcional),
       `estado` (string, por defecto "Agendado").
-   **Processing:**
1.  Validar que los campos requeridos estén presentes.
2.  Verificar que `clienteId` y `empresaId` (si existe) pertenecen al `userId`
       autenticado.
3.  Insertar el nuevo registro en la tabla `trabajos`, asociado al `userId`.
-   **Output:**
-   **Success (201):** El objeto del trabajo creado.
-   **Error (400):** Mensaje de error de validación.
-   **Validations:**
-   `clienteId`, `fecha` y `hora` son obligatorios.
**FR-008: El sistema debe permitir listar trabajos.**
-   **Relacionado a:** EPIC-SOLAR-003, US 3.2
-   **Input:**
-   Opcional: filtros por `estado`, rango de fechas.
-   **Processing:**
-   Consultar la tabla `trabajos` filtrando por el `userId` del usuario autenticado y
       aplicando los filtros opcionales.
-   **Output:**
-   **Success (200):** Un array de objetos de trabajo.
-   **Validations:**
-   La consulta debe estar protegida por RLS.
**FR-009: El sistema debe permitir la edición de un trabajo.**
-   **Relacionado a:** EPIC-SOLAR-003, US 3.3
-   **Input:**
-   `trabajoId` (UUID).
-   Objeto `trabajo` con los campos a actualizar.
-   **Processing:**
-   Actualizar el trabajo en la tabla `trabajos`, verificando que el registro pertenec
       al `userId`.
-   **Output:**
-   **Success (200):** El objeto del trabajo actualizado.
-   **Validations:**
-   El usuario solo puede editar sus propios trabajos.
**FR-010: El sistema debe permitir asociar materiales y mano de obra a un trabajo.**
-   **Relacionado a:** EPIC-SOLAR-003, US 3.4
-   **Input:**
-   `trabajoId` (UUID).
-   `itemId` (UUID del material o mano de obra del catálogo).
-   `cantidad` (number).
-   **Processing:**
-   Crear un registro en una tabla asociativa `trabajos_items` que relacione el trabaj
       el item y la cantidad.
-   Verificar que `trabajoId` y `itemId` pertenecen al usuario.
-   **Output:**
-   **Success (201):** El objeto de la asociación creada.
-   **Error (400):** Mensaje de error de validación.
-   **Validations:**
-   `trabajoId`, `itemId` y `cantidad` son obligatorios.
**FR-011: El sistema debe permitir cambiar el estado de un trabajo.**
-   **Relacionado a:** EPIC-SOLAR-003, US 3.5
-   **Input:**
-   `trabajoId` (UUID).
-   `estado` (string, debe ser uno de los valores predefinidos: "Agendado", "En
       Progreso", "Completado", "Cancelado").
-   **Processing:**
-   Actualizar el campo `estado` del trabajo correspondiente, verificando la
       pertenencia.
-   **Output:**
-   **Success (200):** El objeto del trabajo actualizado.
-   **Validations:**
-   El `estado` debe ser uno de los valores permitidos.
---
*Nota: Los FR para las Épicas 004, 005 y 006 seguirían esta misma estructura detallada,
       derivándose de sus respectivas User Stories.*
