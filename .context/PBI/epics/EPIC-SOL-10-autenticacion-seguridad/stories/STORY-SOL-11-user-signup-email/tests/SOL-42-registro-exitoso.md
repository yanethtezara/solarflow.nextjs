# SOL-42: Validar registro exitoso con email único

**Jira:** [SOL-42](https://yanethtezara.atlassian.net/browse/SOL-42)
**Status:** CANDIDATE
**Type:** Functional
**Related Story:** SOL-11
**ROI Score:** 10

---

## Código de Implementación

| Archivo                                  | Propósito              |
| :--------------------------------------- | :--------------------- |
| app/signup/page.tsx                      | Página de Registro     |
| src/components/auth/RegistrationForm.tsx | Formulario de Registro |

## Arquitectura

- **Data Fetching:** Client-side via Supabase SDK.
- **Trigger DB:** `on_auth_user_created` (Crea perfil automáticamente).

## Test IDs Disponibles

```
data-testid="email_input"
data-testid="password_input"
data-testid="submit_button"
```

---

## Variables del Test Case

| Variable    | Descripción | Cómo obtenerla        |
| :---------- | :---------- | :-------------------- |
| {new_email} | Email único | Generar con timestamp |

---

## Diseño del Test

Feature: User Registration

@critical @regression @automation-candidate @SOL-11-TC1
Scenario Outline: Validar registro exitoso con email único
Given el email {new_email} no existe en la base de datos
When el usuario navega a "/signup"
And el usuario ingresa {new_email} en el campo email
And el usuario ingresa {password} válido
And el usuario hace clic en "Crear Cuenta"
Then el sistema crea un nuevo registro en auth.users
And el sistema crea un perfil en public.profiles
And el usuario es redirigido a "/dashboard"
