# Implementation Plan: STORY-SOL-13 - Recuperar Contraseña vía Email

## Overview

Implementar el flujo de recuperación de acceso para usuarios que han olvidado su contraseña, asegurando que puedan restablecerla de forma segura mediante un enlace enviado a su correo.

**Acceptance Criteria a cumplir:**

- Solicitud de recuperación enviando un email con enlace único.
- Mensaje de confirmación informativo ("Si el email existe, recibirás un enlace").
- El enlace de recuperación expira en 1 hora.
- Página de restablecimiento de contraseña para ingresar la nueva clave.
- Redirección a `/login` tras el cambio exitoso.

---

## Technical Approach

**Chosen approach:** Implementar dos vistas principales: `/forgot-password` (solicitud) y `/reset-password` (cambio). Utilizaremos `supabase.auth.resetPasswordForEmail()` para disparar el flujo y `supabase.auth.updateUser()` para persistir la nueva clave. Se configurará el `Site URL` y `Redirect URLs` en Supabase para asegurar que el enlace del email devuelva al usuario a la ruta correcta de la aplicación.

**Why this approach:**

- ✅ **Flujo Estándar:** Sigue las mejores prácticas de seguridad de la industria.
- ✅ **Gestión de Tokens:** Supabase genera y valida los tokens temporales de forma automática y segura.
- ✅ **Separación de Responsabilidades:** Divide el proceso en pasos claros para el usuario.

---

## UI/UX Design

### Componentes a usar:

- **`ForgotPasswordForm`**: Captura el email del usuario.
- **`ResetPasswordForm`**: Captura y confirma la nueva contraseña.
- **`PasswordStrengthIndicator`**: Indicador visual de la robustez de la nueva clave.

### Estados de UI:

- **Solicitud Enviada:** Reemplazar el formulario por un mensaje de "Email enviado. Revisa tu bandeja de entrada".
- **Token Inválido:** Mostrar mensaje de error si el usuario llega con un link expirado y ofrecer botón de "Solicitar nuevo enlace".

---

## Types & Type Safety

**Tipos a usar:**

- Schema de Zod para solicitud:
  ```typescript
  const forgotSchema = z.object({ email: z.string().email() });
  ```
- Schema para el cambio:
  ```typescript
  const resetSchema = z
    .object({
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
    });
  ```

---

## Content Writing

- **Título (Solicitud):** "¿Olvidaste tu contraseña?"
- **Instrucción:** "Ingresa tu correo y te enviaremos las instrucciones para recuperarla."
- **Título (Reset):** "Nueva Contraseña"
- **Éxito:** "Contraseña actualizada. Ya puedes iniciar sesión con tu nueva clave."

---

## Implementation Steps

### **Step 1: Página de Solicitud (/forgot-password)**

**Task:** Crear la UI y conectar con la API de Supabase.
**Details:**

- Implementar `ForgotPasswordForm`.
- Llamar a `resetPasswordForEmail`.
  **Testing:** Verificar que al enviar un email válido se reciba el correo (usando Inbucket/Mailtrap en desarrollo).

### **Step 2: Página de Restablecimiento (/reset-password)**

**Task:** Crear la UI para el ingreso de la nueva clave.
**Details:**

- Validar que el usuario llegó mediante un hash de recuperación (Supabase maneja esto automáticamente si la ruta está bien configurada).
- Implementar `ResetPasswordForm` con validación de coincidencia.
  **Testing:** Intentar cambiar la clave con un link válido y verificar que la redirección al login ocurra.

### **Step 3: Configuración de Supabase Dashboard**

**Task:** Ajustar parámetros de expiración y URLs permitidas.
**Details:**

- Establecer tiempo de expiración del enlace a 3600 segundos (1 hora).
  **Testing:** Esperar 1 hora y validar que un link antiguo ya no permita el cambio.

---

## Dependencies

- [x] Servicio de correo configurado en Supabase (SMTP).
- [x] STORY-SOL-12 - Login Credentials (enlace desde el login).

---

## Risks & Mitigations

- **Riesgo:** SPAM de correos.
- **Mitigación:** Supabase aplica rate-limiting por defecto para el envío de correos de auth.

---

## Estimated Effort

- **Total:** 3 Story Points.
