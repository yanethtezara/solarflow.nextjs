# SOL-54: Validar sincronización de datos entre DB y calendario

**Jira:** [SOL-54](https://yanethtezara.atlassian.net/browse/SOL-54)
**Status:** CANDIDATE
**Type:** Integration
**Related Story:** SOL-29
**ROI Score:** 31.3

---

## Diseño del Test

Feature: Calendar Data Synchronization

@critical @regression @automation-candidate
Scenario Outline: Validar sincronización de datos entre DB y calendario
Given existe un instalación con {trabajo_id} agendado para la {fecha}
And el usuario se encuentra en la vista mensual del calendario
When el usuario navega al mes correspondiente a la {fecha}
Then el día {fecha} debe mostrar un indicador de instalación
And al seleccionar el día, el detalle debe mostrar el {trabajo_id}
