# Acceptance Test Plan: STORY-SOL-17 - CRUD de Empresas

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-17
**Epic:** EPIC-SOL-15 - Gestión de Entidades
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** David Rojas (Líder de Equipo) - Necesita gestionar los contratos con empresas de energía.
  **Business Value:**
- **Value Proposition:** Agrupación de trabajos por entidad pagadora.
- **Business Impact:** Facilita la conciliación de pagos y reportes.

### Technical Context of This Story

**Frontend:**

- Pages: `/empresas`, `/empresas/nuevo`, `/empresas/[id]`.
- Logic: Reutilización de componentes de `clientes`.
  **Backend:**
- Endpoints: GET/POST `/api/empresas`, GET/PUT/DELETE `/api/empresas/[id]`.
  **Security:**
- Supabase RLS habilitado por `user_id`.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿Es posible asociar múltiples contactos a una sola empresa?
  - **Suggested Clarification:** Para MVP, solo un "Contacto Responsable" principal.

### Missing Information / Gaps

- **Gap 1:** No se menciona si se debe guardar el CIF/NIF o ID fiscal de la empresa. (Sugerido agregar para facturación posterior).

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Creación exitosa (Happy Path)

- **When:** Usuario completa nombre y contacto y guarda.
- **Then:**
  - Status 201.
  - La empresa aparece en la lista.

### Scenario 2: Persistencia del aislamiento (Seguridad)

- **When:** Un usuario sin sesión intenta acceder a `/api/empresas`.
- **Then:** Error 401 Unauthorized.

### Scenario 3: Eliminación segura

- **When:** Clic eliminar y confirmar.
- **Then:** La empresa ya no aparece en la lista ni es recuperable por ID.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar creación de empresa con todos los campos**

- **Type:** Positive | **Level:** UI/API
- **Expected Result:** Registro creado correctamente en Supabase.

#### **Validar que un usuario no puede editar empresas ajenas**

- **Type:** Negative (Security) | **Level:** API (Integration)
- **Expected Result:** Respuesta 404 o Error de permisos.

#### **Validar visualización de detalles**

- **Given:** Empresa guardada.
- **When:** Se navega al detalle de la empresa.
- **Then:** Se muestran correctamente el contacto y el teléfono.

---

## 🎯 Definition of Done (QA)

- [ ] Operaciones CRUD verificadas.
- [ ] Middleware protegiendo el acceso anónimo.
- [ ] Datos de contacto validados.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
