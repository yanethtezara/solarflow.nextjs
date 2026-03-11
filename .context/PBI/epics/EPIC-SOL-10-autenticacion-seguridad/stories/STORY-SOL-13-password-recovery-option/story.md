# Como Javi, quiero una opción para "recuperar mi contraseña" si la olvido, para no perder el acceso a mi cuenta.

**Jira Key:** SOL-13
**Epic:** SOL-10 (Autenticación y Seguridad de Cuenta)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** Javi (instalador)
**I want to** tener una opción para "recuperar mi contraseña" si la olvido
**So that** no perder el acceso a mi cuenta

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

-   Enlace "Olvidé mi contraseña" en la página de login.
-   Formulario para introducir el email en la página de recuperación de contraseña.
-   Envío de email con enlace único de restablecimiento vía Supabase Auth.
-   Página de restablecimiento de contraseña para introducir y confirmar nueva contraseña.
-   Validación de seguridad de la nueva contraseña.

### Out of Scope

-   Preguntas de seguridad para restablecer contraseña.
-   Restablecimiento de contraseña vía SMS.
-   Personalización avanzada del template del email de recuperación.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Inicio del proceso de recuperación de contraseña exitoso

-   **Given:** Javi está en la página de inicio de sesión
-   **When:** hace clic en "Olvidé mi contraseña"
-   **And:** introduce su email registrado "javi.morales@test.com" en el campo
-   **And:** hace clic en el botón "Enviar Enlace de Recuperación"
-   **Then:** el sistema muestra un mensaje de confirmación: "Si el email está registrado, recibirás un enlace para restablecer tu contraseña."
-   **And:** un email con un enlace único de recuperación es enviado a "javi.morales@test.com"

### Scenario: Intento de recuperación de contraseña con email no registrado

-   **Given:** Javi está en la página de recuperación de contraseña
-   **When:** introduce un email no registrado como "no.existe@test.com"
-   **And:** hace clic en el botón "Enviar Enlace de Recuperación"
-   **Then:** el sistema muestra el mismo mensaje de confirmación genérico para evitar enumeración de usuarios
-   **And:** no se envía ningún email

### Scenario: Restablecimiento de contraseña a través del enlace de recuperación

-   **Given:** Javi recibe un email con un enlace de recuperación válido
-   **When:** hace clic en el enlace de recuperación
-   **And:** es redirigido a una página para establecer una nueva contraseña
-   **And:** introduce una nueva contraseña segura y la confirma
-   **And:** hace clic en el botón "Restablecer Contraseña"
-   **Then:** su contraseña se actualiza exitosamente
-   **And:** es redirigido a la página de inicio de sesión
-   **And:** puede iniciar sesión con su nueva contraseña

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

-   El enlace de recuperación de contraseña debe expirar después de un tiempo determinado (configurado en Supabase, ej. 1 hora).
-   El mensaje de confirmación en la UI debe ser siempre el mismo para no revelar si un email está o no registrado.

---

## Technical Notes

### Frontend

-   Creación de una página/ruta para la recuperación de contraseña (`/forgot-password`).
-   Creación de una página/ruta para el restablecimiento de la contraseña (`/reset-password`).
-   Componente `ForgotPasswordForm` para el email.
-   Componente `ResetPasswordForm` para la nueva contraseña.
-   Manejo del token de recuperación desde la URL en la página de restablecimiento.

### Backend

-   API Route para `/api/auth/forgot-password` que llama a `supabase.auth.resetPasswordForEmail()`.
-   API Route para `/api/auth/reset-password` que llama a `supabase.auth.updateUser()` con la nueva contraseña.

### Database

-   No se requiere manipulación directa de la base de datos. Todo es gestionado por Supabase Auth.

---

## Dependencies

### Blocked By

-   Ninguna.

### Blocks

-   Ninguna.

---

## Definition of Done

-   [ ] Código implementado y funcionando
-   [ ] Tests unitarios (coverage > 80%) para los componentes de los formularios y la lógica de las API Routes.
-   [ ] Tests de integración para las API Routes de recuperación y restablecimiento.
-   [ ] Tests E2E (Playwright) para el flujo completo de recuperación de contraseña.
-   [ ] Code review aprobado (2 reviewers)
-   [ ] Documentación actualizada
-   [ ] Deployed to staging
-   [ ] QA testing passed
-   [ ] Acceptance criteria validated
-   [ ] No critical/high bugs open

---

## Notes

La seguridad es primordial. Es importante no dar feedback sobre si un email existe o no en el sistema para prevenir ataques de enumeración de usuarios.

---

## Related Documentation

-   **Epic:** `.context/PBI/epics/EPIC-SOL-10-autenticacion-seguridad/epic.md`
-   **PRD:** `.context/PRD/user-journeys.md`
-   **SRS:** `.context/SRS/functional-specs.md` (FR-003)
-   **API Contracts:** `.context/SRS/api-contracts.yaml`
