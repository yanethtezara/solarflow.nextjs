# SOL-43: Validar cierre de sesión exitoso e invalidación de token

**Jira:** [SOL-43](https://yanethtezara.atlassian.net/browse/SOL-43)
**Status:** CANDIDATE
**Type:** Functional
**Related Story:** SOL-14
**ROI Score:** 45

---

## Código de Implementación

| Archivo                          | Propósito                 |
| :------------------------------- | :------------------------ |
| src/components/SignOutButton.tsx | Botón de cierre de sesión |
| middleware.ts                    | Protección de rutas       |

## Test IDs Disponibles

```
data-testid="sign_out_button"
```

---

## Diseño del Test

Feature: Session Management

@critical @regression @automation-candidate @SOL-14-TC1
Scenario Outline: Validar cierre de sesión exitoso e invalidación de token
Given el usuario tiene una sesión activa
And el usuario se encuentra en el "/dashboard"
When el usuario hace clic en el botón "Cerrar Sesión"
Then el sistema redirige al usuario a la página de "/login"
And el token de sesión es invalidado en Supabase Auth
And el usuario no puede volver al "/dashboard"
