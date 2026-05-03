# SOL-48: Validar privacidad RLS en el listado del catálogo

**Jira:** [SOL-48](https://yanethtezara.atlassian.net/browse/SOL-48)
**Status:** CANDIDATE
**Type:** Security
**Related Story:** SOL-18
**ROI Score:** 125

---

## Diseño del Test

Feature: Catalog Privacy

@security @regression @automation-candidate @SOL-18-RLS
Scenario Outline: Validar privacidad RLS en el listado del catálogo
Given existe un "Usuario A" con {user_a_id} y sus ítems de catálogo
And existe un "Usuario B" (usuario activo) con {user_b_id}
When el "Usuario B" solicita la lista del catálogo vía "/api/catalogo-items"
Then la respuesta no debe contener ningún registro de {user_a_id}
And todos los registros deben pertenecer a {user_b_id}
