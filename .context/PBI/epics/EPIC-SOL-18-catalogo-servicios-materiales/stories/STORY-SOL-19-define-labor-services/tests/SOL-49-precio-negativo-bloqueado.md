# SOL-49: Validar bloqueo de creación de ítem con precio negativo

**Jira:** [SOL-49](https://yanethtezara.atlassian.net/browse/SOL-49)
**Status:** CANDIDATE
**Type:** Functional / Business Rule
**Related Story:** SOL-19, SOL-20
**ROI Score:** 80

---

## Diseño del Test

Feature: Catalog Validation Rules

@high @regression @automation-candidate @SOL-38-FIX
Scenario Outline: Validar bloqueo de creación de ítem con precio negativo
Given el usuario está autenticado
And se encuentra en el formulario de creación de ítem de catálogo
When el usuario ingresa un {precio_negativo}
And intenta guardar el ítem
Then el sistema debe impedir el guardado
And se debe mostrar un mensaje de error de validación
And la base de datos debe rechazar la inserción
