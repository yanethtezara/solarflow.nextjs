# SOL-57: Validar disponibilidad de la función de impresión/PDF

**Jira:** [SOL-57](https://yanethtezara.atlassian.net/browse/SOL-57)
**Status:** CANDIDATE
**Type:** Functional
**Related Story:** SOL-35
**ROI Score:** 80

---

## Diseño del Test

Feature: Invoice Export

@high @regression @automation-candidate @SOL-35-TC1
Scenario Outline: Validar disponibilidad de la función de impresión/PDF
Given el usuario se encuentra visualizando una factura generada
When el usuario localiza el botón "Imprimir o Guardar PDF"
Then el botón debe estar visible y habilitado
And al hacer clic, debe disparar el diálogo de impresión del sistema (window.print)
