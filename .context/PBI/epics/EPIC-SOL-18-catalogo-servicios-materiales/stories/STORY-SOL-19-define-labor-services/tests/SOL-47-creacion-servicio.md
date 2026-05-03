# SOL-47: Validar creación exitosa de un servicio de mano de obra

**Jira:** [SOL-47](https://yanethtezara.atlassian.net/browse/SOL-47)
**Status:** CANDIDATE
**Type:** Functional
**Related Story:** SOL-19
**ROI Score:** 20

---

## Diseño del Test

Feature: Catalog Management

@high @regression @automation-candidate @SOL-19-TC1
Scenario Outline: Validar creación exitosa de un servicio de mano de obra
Given el usuario está autenticado
And se encuentra en la sección "Catálogo de Servicios"
When el usuario hace clic en "Nuevo Servicio"
And completa el formulario con {nombre}, {precio} y tipo "Mano de Obra"
And hace clic en "Guardar"
Then el sistema muestra el mensaje "Servicio creado correctamente."
And el servicio {nombre} aparece en la lista con precio {precio}
