# Como Javi, quiero poder descargar la factura en formato PDF para poder enviarla fácilmente a la empresa contratante.

**Jira Key:** SOL-35
**Epic:** SOL-32 (Facturación Simple)
**Priority:** Medium
**Story Points:** 5
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** Javi
**I want to** poder descargar la factura en formato PDF
**So that** poder enviarla fácilmente a la empresa contratante

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

-   Botón "Descargar PDF" visible en la página de vista previa de la factura.
-   Generación de un archivo PDF a partir de la vista previa de la factura.
-   El PDF debe contener el mismo formato y todos los datos visibles en la vista previa.
-   Nombre de archivo descriptivo para el PDF.

### Out of Scope

-   Envío automático del PDF por correo electrónico.
-   Múltiples formatos de descarga (ej. CSV, Excel).
-   Edición del PDF una vez generado.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Descargar factura en formato PDF

-   **Given:** Javi está viendo la vista previa de una factura
-   **When:** hace clic en el botón "Descargar PDF"
-   **Then:** el navegador descarga un archivo PDF con la factura
-   **And:** el nombre del archivo PDF es descriptivo (ej. "Factura_SOL-TRABAJO-XXX_Cliente.pdf")
-   **And:** el contenido del PDF es idéntico a la vista previa de la factura

### Scenario: Contenido del PDF incluye todos los detalles

-   **Given:** Javi ha descargado una factura en PDF
-   **When:** abre el archivo PDF
-   **Then:** el PDF contiene los datos de la empresa de Javi, el logo (si aplica), los datos del cliente, el desglose de ítems y el total final.

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

-   El nombre del archivo PDF debe incluir el identificador del trabajo y el nombre del cliente para facilitar la identificación.
-   El contenido del PDF debe ser una representación fiel y no editable de la vista previa.

---

## Technical Notes

### Frontend

-   En el componente `InvoicePreview`, se añade un botón "Descargar PDF".
-   Al hacer clic, se puede utilizar una librería como `jsPDF` o `html2canvas` para generar el PDF directamente en el navegador a partir del DOM de la vista previa, o hacer una llamada a una API de backend para la generación.

### Backend

-   Si la generación del PDF se hace en backend, se necesitará una API Route `GET /api/facturas/[jobId]/pdf` que utilice una librería (ej. `puppeteer`, `wkhtmltopdf`) para renderizar el HTML de la factura a PDF y enviarlo como respuesta.

### Database

-   No se requiere manipulación de la base de datos específica para la descarga, solo la consulta de los datos de la factura.

---

## Dependencies

### Blocked By

-   STORY-SOL-33 - Generar vista previa de factura.
-   STORY-SOL-34 - Personalización de la factura (se necesita el contenido para generar el PDF).

### Blocks

-   Ninguna.

---

## Definition of Done

-   [ ] Código implementado y funcionando (descarga de factura en PDF).
-   [ ] Tests unitarios (coverage > 80%) para la lógica de generación/descarga del PDF.
-   [ ] Tests E2E (Playwright) para el flujo completo de descarga de la factura.
-   [ ] Code review aprobado (2 reviewers).
-   [ ] Documentación actualizada.
-   [ ] Deployed to staging.
-   [ ] QA testing passed.
-   [ ] Acceptance criteria validated.
-   [ ] No critical/high bugs open.

---

## Notes

Se debe considerar si la generación de PDF se hará completamente en el frontend (más carga para el cliente, más rápido para el servidor) o en el backend (más carga para el servidor, resultados más consistentes). Para el MVP, la opción de frontend puede ser más rápida de implementar.

---

## Related Documentation

-   **Epic:** `.context/PBI/epics/EPIC-SOL-32-facturacion-simple/epic.md`
-   **PRD:** `.context/PRD/mvp-scope.md` (US 6.3), `.context/PRD/user-journeys.md` (Journey 1: Step 7)
-   **SRS:** `.context/SRS/functional-specs.md`
