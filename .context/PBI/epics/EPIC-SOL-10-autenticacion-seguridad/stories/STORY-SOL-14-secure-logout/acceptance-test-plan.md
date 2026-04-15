# Acceptance Test Plan: STORY-SOL-14 - Cerrar sesión de forma segura

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-14
**Epic:** EPIC-SOL-10 - Autenticación y Seguridad de Cuenta
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Todos los usuarios (Javi, David).
  **Business Value:**
- **Value Proposition:** Integridad y confidencialidad.
- **Business Impact:** Previene el acceso no autorizado a información del negocio en dispositivos compartidos.

### Technical Context of This Story

**Frontend:**

- Component: `LogoutButton` / `AuthContext`.
- Action: `supabase.auth.signOut()`.
  **Backend:**
- Middleware: Protección de rutas en Next.js.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿Qué sucede si falla la llamada a la API de Supabase para el logout?
  - **Suggested Clarification:** Limpiar la sesión en el cliente de todos modos para forzar el logout visual.

### Missing Information / Gaps

- **Gap 1:** Limpieza de estado global (Context/Redux) tras el logout.

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Logout exitoso (Happy Path)

- **Given:** Usuario autenticado.
- **When:** Clic en Logout.
- **Then:**
  - Token JWT eliminado de las cookies.
  - Redirección a `/login`.
  - Mensaje de confirmación.

### Scenario 2: Bloqueo de acceso post-logout

- **Given:** Usuario deslogueado.
- **When:** Intenta entrar a `/dashboard` por URL.
- **Then:** Redirigido a `/login` inmediatamente.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar cierre de sesión exitoso desde la UI**

- **Type:** Positive | **Level:** E2E (Playwright)
- **Expected Result:** Sesión invalidada en el cliente y servidor.

#### **Validar limpieza de sesión en el cliente**

- **Type:** Positive | **Level:** UI
- **Expected Result:** LocalStorage y Cookies de auth están vacíos post-logout.

#### **Validar redirección al login al intentar acceder a rutas protegidas**

- **Type:** Negative | **Level:** Integration (Middleware)
- **Expected Result:** No es posible ver contenido de `/dashboard` sin estar logueado.

---

## 🎯 Definition of Done (QA)

- [ ] Botón de logout visible y funcional.
- [ ] Middleware protegiendo todas las rutas privadas.
- [ ] Sesión invalidada correctamente en Supabase.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
