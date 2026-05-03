# SOL-56: Validar generación de factura con cálculos automáticos correctos

**Jira:** [SOL-56](https://yanethtezara.atlassian.net/browse/SOL-56)
**Status:** CANDIDATE
**Type:** Functional / Business Logic
**Related Story:** SOL-33
**ROI Score:** 25

---

## Diseño del Test

Feature: Invoice Generation Logic

@critical @regression @automation-candidate @SOL-33-TC1
Scenario Outline: Validar generación de factura con cálculos automáticos correctos
Given existe un instalación con {trabajo*id} en estado "completado"
And tiene asociados {N} materiales con {costo_m} y {M} servicios con {costo_s}
When el usuario navega a la página de factura del instalación {trabajo_id}
Then el sistema muestra el desglose de todos los ítems asociados
And el Subtotal debe ser igual a ({N} * {costo*m}) + ({M} * {costo_s})
And el Total debe coincidir con el Subtotal
