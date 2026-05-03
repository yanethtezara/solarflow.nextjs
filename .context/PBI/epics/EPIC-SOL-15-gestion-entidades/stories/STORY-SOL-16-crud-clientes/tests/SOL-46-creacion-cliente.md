# SOL-46: Validar creación exitosa de un nuevo cliente

**Jira:** [SOL-46](https://yanethtezara.atlassian.net/browse/SOL-46)
**Status:** CANDIDATE
**Type:** Functional
**Related Story:** SOL-16
**ROI Score:** 20

---

## Diseño del Test

Feature: Client Management

@high @regression @automation-candidate
Scenario Outline: Validar creación exitosa de un nuevo cliente
Given el usuario está autenticado
And se encuentra en el formulario de "Nuevo Cliente"
When el usuario completa el formulario con {nombre}, {direccion} y {telefono}
And el usuario hace clic en el botón "Guardar"
Then el sistema muestra el mensaje "Cliente creado correctamente."
And el nuevo cliente aparece en la lista de clientes del dashboard
