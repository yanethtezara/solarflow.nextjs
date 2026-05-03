# Facturación Simple

**Jira Key:** SOL-32
**Status:** To Do
**Priority:** High
**Phase:** Business Value

---

## Epic Description

Esta épica se centra en la funcionalidad de generar facturas de manera sencilla a partir de los instalaciones completados. Permite visualizar, personalizar con el logo del negocio y descargar la factura en formato PDF.

**Business Value:**
Agiliza significativamente el proceso de cobro para el instalador, mejorando el flujo de caja y la profesionalidad de sus servicios. Elimina la necesidad de herramientas externas para la facturación básica.

---

## User Stories

1. **SOL-33** - As a Javi, I want to poder generar una vista de factura para un instalación "Completado" con un solo clic, que calcule automáticamente el total sumando la mano de obra y los materiales.
2. **SOL-34** - As a David, I want to que la factura generada incluya los datos de mi empresa, los datos del cliente, el desglose de conceptos y el logo de mi negocio para que sea profesional.
3. **SOL-35** - As a Javi, I want to poder descargar la factura en formato PDF para poder enviarla fácilmente a la empresa contratante.

**NOTA:** Los IDs serán actualizados conforme me los proporciones.

---

## Scope

### In Scope

- Generación de una vista previa de factura para instalaciones con estado "Completado".
- Cálculo automático del total basado en los ítems asociados al instalación.
- Inclusión de datos del negocio del usuario, datos del cliente y desglose de ítems.
- Opción para descargar la factura en formato PDF.

### Out of Scope (Future)

- Envío automático de facturas por email.
- Integración con sistemas de contabilidad (QuickBooks, Xero).
- Múltiples plantillas de factura.
- Gestión de impuestos avanzados (IVA, etc.) de forma configurable.
- Pagos en línea.

---

## Acceptance Criteria (Epic Level)

1. ✅ Un usuario puede generar una factura para cualquier instalación completado.
2. ✅ La factura incluye toda la información relevante de forma profesional.
3. ✅ La factura puede ser descargada como PDF.

---

## Related Functional Requirements

- **FR-XXX:** (Se generarán FRs específicos para cada US de esta épica)

See: `.context/SRS/functional-specs.md` (Nota: Los FRs para esta épica no están detallados aún en el `functional-specs.md` que he leído, se asumirá que se crearán siguiendo el patrón).

---

## Technical Considerations

### Backend

- API Route para generar los datos de la factura a partir de un `trabajoId`.
- API Route para generar el PDF de la factura (quizás usando una librería para generación de PDF o un servicio externo).

### Database Schema

- Utiliza las tablas `instalaciones`, `trabajos_items`, `catalogo_items`, `clientes`, `empresas`.
- Necesitará una tabla de configuración de usuario para los "Datos de mi empresa" y el "Logo de mi negocio".

### Security Requirements

- RLS para todos los datos subyacentes de las tablas involucradas.
- Asegurar que solo el propietario de un instalación puede generar su factura.

---

## Dependencies

### External Dependencies

- Librería/servicio de generación de PDF (ej. `html-pdf`, `puppeteer` en el backend, o `jsPDF` en el frontend).
- Posiblemente un servicio de almacenamiento para el logo (ej. Supabase Storage, si se implementa).

### Internal Dependencies

- EPIC-SOL-10: Autenticación y Seguridad de Cuenta.
- EPIC-SOL-15: Gestión de Entidades (Clientes y Empresas).
- EPIC-SOL-18: Catálogo de Servicios y Materiales.
- EPIC-SOL-22: Gestión de Instalaciones de Instalación (Core) (especialmente la US de "Completar instalación" y "Agregar ítems").

### Blocks

- Ninguna.

---

## Success Metrics

### Functional Metrics

- Tiempo de generación de vista previa de factura < 2 segundos.
- Tiempo de generación de PDF < 5 segundos.

### Business Metrics

- Tasa de Generación de Facturas > 70% (instalaciones marcados como "Completado" tienen una factura generada).

---

## Risks & Mitigations

| Risk                             | Impact | Probability | Mitigation                                                                                              |
| :------------------------------- | :----- | :---------- | :------------------------------------------------------------------------------------------------------ |
| Complejidad de generación de PDF | Medium | Medium      | Usar una librería robusta y bien documentada o un servicio de terceros. Empezar con un template simple. |
| Datos inconsistentes en factura  | Low    | Low         | Validaciones estrictas en el backend al generar la factura. Pruebas exhaustivas.                        |

---

## Notes

La vista de factura debe ser un "read-only" del instalación y sus ítems en el momento de la generación, para evitar inconsistencias si el instalación se edita después.
Es importante definir un template de factura claro y profesional.
