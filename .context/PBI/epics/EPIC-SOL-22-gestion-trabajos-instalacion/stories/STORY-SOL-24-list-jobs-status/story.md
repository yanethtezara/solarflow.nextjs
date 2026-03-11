# Como David, quiero poder ver un listado de todos mis trabajos (pasados y futuros) con su estado (ej. Agendado, En Progreso, Completado) para conocer mi carga de trabajo.

**Jira Key:** SOL-24
**Epic:** SOL-22 (Gestión de Trabajos de Instalación (Core))
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** David
**I want to** poder ver un listado de todos mis trabajos (pasados y futuros) con su estado (ej. Agendado, En Progreso, Completado)
**So that** conocer mi carga de trabajo

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

-   Vista de lista de trabajos, mostrando al menos: cliente, fecha, hora, estado.
-   Ordenación por fecha (ascendente por defecto).
-   Filtro simple por estado (ej. "Agendado", "En Progreso", "Completado").
-   Protección por RLS para asegurar que solo se visualizan los propios trabajos.

### Out of Scope

-   Paginación de la lista de trabajos.
-   Búsqueda por cliente, ubicación, etc.
-   Filtrado por rango de fechas.
-   Vistas de tarjeta o tablero (Kanban).

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Visualizar todos los trabajos en una lista

-   **Given:** David está autenticado y tiene varios trabajos creados
-   **When:** navega a la sección "Mis Trabajos" (vista de lista)
-   **Then:** ve una lista de todos sus trabajos, mostrando al menos: cliente, fecha, hora y estado.
-   **And:** los trabajos están ordenados por fecha, los más próximos primero.

### Scenario: Filtrar trabajos por estado

-   **Given:** David está en la lista de trabajos con trabajos en diferentes estados
-   **When:** selecciona el filtro "Agendado"
-   **Then:** la lista muestra solo los trabajos cuyo estado es "Agendado"

### Scenario: No ver trabajos de otros usuarios

-   **Given:** David y otro usuario tienen trabajos creados
-   **When:** David está en la lista de trabajos
-   **Then:** solo ve sus propios trabajos y no los del otro usuario

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

-   Solo se muestran los trabajos asociados al `user_id` del usuario autenticado.
-   Los estados posibles de un trabajo deben ser: "Agendado", "En Progreso", "Completado", "Cancelado".

---

## Technical Notes

### Frontend

-   Componente `JobList` para mostrar la lista de trabajos.
-   Componente `JobStatusFilter` para el filtro de estados.
-   Uso de `React Query` o `SWR` para obtener los datos de los trabajos.

### Backend

-   API Route `GET /api/trabajos` con soporte para parámetros de filtro por `estado`.
-   Consulta a la tabla `trabajos` filtrando por `user_id` y `estado`.

### Database

-   Consulta a la tabla `trabajos`.
-   RLS es fundamental para la seguridad de la información.

---

## Dependencies

### Blocked By

-   STORY-SOL-23 - Create Job (se requieren trabajos para poder listarlos).

### Blocks

-   STORY-SOL-TBD - Editar los detalles de un trabajo existente.
-   EPIC-SOL-TBD - Planificación y Visualización (requiere acceder a la lista de trabajos).

---

## Definition of Done

-   [ ] Código implementado y funcionando (listado de trabajos con filtro por estado).
-   [ ] Tests unitarios (coverage > 80%) para componentes frontend y funciones backend.
-   [ ] Tests de integración para la API Route de listado de trabajos, incluyendo filtros.
-   [ ] Tests E2E (Playwright) para el flujo de visualización y filtrado de trabajos.
-   [ ] Code review aprobado (2 reviewers).
-   [ ] Documentación actualizada.
-   [ ] Deployed to staging.
-   [ ] QA testing passed.
-   [ ] Acceptance criteria validated.
-   [ ] No critical/high bugs open.

---

## Notes

La respuesta de la API debe incluir la información necesaria para mostrar en la lista (cliente, fecha, hora, estado).

---

## Related Documentation

-   **Epic:** `.context/PBI/epics/EPIC-SOL-22-gestion-trabajos-instalacion/epic.md`
-   **PRD:** `.context/PRD/mvp-scope.md` (US 3.2)
-   **SRS:** `.context/SRS/functional-specs.md` (FR-008)
