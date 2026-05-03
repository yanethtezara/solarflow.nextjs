# SOL-51: Validar cálculo exacto del total del trabajo según ítems

**Jira:** [SOL-51](https://yanethtezara.atlassian.net/browse/SOL-51)
**Status:** CANDIDATE
**Type:** Functional / Business Logic
**Related Story:** SOL-26
**ROI Score:** 100

---

## Diseño del Test

Feature: Job Totals Calculation

@high @regression @automation-candidate @SOL-26-CALC
Scenario Outline: Validar cálculo exacto del total del trabajo según ítems
Given existe un trabajo con {trabajo_id}
And se han agregado {qty1} del ítem {material_id} con precio {price1}
And se han agregado {qty2} del ítem {labor_id} con precio {price2}
When el sistema calcula el total del trabajo
Then el total debe ser exactamente {total_esperado}
And {total_esperado} = ({qty1} _ {price1}) + ({qty2} _ {price2})
