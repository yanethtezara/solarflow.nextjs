# Como Javi, quiero poder pre-definir un catálogo de los materiales más comunes que uso con sus costos para estandarizar mis presupuestos y gastos.

**Jira Key:** SOL-20
**Epic:** SOL-18 (Catálogo de Servicios y Materiales)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** Javi
**I want to** poder pre-definir un catálogo de los materiales más comunes que uso con sus costos
**So that** estandarizar mis presupuestos y gastos

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

- Formulario para crear ítems de tipo "Material" con campos: nombre (obligatorio) y costo (obligatorio, numérico).
- Opción de seleccionar el tipo de ítem como "Material".
- Vista de lista para mostrar los materiales pre-definidos.
- Todas las operaciones deben estar protegidas por RLS.

### Out of Scope

- Edición o eliminación de ítems de catálogo (se cubre en otra US).
- Gestión de inventario/stock de materiales.
- Agrupación o categorías de materiales.
- Unidades de medida para los materiales (kg, m, etc.).

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Pre-definir un nuevo material exitosamente

- **Given:** Javi está en la sección "Catálogo de Materiales"
- **When:** hace clic en "Nuevo Material", ingresa un nombre como "Panel Solar 400W" y un costo de "250.00"
- **And:** selecciona el tipo "Material"
- **And:** hace clic en "Guardar"
- **Then:** el material "Panel Solar 400W" aparece en la lista de materiales con su costo
- **And:** Javi ve un mensaje de éxito "Material creado correctamente."

### Scenario: Ver la lista de materiales pre-definidos

- **Given:** Javi ha creado varios materiales
- **When:** navega a la sección "Catálogo de Materiales"
- **Then:** ve una lista con los nombres y costos de todos sus materiales

### Scenario: Utilizar un material pre-definido en un instalación (funcionalidad futura, solo visibilidad)

- **Given:** Javi está creando o editando un instalación
- **When:** busca la opción para añadir "Materiales"
- **Then:** ve los materiales que ha pre-definido en el catálogo y puede seleccionarlos fácilmente

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

- El nombre y el costo del material son obligatorios.
- El costo debe ser un valor numérico positivo.
- El tipo de ítem debe ser "Material".

---

## Technical Notes

### Frontend

- Componente `MaterialForm` para crear materiales.
- Componente `MaterialList` para listar materiales.
- Uso de Zod para validación de campos.

### Backend

- API Route `POST /api/catalogo-items` con un payload que incluya `tipo: 'material'`.

### Database

- Insertar en la tabla `catalogo_items` con `tipo = 'material'`.
- Asegurar RLS para el `user_id`.

---

## Dependencies

### Blocked By

- STORY-SOL-12 - User Login Credentials (se requiere autenticación para crear materiales).

### Blocks

- STORY-SOL-TBD - Asociar materiales y mano de obra a un instalación.

---

## Definition of Done

- [ ] Código implementado y funcionando (creación y listado de materiales).
- [ ] Tests unitarios (coverage > 80%) para componentes frontend y funciones backend.
- [ ] Tests de integración para la API Route de creación/listado de materiales.
- [ ] Tests E2E (Playwright) para el flujo de creación y visualización.
- [ ] Code review aprobado (2 reviewers).
- [ ] Documentación actualizada.
- [ ] Deployed to staging.
- [ ] QA testing passed.
- [ ] Acceptance criteria validated.
- [ ] No critical/high bugs open.

---

## Notes

La reutilización de código con la gestión de servicios de mano de obra (historia anterior) es importante.

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-SOL-18-catalogo-servicios-materiales/epic.md`
- **PRD:** `.context/PRD/mvp-scope.md` (US 5.2)
- **SRS:** `.context/SRS/functional-specs.md`
