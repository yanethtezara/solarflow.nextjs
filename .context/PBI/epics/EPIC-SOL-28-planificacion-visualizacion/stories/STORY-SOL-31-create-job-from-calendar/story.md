# Como Javi, quiero poder crear un nuevo trabajo directamente desde la vista de calendario para agilizar la planificación.

**Jira Key:** SOL-31
**Epic:** SOL-28 (Planificación y Visualización)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** Javi
**I want to** poder crear un nuevo trabajo directamente desde la vista de calendario
**So that** agilizar la planificación

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

-   Al hacer clic en un día del calendario, debe aparecer una opción "Crear Trabajo".
-   Al seleccionar esta opción, se debe abrir el formulario de creación de trabajos.
-   El campo de fecha en el formulario debe estar pre-rellenado con la fecha seleccionada en el calendario.
-   Se reutiliza el formulario de creación de trabajo existente.

### Out of Scope

-   Crear un trabajo arrastrando y soltando en el calendario.
-   Creación rápida de trabajo con campos mínimos desde el calendario.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Crear un nuevo trabajo desde el calendario

-   **Given:** Javi está en la vista de calendario
-   **When:** hace clic en un día específico (ej. "2026-03-10") y selecciona "Crear Trabajo"
-   **Then:** se abre el formulario de creación de trabajo
-   **And:** el campo de fecha está pre-rellenado con "2026-03-10"

### Scenario: Guardar el trabajo creado desde el calendario

-   **Given:** Javi está creando un trabajo desde el calendario con la fecha pre-rellenada
-   **When:** rellena los demás campos obligatorios (cliente, hora) y hace clic en "Guardar"
-   **Then:** el nuevo trabajo se crea exitosamente
-   **And:** el trabajo aparece en la vista de calendario en el día correspondiente

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

-   La fecha del trabajo por defecto será la fecha seleccionada en el calendario.
-   Los campos obligatorios del formulario de creación de trabajo deben seguir siendo validados.

---

## Technical Notes

### Frontend

-   El componente `CalendarView` debe incluir la lógica para detectar clics en los días y ofrecer la opción de "Crear Trabajo".
-   El formulario de creación de trabajo (`JobCreationForm`) debe aceptar un valor inicial para la fecha.

### Backend

-   La API Route `POST /api/trabajos` se utiliza como siempre. No se requiere lógica adicional de backend para esta historia.

### Database

-   No se requiere manipulación de la base de datos más allá de la creación del trabajo.

---

## Dependencies

### Blocked By

-   STORY-SOL-29 - Calendar View (se requiere la vista de calendario para esta funcionalidad).
-   STORY-SOL-23 - Create Job (se requiere el formulario de creación de trabajo).

### Blocks

-   Ninguna.

---

## Definition of Done

-   [ ] Código implementado y funcionando (creación de trabajo desde el calendario).
-   [ ] Tests unitarios (coverage > 80%) para la lógica de interacción del calendario.
-   [ ] Tests E2E (Playwright) para el flujo completo de creación de trabajo desde el calendario.
-   [ ] Code review aprobado (2 reviewers).
-   [ ] Documentación actualizada.
-   [ ] Deployed to staging.
-   [ ] QA testing passed.
-   [ ] Acceptance criteria validated.
-   [ ] No critical/high bugs open.

---

## Notes

Esta funcionalidad es una mejora de la usabilidad y no añade complejidad significativa al backend, principalmente es trabajo de frontend.

---

## Related Documentation

-   **Epic:** `.context/PBI/epics/EPIC-SOL-28-planificacion-visualizacion/epic.md`
-   **PRD:** `.context/PRD/mvp-scope.md` (US 4.3), `.context/PRD/user-journeys.md` (Journey 1: Step 4)
-   **SRS:** `.context/SRS/functional-specs.md`
