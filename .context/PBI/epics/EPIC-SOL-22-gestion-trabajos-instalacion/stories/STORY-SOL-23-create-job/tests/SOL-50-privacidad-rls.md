# SOL-50: Validar privacidad RLS en la gestión de instalaciones

**Jira:** [SOL-50](https://yanethtezara.atlassian.net/browse/SOL-50)
**Status:** CANDIDATE
**Type:** Security
**Related Story:** SOL-22
**ROI Score:** 125

---

## Diseño del Test

Feature: Jobs Privacy

@security @regression @automation-candidate @SOL-22-RLS
Scenario Outline: Validar privacidad RLS en la gestión de instalaciones
Given existe un "Usuario A" con {user_a_id} y sus instalaciones programados
And existe un "Usuario B" (usuario activo) con {user_b_id}
When el "Usuario B" solicita la lista de instalaciones vía "/api/trabajos"
And intenta acceder al detalle del instalación {trabajo_a_id} de Usuario A
Then el listado no debe contener registros de {user_a_id}
And el acceso directo a {trabajo_a_id} debe ser bloqueado por RLS
