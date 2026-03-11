# Como David, quiero poder ver mis trabajos agendados en una vista de calendario (mensual/semanal) para planificar mi disponibilidad y la de mi equipo.

**Jira Key:** SOL-29
**Epic:** SOL-28 (Planificación y Visualización)
**Priority:** High
**Story Points:** 5
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** David
**I want to** poder ver mis trabajos agendados en una vista de calendario (mensual/semanal)
**So that** planificar mi disponibilidad y la de mi equipo

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

-   Vista de calendario principal (monthly view) que muestra los días con trabajos.
-   Al hacer clic en un día, se muestra una lista de los trabajos de ese día.
-   Opción de alternar a una vista semanal.
-   Protección por RLS para mostrar solo los trabajos del usuario autenticado.
-   Los trabajos deben mostrar al menos el cliente y la hora.

### Out of Scope

-   Sincronización con calendarios externos (Google Calendar, Outlook).
-   Arrastrar y soltar trabajos en el calendario.
-   Visualización de la disponibilidad de recursos (equipos, personas).

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Visualizar trabajos en vista mensual del calendario

-   **Given:** David está autenticado y tiene trabajos agendados
-   **When:** navega a la sección "Calendario"
-   **Then:** ve una vista mensual donde los días con trabajos aparecen marcados
-   **And:** al hacer clic en un día, ve una lista de los trabajos agendados para ese día

### Scenario: Visualizar trabajos en vista semanal del calendario

-   **Given:** David está en la vista mensual del calendario
-   **When:** selecciona la opción "Vista Semanal"
-   **Then:** ve una vista semanal donde los trabajos se muestran distribuidos por horas del día/semana
-   **And:** puede navegar entre semanas

### Scenario: No ver trabajos de otros usuarios en el calendario

-   **Given:** David y otro usuario tienen trabajos agendados
-   **When:** David está viendo el calendario
-   **Then:** solo ve sus propios trabajos y no los del otro usuario

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

-   Solo se muestran los trabajos asociados al `user_id` del usuario.
-   La vista semanal debe mostrar el título del trabajo y la hora de inicio.

---

## Technical Notes

### Frontend

-   Uso de una librería de calendario (ej. FullCalendar, React Big Calendar) para renderizar la UI.
-   Componente `CalendarView` y `WeeklyView`.
-   Integración con la API de trabajos existente para obtener los trabajos dentro de un rango de fechas.

### Backend

-   La API Route `GET /api/trabajos` debe poder aceptar parámetros `startDate` y `endDate` para filtrar los trabajos por rango.

### Database

-   Consulta a la tabla `trabajos` filtrando por `user_id` y rango de fechas.

---

## Dependencies

### Blocked By

-   STORY-SOL-23 - Create Job (se requieren trabajos para visualizarlos en el calendario).

### Blocks

-   STORY-SOL-30 - Alternar entre vista de lista y calendario.
-   STORY-SOL-31 - Crear trabajo desde el calendario.

---

## Definition of Done

-   [ ] Código implementado y funcionando (vista de calendario mensual y semanal).
-   [ ] Tests unitarios (coverage > 80%) para componentes frontend.
-   [ ] Tests de integración para la API de trabajos con filtros de fecha.
-   [ ] Tests E2E (Playwright) para la visualización de trabajos en ambas vistas del calendario.
-   [ ] Code review aprobado (2 reviewers).
-   [ ] Documentación actualizada.
-   [ ] Deployed to staging.
-   [ ] QA testing passed.
-   [ ] Acceptance criteria validated.
-   [ ] No critical/high bugs open.

---

## Notes

Asegurarse de que el rendimiento sea óptimo al cargar muchos eventos en el calendario.

---

## Related Documentation

-   **Epic:** `.context/PBI/epics/EPIC-SOL-28-planificacion-visualizacion/epic.md`
-   **PRD:** `.context/PRD/mvp-scope.md` (US 4.1)
-   **SRS:** `.context/SRS/functional-specs.md`
