# Como usuario, quiero poder cerrar sesión de forma segura para proteger mi información en dispositivos compartidos.

**Jira Key:** SOL-14
**Epic:** SOL-10 (Autenticación y Seguridad de Cuenta)
**Priority:** Medium
**Story Points:** 1
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** usuario
**I want to** poder cerrar sesión de forma segura
**So that** proteger mi información en dispositivos compartidos

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

-   Botón o enlace visible en la UI para "Cerrar Sesión".
-   Invalidación del token de sesión del lado del cliente y servidor (vía Supabase).
-   Redirección a la página de inicio de sesión.
-   Proteger las rutas de la aplicación para que solo sean accesibles por usuarios autenticados.

### Out of Scope

-   Cierre de sesión en todos los dispositivos simultáneamente.
-   Timeout de sesión por inactividad.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Cierre de sesión exitoso

-   **Given:** un usuario autenticado se encuentra en cualquier página de la aplicación
-   **When:** hace clic en el botón o enlace "Cerrar Sesión"
-   **Then:** el sistema invalida la sesión del usuario
-   **And:** redirige al usuario a la página de inicio de sesión
-   **And:** si el usuario intenta acceder a una página protegida, es redirigido al login

### Scenario: Intento de acceso a página protegida después de cerrar sesión

-   **Given:** un usuario que ha cerrado sesión
-   **When:** intenta acceder directamente a la URL del dashboard (ej. "/dashboard")
-   **Then:** el sistema no muestra el dashboard
-   **And:** redirige al usuario a la página de inicio de sesión

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

-   El cierre de sesión debe invalidar el token actual para que no pueda ser reutilizado.

---

## Technical Notes

### Frontend

-   El botón de "Cerrar Sesión" debe estar en un lugar accesible, como en un menú de perfil de usuario.
-   Al hacer clic, se debe llamar a la función `supabase.auth.signOut()`.
-   Se debe implementar un HOC (Higher-Order Component) o un middleware a nivel de layout en Next.js para proteger las rutas.

### Backend

-   La API Route para `/api/auth/logout` simplemente llamará a la función de `signOut` de Supabase, que maneja la invalidación del token.

### Database

-   No se requiere manipulación directa de la base de datos. Supabase Auth gestiona el estado de la sesión.

---

## Dependencies

### Blocked By

-   STORY-SOL-12 - User Login Credentials (un usuario debe poder iniciar sesión para poder cerrar sesión).

### Blocks

-   Ninguna.

---

## Definition of Done

-   [ ] Código implementado y funcionando
-   [ ] Tests unitarios (coverage > 80%) para la lógica de cierre de sesión.
-   [ ] Tests E2E (Playwright) para el flujo completo de cierre de sesión.
-   [ ] Code review aprobado (2 reviewers)
-   [ ] Documentación actualizada
-   [ ] Deployed to staging
-   [ ] QA testing passed
-   [ ] Acceptance criteria validated
-   [ ] No critical/high bugs open

---

## Notes

La protección de rutas es una parte crucial de esta historia. Si las rutas no están protegidas, el cierre de sesión no tiene sentido.

---

## Related Documentation

-   **Epic:** `.context/PBI/epics/EPIC-SOL-10-autenticacion-seguridad/epic.md`
-   **PRD:** `.context/PRD/mvp-scope.md`
-   **SRS:** `.context/SRS/functional-specs.md` (FR-004)
-   **API Contracts:** `.context/SRS/api-contracts.yaml`
