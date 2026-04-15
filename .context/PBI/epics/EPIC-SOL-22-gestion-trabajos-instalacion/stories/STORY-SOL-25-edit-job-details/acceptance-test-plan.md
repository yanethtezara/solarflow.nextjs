# Acceptance Test Plan: STORY-SOL-25 - Edición de Detalles de Trabajo

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-25
**Epic:** EPIC-SOL-22 - Gestión de Trabajos de Instalación
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Javi Morales (Instalador) - Necesita corregir errores de tipografía o cambios de fecha solicitados por el cliente.
  **Business Value:**
- **Value Proposition:** Mantenimiento de la exactitud de los datos.
- **Business Impact:** Evita confusiones logísticas (ej. ir a la dirección equivocada).

### Technical Context of This Story

**Frontend:**

- Component: `JobEditForm` (basado en `JobCreationForm`).
- Data Fetching: GET por ID antes de renderizar el formulario.
  **Backend:**
- API: `PUT /api/trabajos/[id]`.
  **Security:**
- Validación de que el `user_id` del trabajo coincida con el usuario de la sesión.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿Qué sucede si el trabajo ya está en progreso o completado?
  - **Suggested Clarification:** Limitar la edición de campos críticos (Cliente/Empresa) si el trabajo ya está "En Progreso" para evitar inconsistencias de facturación.

### Missing Information / Gaps

- **Gap 1:** No se menciona si se debe notificar al cliente sobre el cambio (Fuera de scope por ahora).

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Actualización exitosa (Happy Path)

- **When:** Javi edita la ubicación y guarda.
- **Then:**
  - Status 200 OK.
  - Redirección al detalle del trabajo.
  - La nueva ubicación es visible.

### Scenario 2: Cambio de cliente

- **When:** Javi selecciona un nuevo cliente de la lista.
- **Then:** El trabajo se vincula correctamente al nuevo ID de cliente.

### Scenario 3: Bloqueo de campos obligatorios

- **When:** Javi intenta guardar el formulario con el campo fecha vacío.
- **Then:** Mensaje de error: "La fecha es obligatoria".

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar persistencia de cambios en ubicación**

- **Type:** Positive | **Level:** E2E (Playwright)
- **Expected Result:** El campo `ubicacion` en la tabla de la DB se actualiza correctamente.

#### **Validar que un usuario no puede editar trabajos de otros**

- **Type:** Negative (Security) | **Level:** API (Integration)
- **Steps:** Intentar un `PUT` a un ID de trabajo que no le pertenece.
- **Expected Result:** Status 403 Forbidden o 404 Not Found.

#### **Validar que la edición no cambia el ID del trabajo**

- **Verify:** Tras editar, el ID del registro en la DB sigue siendo el mismo (evitar duplicados por error de lógica de save).

---

## 🎯 Definition of Done (QA)

- [ ] Formulario de edición funcional.
- [ ] Precarga de datos validada.
- [ ] Seguridad RLS confirmada para el método PUT.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
