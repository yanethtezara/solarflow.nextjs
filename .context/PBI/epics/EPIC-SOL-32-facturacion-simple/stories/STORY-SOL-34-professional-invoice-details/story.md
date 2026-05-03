# Como David, quiero que la factura generada incluya los datos de mi empresa, los datos del cliente, el desglose de conceptos y el logo de mi negocio para que sea profesional.

**Jira Key:** SOL-34
**Epic:** SOL-32 (Facturación Simple)
**Priority:** High
**Story Points:** 3
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** David
**I want to** que la factura generada incluya los datos de mi empresa, los datos del cliente, el desglose de conceptos y el logo de mi negocio
**So that** sea profesional

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

- La vista previa de la factura debe integrar:
  - Datos del usuario/empresa (configurable en perfil de usuario, ej. nombre fiscal, dirección, NIF).
  - Logo del negocio (permitir subir una imagen en el perfil de usuario o usar un placeholder).
  - Datos del cliente (nombre y dirección) obtenidos del registro del cliente.
  - Tabla con desglose de ítems: nombre, cantidad, precio unitario, subtotal, total.

### Out of Scope

- Personalización avanzada de la plantilla de factura.
- Campos fiscales adicionales (ej. retenciones, descuentos por pronto pago).
- Múltiples logos o plantillas por usuario.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Factura con datos de la empresa del usuario

- **Given:** David ha configurado los datos de su empresa en su perfil
- **When:** genera la vista previa de una factura
- **Then:** la factura muestra el nombre, dirección y NIF de la empresa de David (como emisor)
- **And:** el logo de su negocio (si ha sido subido) aparece en la cabecera de la factura

### Scenario: Factura con datos del cliente

- **Given:** David genera una factura para un instalación asociado al "Cliente X"
- **When:** visualiza la factura
- **Then:** la factura muestra el nombre y la dirección del "Cliente X" (como receptor)

### Scenario: Factura con desglose de ítems claro

- **Given:** David genera una factura para un instalación con varios ítems asociados
- **When:** visualiza la factura
- **Then:** la factura muestra una tabla con cada ítem (material o servicio), su cantidad, precio unitario, subtotal
- **And:** el total final de la factura es claramente visible

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

- Los datos de la empresa del usuario y el logo son opcionales, pero si se proporcionan, deben aparecer en la factura.
- Los datos del cliente se obtienen del cliente asociado al instalación.

---

## Technical Notes

### Frontend

- El componente `InvoicePreview` debe ser capaz de renderizar los datos de la empresa, el cliente y el logo.
- Formulario de configuración de perfil para que el usuario pueda introducir los datos de su empresa y subir el logo.

### Backend

- API Route para obtener la configuración del perfil del usuario (datos de empresa, URL del logo).
- La API de facturas debe ensamblar toda esta información.

### Database

- Nueva tabla `user_profiles` (o similar) para almacenar los datos de la empresa y la URL del logo, asociada al `user_id`.
- Supabase Storage para almacenar el logo.

---

## Dependencies

### Blocked By

- STORY-SOL-33 - Generar vista previa de factura.

### Blocks

- STORY-SOL-TBD - Descargar factura en PDF (el PDF debe incluir estos detalles).

---

## Definition of Done

- [ ] Código implementado y funcionando (factura con datos de empresa, cliente, desglose y logo).
- [ ] Tests unitarios (coverage > 80%) para el componente de vista previa y la API que obtiene los datos.
- [ ] Tests E2E (Playwright) para verificar que todos los datos aparecen correctamente en la factura.
- [ ] Code review aprobado (2 reviewers).
- [ ] Documentación actualizada.
- [ ] Deployed to staging.
- [ ] QA testing passed.
- [ ] Acceptance criteria validated.
- [ ] No critical/high bugs open.

---

## Notes

La gestión de la subida del logo y su almacenamiento en Supabase Storage es un punto clave aquí.

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-SOL-32-facturacion-simple/epic.md`
- **PRD:** `.context/PRD/mvp-scope.md` (US 6.2)
- **SRS:** `.context/SRS/functional-specs.md`
