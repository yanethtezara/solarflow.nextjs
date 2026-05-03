# SOL-55: Validar visualización horaria en vista semanal

**Jira:** [SOL-55](https://yanethtezara.atlassian.net/browse/SOL-55)
**Status:** CANDIDATE
**Type:** Functional
**Related Story:** SOL-29
**ROI Score:** 16

---

## Diseño del Test

Feature: Weekly Planning Visualization

@medium @regression @automation-candidate @SOL-39-FIX
Scenario Outline: Validar visualización horaria en vista semanal
Given existe un trabajo con {id} a las {hora}
And el usuario se encuentra en el calendario
When el usuario selecciona la "Vista Semanal"
Then el sistema muestra una cuadrícula con horas de 08:00 a 20:00
And el trabajo con {id} aparece posicionado en el bloque de las {hora}
