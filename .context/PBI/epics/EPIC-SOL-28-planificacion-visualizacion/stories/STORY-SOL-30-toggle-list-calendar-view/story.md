# Como Javi, quiero poder alternar entre una vista de lista y una vista de calendario para elegir la que mejor me convenga en cada momento.

**Jira Key:** SOL-30
**Epic:** SOL-28 (Planificación y Visualización)
**Priority:** Medium
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** Javi
**I want to** poder alternar entre una vista de lista y una vista de calendario
**So that** elegir la que mejor me convenga en cada momento

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

- Botones o selectores en la UI para cambiar entre la vista de lista y la vista de calendario.
- La vista de lista reutiliza el componente de la lista de instalaciones existente.
- La vista de calendario reutiliza el componente de calendario existente.
- El estado de la vista preferida se puede recordar en el almacenamiento local del navegador para futuras sesiones.

### Out of Scope

- Diferentes vistas de lista (ej. vista compacta, vista detallada).
- Alternar entre diferentes tipos de calendario (ej. agenda, día).

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Alternar de vista de lista a vista de calendario

- **Given:** Javi está en la sección "Mis Instalaciones" en la vista de lista
- **When:** hace clic en el botón o selector "Vista Calendario"
- **Then:** la visualización de los instalaciones cambia a la vista de calendario (mensual)
- **And:** los instalaciones se muestran correctamente en el calendario

### Scenario: Alternar de vista de calendario a vista de lista

- **Given:** Javi está en la sección "Calendario"
- **When:** hace clic en el botón o selector "Vista Lista"
- **Then:** la visualización de los instalaciones cambia a la vista de lista
- **And:** los instalaciones se muestran correctamente en la lista con sus detalles

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

- El cambio de vista debe ser instantáneo para el usuario.
- La aplicación puede recordar la última vista utilizada por el usuario.

---

## Technical Notes

### Frontend

- Gestión de estado en la UI para controlar la vista actual (lista o calendario).
- Uso de `localStorage` para persistir la preferencia de vista del usuario.
- Reutilización de los componentes `JobList` y `CalendarView`.

### Backend

- No se requiere lógica de backend específica para esta historia, ya que es un cambio de UI en el frontend.

### Database

- No se requiere manipulación de la base de datos para esta historia.

---

## Dependencies

### Blocked By

- STORY-SOL-24 - Listar instalaciones.
- STORY-SOL-29 - Calendar View.

### Blocks

- Ninguna.

---

## Definition of Done

- [ ] Código implementado y funcionando (alternancia entre vistas).
- [ ] Tests unitarios (coverage > 80%) para el componente de alternancia.
- [ ] Tests E2E (Playwright) para el flujo de cambio entre vistas.
- [ ] Code review aprobado (2 reviewers).
- [ ] Documentación actualizada.
- [ ] Deployed to staging.
- [ ] QA testing passed.
- [ ] Acceptance criteria validated.
- [ ] No critical/high bugs open.

---

## Notes

La implementación debe ser ligera, ya que se trata principalmente de un cambio de UI.

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-SOL-28-planificacion-visualizacion/epic.md`
- **PRD:** `.context/PRD/mvp-scope.md` (US 4.2)
- **SRS:** `.context/SRS/functional-specs.md`
