# Como David (jefe de cuadrilla), quiero poder iniciar sesión con mis credenciales para acceder a la información de mis trabajos.

**Jira Key:** SOL-12
**Epic:** SOL-10 (Autenticación y Seguridad de Cuenta)
**Priority:** High
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** David (jefe de cuadrilla)
**I want to** poder iniciar sesión con mis credenciales
**So that** acceder a la información de mis trabajos

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

- Formulario de inicio de sesión con campos para email y contraseña.
- Validación de formato de email en el cliente y en el servidor.
- Autenticación contra Supabase Auth usando email y contraseña.
- Manejo de tokens de sesión (JWT) por parte de Supabase.
- Redirección al dashboard principal tras un inicio de sesión exitoso.
- Manejo de errores para credenciales inválidas.

### Out of Scope

- Inicio de sesión con proveedores de OAuth (Google, GitHub, etc.).
- Recordar sesión ("Remember me").
- Bloqueo de cuenta tras múltiples intentos fallidos.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Inicio de sesión exitoso con credenciales válidas

- **Given:** un usuario "david.rojas@test.com" con contraseña "Password123" ya registrado
- **When:** David ingresa "david.rojas@test.com" en el campo de email y "Password123" en el campo de contraseña
- **And:** hace clic en el botón "Iniciar Sesión"
- **Then:** el sistema autentica a David exitosamente
- **And:** lo redirige al dashboard principal
- **And:** muestra un mensaje de bienvenida "¡Bienvenido de nuevo, David!"

### Scenario: Intento de inicio de sesión con contraseña incorrecta

- **Given:** un usuario "david.rojas@test.com" con contraseña "Password123" ya registrado
- **When:** David ingresa "david.rojas@test.com" en el campo de email y una contraseña incorrecta como "WrongPass456"
- **And:** hace clic en el botón "Iniciar Sesión"
- **Then:** el sistema muestra un mensaje de error: "Credenciales inválidas. Verifica tu email y contraseña."
- **And:** no se autentica a David
- **And:** David permanece en la página de login

### Scenario: Intento de inicio de sesión con un email no registrado

- **Given:** un usuario no registrado
- **When:** intenta iniciar sesión con un email no existente como "no.existe@test.com"
- **And:** una contraseña cualquiera
- **And:** hace clic en el botón "Iniciar Sesión"
- **Then:** el sistema muestra un mensaje de error: "Credenciales inválidas. Verifica tu email y contraseña."
- **And:** no se autentica al usuario
- **And:** el usuario permanece en la página de login

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

- **Sesión Persistente:** Sí, mantener la sesión activa entre cierres de navegador.
- **Mensajes de Error:** Informativos (especificar si falló el email o la clave).
- **Redirección:** Siempre redirigir al `/dashboard` tras éxito.
- Solo usuarios registrados pueden iniciar sesión.
- Email y contraseña deben coincidir con los registros.

---

## Technical Notes

### Frontend

- Creación de un componente `LoginForm` que maneje el estado de los campos email y contraseña.
- Uso de librería de validación (ej. Zod) para validar el formato de email en el cliente.
- Manejo de estados de carga y error en la UI.

### Backend

- API Route para `/api/auth/login` que reciba email y contraseña.
- Llamada a `supabase.auth.signInWithPassword()` para autenticar al usuario.
- Manejo de errores específicos de Supabase (ej. credenciales inválidas).

### Database

- La autenticación se gestiona directamente a través de Supabase Auth, que valida contra la tabla `auth.users`.
- No se requiere manipulación directa de SQL para esta operación.

---

## Dependencies

### Blocked By

- STORY-SOL-11 - User Signup Email (un usuario debe poder registrarse para poder iniciar sesión).

### Blocks

- Todas las historias de usuario que requieren un usuario autenticado.

---

## Definition of Done

- [ ] Código implementado y funcionando
- [ ] Tests unitarios (coverage > 80%) para el componente `LoginForm` y la lógica de la API Route.
- [ ] Tests de integración para la API Route de login, incluyendo validaciones.
- [ ] Tests E2E (Playwright) para el flujo completo de login.
- [ ] Code review aprobado (2 reviewers)
- [ ] Documentación actualizada (README, API docs si aplica)
- [ ] Deployed to staging
- [ ] QA testing passed
- [ ] Acceptance criteria validated
- [ ] No critical/high bugs open

---

## Notes

El mensaje de error para credenciales inválidas debe ser genérico para evitar dar pistas sobre si el email existe o no.

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-SOL-10-autenticacion-seguridad/epic.md`
- **PRD:** `.context/PRD/user-journeys.md` (Journey 1: Step 2)
- **SRS:** `.context/SRS/functional-specs.md` (FR-002)
- **API Contracts:** `.context/SRS/api-contracts.yaml` (`/auth/login` endpoint)
