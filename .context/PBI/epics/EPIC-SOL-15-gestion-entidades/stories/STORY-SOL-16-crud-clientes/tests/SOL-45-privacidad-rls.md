# SOL-45: Validar privacidad RLS en el listado de clientes

**Jira:** [SOL-45](https://yanethtezara.atlassian.net/browse/SOL-45)
**Status:** CANDIDATE
**Type:** Security
**Related Story:** SOL-16
**ROI Score:** 100

---

## Diseño del Test

Feature: Privacy and RLS

@security @regression @automation-candidate @SOL-16-RLS
Scenario Outline: Validar privacidad RLS en el listado de clientes
Given existe un "Usuario A" con {user_a_id} y sus clientes asociados
And existe un "Usuario B" (usuario activo) con {user_b_id}
When el "Usuario B" solicita la lista de todos los clientes vía "/api/clientes"
Then la respuesta no debe contener ningún registro cuyo user_id sea {user_a_id}
And todos los registros devueltos deben pertenecer a {user_b_id}
