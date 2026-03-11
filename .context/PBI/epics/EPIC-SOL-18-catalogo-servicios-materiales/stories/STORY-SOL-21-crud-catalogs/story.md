# Como Javi, quiero que los catálogos de mano de obra y materiales sean editables (CRUD) para mantener mis precios y lista de productos actualizados.

**Jira Key:** SOL-21
**Epic:** SOL-18 (Catálogo de Servicios y Materiales)
**Priority:** Medium
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** Javi
**I want to** que los catálogos de mano de obra y materiales sean editables (CRUD)
**So that** mantener mis precios y lista de productos actualizados

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

-   Funcionalidad de edición para ítems de catálogo (mano de obra y materiales).
-   Funcionalidad de eliminación para ítems de catálogo (mano de obra y materiales) con confirmación.
-   Actualización de los datos del ítem en la base de datos.
-   Asegurar que solo el propietario del ítem pueda editarlo/eliminarlo.

### Out of Scope

-   Desactivar ítems de catálogo en lugar de eliminarlos permanentemente.
-   Historial de cambios de precios/costos.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Editar un servicio de mano de obra existente

-   **Given:** Javi tiene un servicio de mano de obra "Instalación Eléctrica" con precio "100.00" en su catálogo
-   **When:** Javi navega a la lista de servicios, selecciona "Instalación Eléctrica", hace clic en "Editar"
-   **And:** cambia el precio a "120.00" y hace clic en "Guardar"
-   **Then:** el servicio "Instalación Eléctrica" ahora muestra el precio de "120.00" en la lista

### Scenario: Eliminar un material del catálogo

-   **Given:** Javi tiene un material "Cable de 2.5mm" en su catálogo
-   **When:** Javi navega a la lista de materiales, selecciona "Cable de 2.5mm", hace clic en "Eliminar"
-   **And:** confirma la acción
-   **Then:** el material "Cable de 2.5mm" ya no aparece en la lista de materiales

### Scenario: Editar un material existente

-   **Given:** Javi tiene un material "Inversor Central" con costo "1000.00" en su catálogo
-   **When:** Javi navega a la lista de materiales, selecciona "Inversor Central", hace clic en "Editar"
-   **And:** cambia el costo a "1100.00" y hace clic en "Guardar"
-   **Then:** el material "Inversor Central" ahora muestra el costo de "1100.00" en la lista

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

-   El nombre y el precio/costo son obligatorios para la edición.
-   Los ítems eliminados no se pueden recuperar.
-   Solo el `user_id` propietario puede modificar o eliminar sus ítems de catálogo.

---

## Technical Notes

### Frontend

-   Modificación de los componentes `LaborServiceList` y `MaterialList` para incluir botones de edición y eliminación.
-   Reutilización de los formularios de creación para la edición.
-   Diálogo de confirmación para la eliminación.

### Backend

-   API Routes `PUT /api/catalogo-items/[id]` y `DELETE /api/catalogo-items/[id]`.
-   Asegurar que las operaciones respeten el `user_id` y RLS.

### Database

-   Operaciones `UPDATE` y `DELETE` en la tabla `catalogo_items`.
-   RLS es crucial para esta funcionalidad.

---

## Dependencies

### Blocked By

-   STORY-SOL-19 - Define Labor Services (se requiere tener servicios para editar/eliminar).
-   STORY-SOL-20 - Define Materials (se requiere tener materiales para editar/eliminar).

### Blocks

-   Ninguna.

---

## Definition of Done

-   [ ] Código implementado y funcionando (CRUD completo para ítems de catálogo).
-   [ ] Tests unitarios (coverage > 80%) para componentes frontend y funciones backend.
-   [ ] Tests de integración para las API Routes de edición/eliminación de ítems de catálogo.
-   [ ] Tests E2E (Playwright) para flujos de edición y eliminación.
-   [ ] Code review aprobado (2 reviewers).
-   [ ] Documentación actualizada.
-   [ ] Deployed to staging.
-   [ ] QA testing passed.
-   [ ] Acceptance criteria validated.
-   [ ] No critical/high bugs open.

---

## Notes

La seguridad (RLS) es de suma importancia en la edición y eliminación de datos.

---

## Related Documentation

-   **Epic:** `.context/PBI/epics/EPIC-SOL-18-catalogo-servicios-materiales/epic.md`
-   **PRD:** `.context/PRD/mvp-scope.md` (US 5.3)
-   **SRS:** `.context/SRS/functional-specs.md`
