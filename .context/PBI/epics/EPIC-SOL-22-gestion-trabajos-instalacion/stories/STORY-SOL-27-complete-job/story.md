# Como Javi, quiero poder marcar un instalación como "Completado" para saber qué está listo para facturar.

**Jira Key:** SOL-27
**Epic:** SOL-22 (Gestión de Instalaciones de Instalación (Core))
**Priority:** Medium
**Story Points:** 2
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** Javi
**I want to** poder marcar un instalación como "Completado"
**So that** saber qué está listo para facturar

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

- En la vista de detalle y/o en la lista de instalaciones, debe haber una forma de cambiar el estado de un instalación.
- Los estados disponibles para el cambio serán: "Agendado", "En Progreso", "Completado", "Cancelado".
- La actualización del estado se debe reflejar inmediatamente en la base de datos y la UI.
- Solo el propietario del instalación puede cambiar su estado.

### Out of Scope

- Flujo de instalación con transiciones de estado restringidas (ej. no se puede pasar de "Cancelado" a "Completado").
- Notificaciones automáticas basadas en el cambio de estado.
- Motivos de cancelación.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Marcar un instalación como "Completado"

- **Given:** Javi tiene un instalación "Instalación Cliente Z" con estado "En Progreso"
- **When:** navega a los detalles del instalación
- **And:** hace clic en el botón o selector de estado para cambiarlo a "Completado"
- **Then:** el estado del instalación "Instalación Cliente Z" se actualiza a "Completado"
- **And:** el instalación podría aparecer en una sección de "Listos para Facturar"

### Scenario: Cambiar el estado a "En Progreso"

- **Given:** Javi tiene un instalación "Instalación Cliente A" con estado "Agendado"
- **When:** actualiza el estado del instalación a "En Progreso"
- **Then:** el estado del instalación se actualiza correctamente
- **And:** esto se refleja en la lista de instalaciones

### Scenario: Cancelar un instalación

- **Given:** Javi tiene un instalación "Instalación Cliente B" con estado "Agendado"
- **When:** actualiza el estado del instalación a "Cancelado"
- **Then:** el estado del instalación se actualiza a "Cancelado"
- **And:** el instalación podría moverse a una sección de "Cancelados" o aparecer tachado

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

- El cambio de estado solo puede ser realizado por el propietario del instalación.
- Los estados del instalación son un conjunto predefinido y no personalizable por el usuario.

---

## Technical Notes

### Frontend

- Componente `JobStatusSelector` (dropdown o botones de acción) en la vista de detalle del instalación y/o en los elementos de la lista.
- Uso de `React Query` o `SWR` para gestionar la actualización de estado y la invalidación de la caché.

### Backend

- API Route `PUT /api/trabajos/[id]/status` que acepta el nuevo estado.
- La ruta debe validar el nuevo estado contra una lista de estados permitidos y verificar la pertenencia del instalación.

### Database

- Actualización del campo `estado` en la tabla `instalaciones`.
- RLS es fundamental.

---

## Dependencies

### Blocked By

- STORY-SOL-25 - Edit Job Details (se requiere poder editar el instalación para cambiar su estado).

### Blocks

- EPIC-SOL-TBD - Facturación Simple (requiere instalaciones en estado "Completado").

---

## Definition of Done

- [ ] Código implementado y funcionando (cambio de estado del instalación).
- [ ] Tests unitarios (coverage > 80%) para componentes frontend y funciones backend.
- [ ] Tests de integración para la API Route de actualización de estado.
- [ ] Tests E2E (Playwright) para el flujo de cambio de estado de un instalación.
- [ ] Code review aprobado (2 reviewers).
- [ ] Documentación actualizada.
- [ ] Deployed to staging.
- [ ] QA testing passed.
- [ ] Acceptance criteria validated.
- [ ] No critical/high bugs open.

---

## Notes

La simplicidad en el cambio de estado es importante, ya que será una acción frecuente.

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-SOL-22-gestion-instalaciones-instalacion/epic.md`
- **PRD:** `.context/PRD/mvp-scope.md` (US 3.5), `.context/PRD/user-journeys.md` (Journey 1: Step 6)
- **SRS:** `.context/SRS/functional-specs.md` (FR-011)
