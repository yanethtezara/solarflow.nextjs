# Acceptance Test Plan: STORY-SOL-13 - Recuperar mi contraseña

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-13
**Epic:** EPIC-SOL-10 - Autenticación y Seguridad de Cuenta
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Javi Morales - Usuario que no usa la app a diario y puede olvidar su clave.
  **Business Value:**
- **Value Proposition:** Autogestión de credenciales.
- **Business Impact:** Reduce carga de soporte técnico manual.

### Technical Context of This Story

**Frontend:**

- Pages: `/forgot-password`, `/reset-password`.
- Component: `ResetPasswordForm`.
  **Backend:**
- Services: `resetPasswordForEmail`, `updateUser` (Supabase).
- Email Infrastructure: Supabase SMTP.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿El usuario queda logueado tras cambiar la contraseña?
  - **Suggested Clarification:** Sí, Supabase suele loguear al usuario tras el reset exitoso.

### Missing Information / Gaps

- **Gap 1:** Validación de que la "nueva contraseña" no sea igual a la "actual". (Supabase no lo valida por defecto, requiere lógica extra).

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Solicitud de recuperación (Happy Path)

- **When:** Javi ingresa su email.
- **Then:** Recibe email y ve mensaje de confirmación genérico.

### Scenario 2: Cambio de clave exitoso

- **Given:** Token válido en la URL.
- **When:** Ingresa clave robusta.
- **Then:**
  - Password actualizado en `auth.users`.
  - Redirección a login o dashboard.

### Scenario 3: Link expirado

- **When:** Usa un link de hace 24 horas.
- **Then:** Error claro "Enlace expirado" y CTA para solicitar nuevo.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar solicitud de recuperación exitosa**

- **Type:** Positive | **Level:** Integration
- **Expected Result:** Supabase responde 200 OK.

#### **Validar restablecimiento de contraseña con token válido**

- **Type:** Positive | **Level:** E2E
- **Expected Result:** El usuario puede entrar con la nueva contraseña.

#### **Validar mensaje genérico en solicitud para email no registrado**

- **Type:** Negative (Security) | **Level:** UI
- **Expected Result:** El sistema NO debe decir "Email no encontrado". Debe decir "Si el email existe...".

---

## 🎯 Definition of Done (QA)

- [ ] Flujo de email validado (Envío y recepción de token).
- [ ] Token de un solo uso (no reutilizable tras éxito).
- [ ] Validación de fortaleza en la nueva contraseña.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
