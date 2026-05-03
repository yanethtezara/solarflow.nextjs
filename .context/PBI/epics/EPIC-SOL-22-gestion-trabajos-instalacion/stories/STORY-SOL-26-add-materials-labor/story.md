# Como David, quiero poder agregar materiales y costos de mano de obra específicos a un instalación para llevar un control de los recursos y gastos del proyecto.

**Jira Key:** SOL-26
**Epic:** SOL-22 (Gestión de Instalaciones de Instalación (Core))
**Priority:** High
**Story Points:** 5
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** David
**I want to** poder agregar materiales y costos de mano de obra específicos a un instalación
**So that** llevar un control de los recursos y gastos del proyecto

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

- En la vista de detalle de un instalación, debe existir una sección para gestionar los ítems.
- Funcionalidad para agregar ítems desde el catálogo, especificando cantidad.
- Se pueden agregar tanto materiales como servicios de mano de obra.
- Funcionalidad para eliminar un ítem de un instalación.
- Visualización del desglose de ítems con cantidades, precios/costos y subtotales.
- Visualización del costo total del instalación (suma de todos los ítems).

### Out of Scope

- Editar la cantidad de un ítem ya agregado (se debe eliminar y volver a agregar).
- Agregar ítems que no estén en el catálogo.
- Aplicar descuentos.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Agregar un material a un instalación

- **Given:** David está viendo los detalles del instalación "Instalación Cliente X"
- **When:** hace clic en "Agregar Ítem", selecciona "Panel Solar 400W" de su catálogo de materiales
- **And:** especifica la cantidad "10"
- **And:** hace clic en "Agregar"
- **Then:** el ítem "Panel Solar 400W" con cantidad 10 aparece en el desglose del instalación
- **And:** el costo total del instalación se recalcula

### Scenario: Agregar un servicio de mano de obra a un instalación

- **Given:** David está viendo los detalles del instalación "Instalación Cliente X"
- **When:** hace clic en "Agregar Ítem", selecciona "Instalación Básica" de su catálogo de servicios
- **And:** especifica la cantidad "1"
- **And:** hace clic en "Agregar"
- **Then:** el ítem "Instalación Básica" con cantidad 1 aparece en el desglose del instalación
- **And:** el costo total del instalación se recalcula

### Scenario: Eliminar un ítem de un instalación

- **Given:** un instalación tiene el material "Panel Solar 400W" con cantidad 10
- **When:** David hace clic en el botón "Eliminar" junto al ítem "Panel Solar 400W"
- **And:** confirma la acción
- **Then:** el ítem "Panel Solar 400W" se elimina del desglose del instalación
- **And:** el costo total del instalación se recalcula

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

- La cantidad de un ítem debe ser un número entero positivo.
- Los precios/costos se obtienen del catálogo y no son editables en el contexto del instalación.
- El costo total se calcula como `SUM(item.cantidad * item.precio)`.

---

## Technical Notes

### Frontend

- Componente `JobItemsList` para mostrar el desglose de ítems.
- Componente `AddItemToJobForm` para seleccionar un ítem del catálogo y especificar la cantidad.
- Uso de `React Query` o `SWR` para gestionar los ítems de un instalación.

### Backend

- API Route `POST /api/trabajos/[id]/items` para asociar un ítem a un instalación.
- API Route `DELETE /api/trabajos/[id]/items/[itemId]` para desasociar un ítem.
- Las rutas deben verificar que el instalación y el ítem de catálogo pertenecen al usuario.

### Database

- Tabla asociativa `trabajos_items` con campos `trabajo_id` (FK a `instalaciones`), `item_id` (FK a `catalogo_items`) y `cantidad` (INTEGER).
- RLS en la tabla `trabajos_items`.

---

## Dependencies

### Blocked By

- STORY-SOL-19 - Define Labor Services
- STORY-SOL-20 - Define Materials
- STORY-SOL-23 - Create Job

### Blocks

- STORY-SOL-TBD - Generar una factura simple (requiere el desglose de ítems).

---

## Definition of Done

- [ ] Código implementado y funcionando (asociación y eliminación de ítems a un instalación).
- [ ] Tests unitarios (coverage > 80%) para componentes frontend y funciones backend.
- [ ] Tests de integración para las API Routes de `trabajos_items`.
- [ ] Tests E2E (Playwright) para el flujo de agregar y eliminar ítems de un instalación.
- [ ] Code review aprobado (2 reviewers).
- [ ] Documentación actualizada.
- [ ] Deployed to staging.
- [ ] QA testing passed.
- [ ] Acceptance criteria validated.
- [ ] No critical/high bugs open.

---

## Notes

La UI para agregar ítems debe ser eficiente, permitiendo búsquedas o filtros en el catálogo si la lista es larga.

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-SOL-22-gestion-instalaciones-instalacion/epic.md`
- **PRD:** `.context/PRD/mvp-scope.md` (US 3.4)
- **SRS:** `.context/SRS/functional-specs.md` (FR-010)
