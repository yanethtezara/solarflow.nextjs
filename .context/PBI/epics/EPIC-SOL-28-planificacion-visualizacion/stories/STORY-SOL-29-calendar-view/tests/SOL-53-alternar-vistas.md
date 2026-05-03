# SOL-53: Validar alternancia entre vista de lista y calendario

**Jira:** [SOL-53](https://yanethtezara.atlassian.net/browse/SOL-53)
**Status:** CANDIDATE
**Type:** Functional / UX
**Related Story:** SOL-30
**ROI Score:** 100

---

## Diseño del Test

Feature: View Toggle

@high @regression @automation-candidate @SOL-39-FIX
Scenario Outline: Validar alternancia entre vista de lista y calendario
Given el usuario se encuentra en "/dashboard/instalaciones"
And la vista inicial es "lista"
When el usuario hace clic en el botón de vista "Calendario"
Then el sistema oculta el componente trabajosList
And el sistema muestra el componente calendarView
When el usuario hace clic en el botón de vista "Lista"
Then el sistema oculta el componente calendarView
And el sistema muestra el componente trabajosList
