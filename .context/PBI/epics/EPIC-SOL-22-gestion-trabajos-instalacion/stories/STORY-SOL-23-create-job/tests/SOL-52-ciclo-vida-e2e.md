# SOL-52: Validar ciclo de vida exitoso de un instalación (Crear → Completar)

**Jira:** [SOL-52](https://yanethtezara.atlassian.net/browse/SOL-52)
**Status:** CANDIDATE
**Type:** E2E
**Related Story:** SOL-23, SOL-27
**ROI Score:** 11.1

---

## Diseño del Test

Feature: Master Job Flow

@smoke @regression @automation-candidate
Scenario Outline: Validar ciclo de vida exitoso de un instalación (Crear → Completar)
When el usuario crea un nuevo instalación para {cliente_id}
And el usuario agrega ítems del catálogo al instalación
And el usuario cambia el estado a "En Progreso"
And el usuario marca el instalación como "Completado"
Then el estado final en la base de datos debe ser "completado"
And el instalación debe ser visible para facturación
