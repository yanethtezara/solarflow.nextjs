# SOL-44: Validar bloqueo de borrado de cliente con instalaciones asociados

**Jira:** [SOL-44](https://yanethtezara.atlassian.net/browse/SOL-44)
**Status:** CANDIDATE
**Type:** Integrity
**Related Story:** SOL-16
**ROI Score:** 25

---

## Diseño del Test

Feature: Data Integrity

@critical @regression @automation-candidate @SOL-37-FIX
Scenario Outline: Validar bloqueo de borrado de cliente con instalaciones asociados
Given existe un cliente con {cliente_id} creado por el usuario activo
And existe al menos un instalación con {trabajo_id} asociado al {cliente_id}
When el usuario intenta eliminar el cliente con {cliente_id}
Then el sistema debe rechazar la solicitud de borrado
And se debe mostrar un mensaje de error de restricción de integridad
