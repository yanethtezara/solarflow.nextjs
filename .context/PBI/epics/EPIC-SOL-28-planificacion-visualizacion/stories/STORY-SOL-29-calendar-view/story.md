# Como David, quiero poder ver mis instalaciones agendados en una vista de calendario (mensual/semanal) para planificar mi disponibilidad y la de mi equipo.

**Jira Key:** SOL-29
**Epic:** SOL-28 (Planificación y Visualización)
**Priority:** High
**Story Points:** 5
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** David
**I want to** poder ver mis instalaciones agendados en una vista de calendario (mensual/semanal)
**So that** planificar mi disponibilidad y la de mi equipo

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

- Vista de calendario principal (monthly view) que muestra los días con instalaciones.
- Al hacer clic en un día, se muestra una lista de los instalaciones de ese día.
- Opción de alternar a una vista semanal.
- Protección por RLS para mostrar solo los instalaciones del usuario autenticado.
- Los instalaciones deben mostrar al menos el cliente y la hora.

### Out of Scope

- Sincronización con calendarios externos (Google Calendar, Outlook).
- Arrastrar y soltar instalaciones en el calendario.
- Visualización de la disponibilidad de recursos (equipos, personas).

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Visualizar instalaciones en vista mensual del calendario

- **Given:** David está autenticado y tiene instalaciones agendados
- **When:** navega a la sección "Calendario"
- **Then:** ve una vista mensual donde los días con instalaciones aparecen marcados
- **And:** al hacer clic en un día, ve una lista de los instalaciones agendados para ese día

### Scenario: Visualizar instalaciones en vista semanal del calendario

- **Given:** David está en la vista mensual del calendario
- **When:** selecciona la opción "Vista Semanal"
- **Then:** ve una vista semanal donde los instalaciones se muestran distribuidos por horas del día/semana
- **And:** puede navegar entre semanas

### Scenario: No ver instalaciones de otros usuarios en el calendario

- **Given:** David y otro usuario tienen instalaciones agendados
- **When:** David está viendo el calendario
- **Then:** solo ve sus propios instalaciones y no los del otro usuario

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

- **Colores por Estado:** Azul (Agendado), Naranja (En Progreso), Verde (Completado), Gris (Cancelado).
- **Rango de Navegación:** Limitado a 6 meses atrás y 12 meses adelante por performance.
- Solo se muestran los instalaciones asociados al `user_id` del usuario.
- La vista semanal debe mostrar el título del instalación y la hora de inicio.

---

## Technical Notes

### Frontend

- Uso de una librería de calendario (ej. FullCalendar, React Big Calendar) para renderizar la UI.
- Componente `CalendarView` y `WeeklyView`.
- Integración con la API de instalaciones existente para obtener los instalaciones dentro de un rango de fechas.

### Backend

- La API Route `GET /api/trabajos` debe poder aceptar parámetros `startDate` y `endDate` para filtrar los instalaciones por rango.

### Database

- Consulta a la tabla `instalaciones` filtrando por `user_id` y rango de fechas.

---

## Dependencies

### Blocked By

- STORY-SOL-23 - Create Job (se requieren instalaciones para visualizarlos en el calendario).

### Blocks

- STORY-SOL-30 - Alternar entre vista de lista y calendario.
- STORY-SOL-31 - Crear instalación desde el calendario.

---

## Definition of Done

- [ ] Código implementado y funcionando (vista de calendario mensual y semanal).
- [ ] Tests unitarios (coverage > 80%) para componentes frontend.
- [ ] Tests de integración para la API de instalaciones con filtros de fecha.
- [ ] Tests E2E (Playwright) para la visualización de instalaciones en ambas vistas del calendario.
- [ ] Code review aprobado (2 reviewers).
- [ ] Documentación actualizada.
- [ ] Deployed to staging.
- [ ] QA testing passed.
- [ ] Acceptance criteria validated.
- [ ] No critical/high bugs open.

---

## Notes

Asegurarse de que el rendimiento sea óptimo al cargar muchos eventos en el calendario.

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-SOL-28-planificacion-visualizacion/epic.md`
- **PRD:** `.context/PRD/mvp-scope.md` (US 4.1)
- **SRS:** `.context/SRS/functional-specs.md`
