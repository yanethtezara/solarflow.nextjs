# SOL-41: Validar login exitoso con credenciales válidas

**Jira:** [SOL-41](https://yanethtezara.atlassian.net/browse/SOL-41)
**Status:** CANDIDATE
**Type:** Functional
**Related Story:** SOL-12
**ROI Score:** 125

---

## Código de Implementación

| Archivo                           | Propósito           |
| :-------------------------------- | :------------------ |
| app/login/page.tsx                | Página de Login     |
| src/components/auth/LoginForm.tsx | Formulario de Login |

## Arquitectura

- **Data Fetching:** Client-side via Supabase SDK.
- **Componente principal:** `LoginForm`.

## Test IDs Disponibles

```
data-testid="email_input"
data-testid="password_input"
data-testid="submit_button"
```

---

## Variables del Test Case

| Variable   | Descripción     | Cómo obtenerla                       |
| :--------- | :-------------- | :----------------------------------- |
| {email}    | Email de prueba | SELECT email FROM auth.users LIMIT 1 |
| {password} | Clave fija      | Usar credenciales de QA              |

---

## Diseño del Test

Feature: User Authentication

@critical @regression @automation-candidate @SOL-12-TC1
Scenario Outline: Validar login exitoso con credenciales válidas
Given existe un usuario con {email} y {password} en la base de datos
And el email {email} está confirmado en Supabase Auth
When el usuario navega a "/login"
And el usuario ingresa {email} en el campo de email
And el usuario ingresa {password} en el campo de contraseña
And el usuario hace clic en el botón de "Iniciar Sesión"
Then el sistema redirige al usuario a "/dashboard"
And se muestra un mensaje de bienvenida en el header
