# Como Javi, quiero poder generar una vista de factura para un trabajo "Completado" con un solo clic, que calcule automáticamente el total sumando la mano de obra y los materiales.

**Jira Key:** SOL-33
**Epic:** SOL-32 (Facturación Simple)
**Priority:** High
**Story Points:** 5
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** Javi
**I want to** poder generar una vista de factura para un trabajo "Completado" con un solo clic, que calcule automáticamente el total sumando la mano de obra y los materiales
**So that** saber qué está listo para facturar

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

-   Botón "Generar Factura" visible en la vista de detalle de un trabajo solo si el estado es "Completado".
-   Al hacer clic, se carga una página/componente con la vista previa de la factura.
-   La vista previa debe mostrar:
    -   Detalle de los ítems asociados al trabajo (nombre, cantidad, precio/costo unitario, subtotal).
    -   Cálculo automático del total del trabajo (suma de todos los ítems).

### Out of Scope

-   Personalización del diseño de la factura (se cubre en otra US).
-   Gestión de impuestos (IVA, etc.).
-   Números de factura o series.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Generar vista de factura para trabajo completado

-   **Given:** Javi tiene un trabajo "Instalación Panel Solar" con estado "Completado"
-   **And:** este trabajo tiene 5 "Paneles Solares" a 200€ cada uno y 1 "Instalación Básica" a 150€
-   **When:** Javi navega a los detalles del trabajo "Instalación Panel Solar"
-   **And:** hace clic en el botón "Generar Factura"
-   **Then:** se muestra una vista previa de la factura
-   **And:** la vista previa muestra los 5 "Paneles Solares" y la "Instalación Básica"
-   **And:** el total calculado es de 1150€ (5*200 + 150)

### Scenario: No poder generar factura para trabajo no completado

-   **Given:** Javi tiene un trabajo "Mantenimiento Preventivo" con estado "Agendado"
-   **When:** Javi navega a los detalles del trabajo "Mantenimiento Preventivo"
-   **Then:** el botón "Generar Factura" no está visible o está deshabilitado
-   **And:** Javi no puede acceder a la vista previa de la factura

### Scenario: Recalcular total automáticamente al añadir/eliminar ítems (previo al completado)

-   **Given:** Javi está viendo la vista previa de una factura
-   **And:** el trabajo asociado tiene ítems con precios
-   **When:** el trabajo asociado se actualiza (ej. se añade un nuevo ítem o se elimina uno)
-   **Then:** el total de la factura en la vista previa se recalcula automáticamente

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

-   Solo se puede generar una vista previa de factura para trabajos con estado "Completado".
-   El cálculo del total debe ser la suma de (cantidad * precio_unitario) para todos los ítems asociados al trabajo.

---

## Technical Notes

### Frontend

-   Componente `InvoicePreview` para mostrar la factura.
-   Lógica para activar/desactivar el botón "Generar Factura" según el estado del trabajo.
-   Manejo de estados de carga y errores al obtener los datos de la factura.

### Backend

-   API Route `GET /api/facturas/[jobId]` que obtiene todos los detalles del trabajo, sus ítems asociados y calcula el total.
-   La ruta debe verificar la pertenencia del trabajo al usuario y su estado "Completado".

### Database

-   Consulta compleja que une `trabajos`, `trabajos_items` y `catalogo_items` para obtener todos los detalles de la factura.
-   RLS en todas las tablas involucradas.

---

## Dependencies

### Blocked By

-   STORY-SOL-27 - Marcar trabajo como "Completado".
-   STORY-SOL-26 - Agregar materiales y mano de obra a un trabajo.

### Blocks

-   STORY-SOL-TBD - Personalización de la factura.
-   STORY-SOL-TBD - Descargar factura en PDF.

---

## Definition of Done

-   [ ] Código implementado y funcionando (generación de vista previa de factura con cálculo de total).
-   [ ] Tests unitarios (coverage > 80%) para el cálculo del total y el componente de la vista previa.
-   [ ] Tests de integración para la API Route de generación de datos de factura.
-   [ ] Tests E2E (Playwright) para el flujo de generar y visualizar la factura.
-   [ ] Code review aprobado (2 reviewers).
-   [ ] Documentación actualizada.
-   [ ] Deployed to staging.
-   [ ] QA testing passed.
-   [ ] Acceptance criteria validated.
-   [ ] No critical/high bugs open.

---

## Notes

La vista previa debe ser clara y fácil de entender para el usuario, reflejando fielmente lo que se imprimirá en el PDF.

---

## Related Documentation

-   **Epic:** `.context/PBI/epics/EPIC-SOL-32-facturacion-simple/epic.md`
-   **PRD:** `.context/PRD/mvp-scope.md` (US 6.1), `.context/PRD/user-journeys.md` (Journey 1: Step 6)
-   **SRS:** `.context/SRS/functional-specs.md`
