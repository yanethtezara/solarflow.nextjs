# Como David, quiero poder pre-definir un catálogo de mis servicios de mano de obra con sus precios para poder agregarlos rápidamente a los instalaciones.

**Jira Key:** SOL-19
**Epic:** SOL-18 (Catálogo de Servicios y Materiales)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** David
**I want to** poder pre-definir un catálogo de mis servicios de mano de obra con sus precios
**So that** poder agregarlos rápidamente a los instalaciones

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

- Una sección/página en la UI para la gestión del "Catálogo de Servicios".
- Formulario para crear ítems de tipo "Mano de Obra" con campos: nombre (obligatorio) y precio (obligatorio, numérico).
- Opción de seleccionar el tipo de ítem como "Mano de Obra".
- Vista de lista para mostrar los servicios de mano de obra pre-definidos.
- Todas las operaciones deben estar protegidas por RLS.

### Out of Scope

- Edición o eliminación de ítems de catálogo (se cubre en otra US).
- Agrupación o categorías de servicios.
- Manejo de impuestos sobre los servicios.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Pre-definir un nuevo servicio de mano de obra

- **Given:** David está en la sección "Catálogo de Servicios"
- **When:** hace clic en "Nuevo Servicio", ingresa un nombre como "Instalación Básica" y un precio de "150.00"
- **And:** selecciona el tipo "Mano de Obra"
- **And:** hace clic en "Guardar"
- **Then:** el servicio "Instalación Básica" aparece en la lista de servicios de mano de obra con su precio
- **And:** David ve un mensaje de éxito "Servicio creado correctamente."

### Scenario: Ver la lista de servicios de mano de obra pre-definidos

- **Given:** David ha creado varios servicios de mano de obra
- **When:** navega a la sección "Catálogo de Servicios"
- **Then:** ve una lista con los nombres y precios de todos sus servicios de mano de obra

### Scenario: Utilizar un servicio pre-definido en un instalación (funcionalidad futura, solo visibilidad)

- **Given:** David está creando o editando un instalación
- **When:** busca la opción para añadir "Servicios de Mano de Obra"
- **Then:** ve los servicios que ha pre-definido en el catálogo y puede seleccionarlos fácilmente

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

- El nombre y el precio del servicio de mano de obra son obligatorios.
- El precio debe ser un valor numérico positivo.
- El tipo de ítem debe ser "Mano de Obra".

---

## Technical Notes

### Frontend

- Componente `LaborServiceForm` para crear servicios.
- Componente `LaborServiceList` para listar servicios.
- Uso de Zod para validación de campos.

### Backend

- API Route `POST /api/catalogo-items` con un payload que incluya `tipo: 'mano_de_obra'`.

### Database

- Insertar en la tabla `catalogo_items` con `tipo = 'mano_de_obra'`.
- Asegurar RLS para el `user_id`.

---

## Dependencies

### Blocked By

- STORY-SOL-12 - User Login Credentials (se requiere autenticación para crear servicios).

### Blocks

- STORY-SOL-TBD - Asociar materiales y mano de obra a un instalación.

---

## Definition of Done

- [ ] Código implementado y funcionando (creación y listado de servicios de mano de obra).
- [ ] Tests unitarios (coverage > 80%) para componentes frontend y funciones backend.
- [ ] Tests de integración para la API Route de creación/listado de servicios de mano de obra.
- [ ] Tests E2E (Playwright) para el flujo de creación y visualización.
- [ ] Code review aprobado (2 reviewers).
- [ ] Documentación actualizada.
- [ ] Deployed to staging.
- [ ] QA testing passed.
- [ ] Acceptance criteria validated.
- [ ] No critical/high bugs open.

---

## Notes

La reutilización de código con la gestión de materiales (próxima historia) es importante.

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-SOL-18-catalogo-servicios-materiales/epic.md`
- **PRD:** `.context/PRD/mvp-scope.md` (US 5.1)
- **SRS:** `.context/SRS/functional-specs.md`
