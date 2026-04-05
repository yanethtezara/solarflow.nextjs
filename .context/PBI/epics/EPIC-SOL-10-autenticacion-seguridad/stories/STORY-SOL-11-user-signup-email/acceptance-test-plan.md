# Acceptance Test Plan: STORY-SOL-11 - Registrarme en la plataforma usando mi email y una contraseña

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-11
**Epic:** EPIC-SOL-10 - Autenticación y Seguridad de Cuenta
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Javi Morales - Necesita crear su cuenta para empezar a usar la app y dejar de usar el cuaderno.
  **Business Value:**
- **Value Proposition:** Primer paso para la centralización de datos.
- **Business Impact:** Crítico para la retención (AARRR - Acquisition).

### Technical Context of This Story

**Frontend:**

- Component: `RegistrationForm` (Next.js 15).
- Validation: Zod (client-side).
  **Backend:**
- API Route: `/api/auth/register`.
- Service: Supabase Auth SDK.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿El registro loguea al usuario automáticamente o debe ir al login?
  - **Question for PO/Dev:** ¿Cuál es el flujo esperado tras éxito?
  - **Suggested Clarification:** Autologin y redirección a `/dashboard`.

### Missing Information / Gaps

- **Gap 1:** Mensajes de error para campos vacíos o nulos.
- **Gap 2:** Validación de formato de email (regex).

### Edge Cases Identified

- **Edge Case 1:** Intento de registro sin conexión a internet.
- **Edge Case 2:** El servicio de Supabase Auth no responde (500).

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Registro exitoso (Happy Path)

- **Given:** Usuario no registrado en la página `/signup`.
- **When:** Ingresa `javi_test@solarflow.com` y `SolarPass123!`.
- **Then:**
  - Status code: 201 Created (API).
  - Redirección a `/dashboard`.
  - Toast: "¡Bienvenido a SolarFlow!".

### Scenario 2: Error por Email Duplicado

- **Given:** Email `javi_test@solarflow.com` ya existe.
- **When:** Se intenta registrar de nuevo.
- **Then:**
  - Error: "Este email ya está en uso."
  - Permanencia en `/signup`.

### Scenario 3: Validación de campos (Zod)

- **When:** Campos vacíos o email inválido.
- **Then:** Errores en línea específicos: "Email inválido", "Password muy corto".

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar registro exitoso con credenciales válidas**

- **Type:** Positive | **Level:** E2E (Playwright)
- **Test Steps:**
  1. Ir a `/signup`.
  2. Llenar email y password válidos.
  3. Clic en "Crear Cuenta".
- **Expected Result:** Redirección a `/dashboard`.

#### **Validar error de registro cuando el email ya existe**

- **Type:** Negative | **Level:** API (Vitest/Supertest)
- **Expected Result:** Status 400 y mensaje "Este email ya está en uso".

#### **Validar rechazo de registro con contraseña débil**

- **Type:** Negative | **Level:** UI
- **Test Data:** `12345`
- **Expected Result:** Mensaje de validación de fortaleza visible.

---

## 🎯 Definition of Done (QA)

- [ ] Todos los escenarios de validación de campos pasan (Zod).
- [ ] El registro crea la entrada en `auth.users` de Supabase.
- [ ] El usuario puede loguearse inmediatamente después de registrarse.
- [ ] No hay fugas de datos en el proceso.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
