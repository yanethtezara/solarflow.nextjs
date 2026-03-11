# Como Javi (instalador), quiero poder registrarme en la plataforma usando mi email y una contraseña para tener una cuenta segura y privada.

**Jira Key:** SOL-11
**Epic:** SOL-10 (Autenticación y Seguridad de Cuenta)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** Javi (instalador)
**I want to** poder registrarme en la plataforma usando mi email y una contraseña
**So that** tener una cuenta segura y privada

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

-   Formulario de registro con campos para email y contraseña.
-   Validación de formato de email en el cliente (antes de enviar) y en el servidor.
-   Validación de la fortaleza de la contraseña según las reglas del negocio (mínimo 8 caracteres, 1 mayúscula, 1 número).
-   Creación del registro de usuario en la tabla `auth.users` de Supabase.
-   Redirección automática a la página principal (dashboard) tras un registro exitoso.

### Out of Scope

-   Registro utilizando proveedores de OAuth (Google, GitHub, etc.).
-   Envío de un correo de verificación de email.
-   Implementación de CAPTCHA para prevenir registros de bots.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Registro exitoso de un nuevo usuario

-   **Given:** un usuario no registrado se encuentra en la página de registro
-   **When:** introduce un email válido y no existente como "nuevo.usuario@test.com" y una contraseña segura
-   **And:** hace clic en el botón "Crear Cuenta"
-   **Then:** el sistema crea una nueva cuenta de usuario en la base de datos
-   **And:** redirige al usuario al dashboard principal
-   **And:** muestra un mensaje de bienvenida como "¡Bienvenido a SolarFlow!"

### Scenario: Intento de registro con un email ya existente

-   **Given:** un usuario con el email "usuario.existente@test.com" ya está registrado
-   **And:** un nuevo usuario intenta registrarse con "usuario.existente@test.com"
-   **When:** hace clic en el botón "Crear Cuenta"
-   **Then:** el sistema muestra un mensaje de error en línea: "Este email ya está en uso."
-   **And:** no se crea una nueva cuenta
-   **And:** el usuario permanece en la página de registro

### Scenario: Intento de registro con contraseña insegura

-   **Given:** un usuario no registrado se encuentra en la página de registro
-   **When:** introduce un email válido
-   **And:** introduce una contraseña corta como "12345"
-   **And:** hace clic en el botón "Crear Cuenta"
-   **Then:** el sistema muestra un mensaje de error: "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número."
-   **And:** no se crea una nueva cuenta

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

-   El email debe ser único en el sistema.
-   La contraseña debe cumplir con los requisitos mínimos de seguridad.

---

## Technical Notes

### Frontend

-   Creación de un componente `RegistrationForm` que maneje el estado de los campos email y contraseña.
-   Uso de librería de validación (ej. Zod) para validar el formato de email y la fortaleza de la contraseña en el cliente.
-   Manejo de estados de carga y error en la UI.

### Backend

-   API Route para `/api/auth/register` que reciba email y contraseña.
-   Llamada a `supabase.auth.signUp()` para crear el usuario.
-   Manejo de errores específicos de Supabase (ej. email ya existe).

### Database

-   La creación de usuarios se gestiona directamente a través de Supabase Auth, que utiliza la tabla `auth.users`.
-   No se requiere manipulación directa de SQL para esta operación.

---

## Dependencies

### Blocked By

-   Ninguna.

### Blocks

-   STORY-SOL-XX - User Login (una vez que se crea un usuario, puede iniciar sesión).

---

## Definition of Done

-   [ ] Código implementado y funcionando
-   [ ] Tests unitarios (coverage > 80%) para el componente `RegistrationForm` y la lógica de la API Route.
-   [ ] Tests de integración para la API Route de registro, incluyendo validaciones.
-   [ ] Tests E2E (Playwright) para el flujo completo de registro.
-   [ ] Code review aprobado (2 reviewers)
-   [ ] Documentación actualizada (README, API docs si aplica)
-   [ ] Deployed to staging
-   [ ] QA testing passed
-   [ ] Acceptance criteria validated
-   [ ] No critical/high bugs open

---

## Notes

Es crucial que el feedback al usuario sobre errores de validación (email ya existe, contraseña débil) sea claro y amigable.

---

## Related Documentation

-   **Epic:** `.context/PBI/epics/EPIC-SOL-10-autenticacion-seguridad/epic.md`
-   **PRD:** `.context/PRD/user-journeys.md` (Journey 1: Step 1, Step 2)
-   **SRS:** `.context/SRS/functional-specs.md` (FR-001)
-   **API Contracts:** `.context/SRS/api-contracts.yaml` (`/auth/register` endpoint)
