# Como David, quiero poder ver un listado de todos mis instalaciones (pasados y futuros) con su estado (ej. Agendado, En Progreso, Completado) para conocer mi carga de instalación.

**Jira Key:** SOL-24
**Epic:** SOL-22 (Gestión de Instalaciones de Instalación (Core))
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** David
**I want to** poder ver un listado de todos mis instalaciones (pasados y futuros) con su estado (ej. Agendado, En Progreso, Completado)
**So that** conocer mi carga de instalación

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

- Vista de lista de instalaciones, mostrando al menos: cliente, fecha, hora, estado.
- Ordenación por fecha (ascendente por defecto).
- Filtro simple por estado (ej. "Agendado", "En Progreso", "Completado").
- Protección por RLS para asegurar que solo se visualizan los propios instalaciones.

### Out of Scope

- Paginación de la lista de instalaciones.
- Búsqueda por cliente, ubicación, etc.
- Filtrado por rango de fechas.
- Vistas de tarjeta o tablero (Kanban).

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Visualizar todos los instalaciones en una lista

- **Given:** David está autenticado y tiene varios instalaciones creados
- **When:** navega a la sección "Mis Instalaciones" (vista de lista)
- **Then:** ve una lista de todos sus instalaciones, mostrando al menos: cliente, fecha, hora y estado.
- **And:** los instalaciones están ordenados por fecha, los más próximos primero.

### Scenario: Filtrar instalaciones por estado

- **Given:** David está en la lista de instalaciones con instalaciones en diferentes estados
- **When:** selecciona el filtro "Agendado"
- **Then:** la lista muestra solo los instalaciones cuyo estado es "Agendado"

### Scenario: No ver instalaciones de otros usuarios

- **Given:** David y otro usuario tienen instalaciones creados
- **When:** David está en la lista de instalaciones
- **Then:** solo ve sus propios instalaciones y no los del otro usuario

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

- Solo se muestran los instalaciones asociados al `user_id` del usuario autenticado.
- Los estados posibles de un instalación deben ser: "Agendado", "En Progreso", "Completado", "Cancelado".

---

## Technical Notes

### Frontend

- Componente `JobList` para mostrar la lista de instalaciones.
- Componente `JobStatusFilter` para el filtro de estados.
- Uso de `React Query` o `SWR` para obtener los datos de los instalaciones.

### Backend

- API Route `GET /api/trabajos` con soporte para parámetros de filtro por `estado`.
- Consulta a la tabla `instalaciones` filtrando por `user_id` y `estado`.

### Database

- Consulta a la tabla `instalaciones`.
- RLS es fundamental para la seguridad de la información.

---

## Dependencies

### Blocked By

- STORY-SOL-23 - Create Job (se requieren instalaciones para poder listarlos).

### Blocks

- STORY-SOL-TBD - Editar los detalles de un instalación existente.
- EPIC-SOL-TBD - Planificación y Visualización (requiere acceder a la lista de instalaciones).

---

## Definition of Done

- [ ] Código implementado y funcionando (listado de instalaciones con filtro por estado).
- [ ] Tests unitarios (coverage > 80%) para componentes frontend y funciones backend.
- [ ] Tests de integración para la API Route de listado de instalaciones, incluyendo filtros.
- [ ] Tests E2E (Playwright) para el flujo de visualización y filtrado de instalaciones.
- [ ] Code review aprobado (2 reviewers).
- [ ] Documentación actualizada.
- [ ] Deployed to staging.
- [ ] QA testing passed.
- [ ] Acceptance criteria validated.
- [ ] No critical/high bugs open.

---

## Notes

La respuesta de la API debe incluir la información necesaria para mostrar en la lista (cliente, fecha, hora, estado).

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-SOL-22-gestion-instalaciones-instalacion/epic.md`
- **PRD:** `.context/PRD/mvp-scope.md` (US 3.2)
- **SRS:** `.context/SRS/functional-specs.md` (FR-008)
