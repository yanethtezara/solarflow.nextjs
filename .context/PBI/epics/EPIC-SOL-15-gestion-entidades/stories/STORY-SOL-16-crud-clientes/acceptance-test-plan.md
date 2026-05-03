# Acceptance Test Plan: STORY-SOL-16 - CRUD de Clientes

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-16
**Epic:** EPIC-SOL-15 - Gestión de Entidades
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Javi Morales (Instalador) - Necesita guardar los datos de sus clientes residenciales.
  **Business Value:**
- **Value Proposition:** Base de datos centralizada.
- **Business Impact:** Agiliza la creación de instalaciones en terreno.

### Technical Context of This Story

**Frontend:**

- Pages: `/clientes`, `/clientes/nuevo`, `/clientes/[id]`.
- Logic: SWR/React Query para sincronización de datos.
  **Backend:**
- Endpoints: GET/POST `/api/clientes`, GET/PUT/DELETE `/api/clientes/[id]`.
  **Security:**
- Supabase RLS habilitado por `user_id`.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿El teléfono debe seguir algún formato internacional específico?
  - **Suggested Clarification:** Usar validación básica de dígitos y permitir '+' inicial.

### Missing Information / Gaps

- **Gap 1:** Validación de duplicados. ¿Puede haber dos "Juan Pérez"?
- **Gap 2:** Diálogo de confirmación en el borrado (mencionado en story, debe testearse).

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Creación exitosa (Happy Path)

- **When:** Usuario completa nombre y guarda.
- **Then:**
  - Status 201.
  - El cliente aparece en la lista.
  - `user_id` asignado automáticamente en el servidor.

### Scenario 2: Aislamiento de datos (Seguridad)

- **When:** Usuario B intenta borrar un cliente de Usuario A por API.
- **Then:** Error 404/403. La data permanece intacta.

### Scenario 3: Edición de campos opcionales

- **When:** Se vacía el campo "dirección" en un cliente existente.
- **Then:** El sistema permite el cambio (solo nombre es obligatorio).

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar creación de cliente con solo campo obligatorio**

- **Type:** Positive | **Level:** UI/API
- **Expected Result:** Cliente creado con éxito.

#### **Validar que un usuario no puede ver clientes ajenos**

- **Type:** Negative (Security) | **Level:** API (Integration)
- **Expected Result:** Respuesta vacía o error de permisos.

#### **Validar cancelación de eliminación**

- **Type:** Positive | **Level:** UI
- **Steps:** Clic eliminar -> Clic "Cancelar" en el modal.
- **Expected Result:** El cliente sigue en la lista.

---

## 🎯 Definition of Done (QA)

- [ ] Operaciones CRUD verificadas vía UI.
- [ ] Pruebas de integración para RLS exitosas.
- [ ] No es posible crear clientes sin nombre.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
