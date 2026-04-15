# Acceptance Test Plan: STORY-SOL-12 - Iniciar sesión con las credenciales

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-12
**Epic:** EPIC-SOL-10 - Autenticación y Seguridad de Cuenta
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** David Rojas (Líder de Equipo) - Necesita acceder a la agenda de sus cuadrillas.
  **Business Value:**
- **Value Proposition:** Seguridad de la información operativa.
- **Business Impact:** Permite la continuidad de la gestión en terreno.

### Technical Context of This Story

**Frontend:**

- Component: `LoginForm` (Next.js 15).
- Validation: Zod.
  **Backend:**
- API Route: `/api/auth/login`.
- Service: `supabase.auth.signInWithPassword()`.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿Qué sucede si el usuario está bloqueado en Supabase?
  - **Question for Dev:** ¿Manejamos el estado de cuenta "banned/locked"?
  - **Suggested Clarification:** Mostrar mensaje genérico de error por ahora.

### Missing Information / Gaps

- **Gap 1:** Persistencia de la sesión tras cerrar el navegador.
- **Gap 2:** Redirección inteligente (ir a la página que intentó acceder antes del login).

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Login exitoso (Happy Path)

- **Given:** Usuario `david_test@solarflow.com` registrado.
- **When:** Ingresa credenciales válidas.
- **Then:**
  - Redirección a `/dashboard`.
  - Token JWT almacenado en cookies seguras.
  - Toast de bienvenida personalizado.

### Scenario 2: Error de credenciales (Seguridad)

- **When:** Credenciales erróneas.
- **Then:**
  - Mensaje genérico: "Credenciales inválidas."
  - NO indicar si el email existe o no.

### Scenario 3: Protección de rutas

- **Given:** Usuario no autenticado.
- **When:** Intenta acceder a `/dashboard`.
- **Then:** Redirigido a `/login`.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar login exitoso con credenciales válidas**

- **Type:** Positive | **Level:** E2E (Playwright)
- **Expected Result:** Dashboard cargado correctamente con el perfil del usuario.

#### **Validar error de autenticación con contraseña incorrecta**

- **Type:** Negative | **Level:** API
- **Expected Result:** Status 401 y mensaje genérico de error.

#### **Validar navegación protegida para usuarios anónimos**

- **Type:** Negative | **Level:** Integration (Middleware)
- **Expected Result:** Redirección automática al login al intentar acceder a rutas internas.

---

## 🎯 Definition of Done (QA)

- [ ] Login funcional contra Supabase.
- [ ] Sesión persistente durante el tiempo configurado.
- [ ] Validación de campos obligatorios en el cliente.
- [ ] Mensajes de error seguros (no informativos para atacantes).

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
