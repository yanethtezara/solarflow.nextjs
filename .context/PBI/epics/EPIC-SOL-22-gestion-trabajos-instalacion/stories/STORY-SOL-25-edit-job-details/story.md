# Como Javi, quiero poder editar los detalles de un trabajo existente para actualizar la información si hay cambios.

**Jira Key:** SOL-25
**Epic:** SOL-22 (Gestión de Trabajos de Instalación (Core))
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** Javi
**I want to** poder editar los detalles de un trabajo existente
**So that** actualizar la información si hay cambios

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

-   Página de edición de trabajo que pre-rellena el formulario con los datos existentes.
-   Campos editables: cliente, empresa, fecha, hora, ubicación.
-   Al guardar, la información del trabajo se actualiza en la base de datos.
-   Protección por RLS para asegurar que solo se editan los propios trabajos.

### Out of Scope

-   Edición de materiales o servicios asociados (se cubre en otra US).
-   Deshacer cambios.
-   Historial de versiones del trabajo.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Editar los detalles básicos de un trabajo

-   **Given:** Javi tiene un trabajo "Instalación Cliente X" agendado para "2026-03-05"
-   **When:** navega a los detalles del trabajo "Instalación Cliente X"
-   **And:** hace clic en "Editar Trabajo", cambia la fecha a "2026-03-06"
-   **And:** hace clic en "Guardar Cambios"
-   **Then:** la fecha del trabajo "Instalación Cliente X" se actualiza a "2026-03-06" en la lista de trabajos
-   **And:** Javi ve un mensaje de éxito "Trabajo actualizado correctamente."

### Scenario: Cambiar cliente/empresa de un trabajo

-   **Given:** Javi tiene un trabajo "Instalación Cliente Y" asociado a "Cliente Y"
-   **When:** edita el trabajo y selecciona "Cliente Z" en lugar de "Cliente Y"
-   **And:** hace clic en "Guardar Cambios"
-   **Then:** el trabajo "Instalación Cliente Y" ahora está asociado a "Cliente Z"

### Scenario: Intento de editar un trabajo que no le pertenece

-   **Given:** Javi está autenticado
-   **And:** existe un trabajo "Trabajo de Otro" creado por otro usuario
-   **When:** Javi intenta acceder a la URL de edición del "Trabajo de Otro"
-   **Then:** el sistema muestra un mensaje de error de permisos "No tienes acceso a este recurso."
-   **And:** no puede ver ni editar el trabajo

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

-   Solo el propietario de un trabajo puede editarlo.
-   La edición no puede dejar en blanco campos obligatorios (cliente, fecha, hora).

---

## Technical Notes

### Frontend

-   Reutilización del componente `JobCreationForm` para la edición, precargando los datos del trabajo.
-   Uso de `React Query` o `SWR` para obtener los datos del trabajo a editar y para invalidar la lista de trabajos tras la edición.

### Backend

-   API Route `PUT /api/trabajos/[id]` para actualizar el trabajo.
-   La ruta debe verificar la pertenencia del trabajo al `user_id` autenticado.

### Database

-   Operación `UPDATE` en la tabla `trabajos`.
-   RLS es fundamental para la seguridad de la operación de actualización.

---

## Dependencies

### Blocked By

-   STORY-SOL-24 - Listar trabajos (se necesita una lista para acceder a la opción de editar).

### Blocks

-   Ninguna.

---

## Definition of Done

-   [ ] Código implementado y funcionando (edición de detalles del trabajo).
-   [ ] Tests unitarios (coverage > 80%) para componentes frontend y funciones backend.
-   [ ] Tests de integración para la API Route de actualización de trabajos.
-   [ ] Tests E2E (Playwright) para el flujo completo de edición de trabajos.
-   [ ] Code review aprobado (2 reviewers).
-   [ ] Documentación actualizada.
-   [ ] Deployed to staging.
-   [ ] QA testing passed.
-   [ ] Acceptance criteria validated.
-   [ ] No critical/high bugs open.

---

## Notes

La reutilización del formulario de creación para la edición es una práctica recomendada para mantener la consistencia y reducir el código duplicado.

---

## Related Documentation

-   **Epic:** `.context/PBI/epics/EPIC-SOL-22-gestion-trabajos-instalacion/epic.md`
-   **PRD:** `.context/PRD/mvp-scope.md` (US 3.3)
-   **SRS:** `.context/SRS/functional-specs.md` (FR-009)
