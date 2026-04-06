# Acceptance Test Plan: STORY-SOL-27 - Completar y Gestionar Estados de Trabajo

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-27
**Epic:** EPIC-SOL-22 - Gestión de Trabajos de Instalación
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Javi Morales (Instalador) - Necesita cerrar sus tareas diarias para facturar.
  **Business Value:**
- **Value Proposition:** Control del progreso.
- **Business Impact:** Habilita el flujo de caja al identificar trabajos listos para cobro.

### Technical Context of This Story

**Frontend:**

- Component: `StatusSelector`.
- Event: Trigger de actualización inmediata tras selección.
  **Backend:**
- Endpoint: `PATCH /api/trabajos/[id]/status` (preferible PATCH para actualización parcial).
  **Database:**
- Tabla `trabajos`, columna `estado`.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿Existen restricciones de transición? (Ej. ¿Se puede pasar de Agendado a Completado directamente?).
  - **Suggested Clarification:** Permitir transiciones libres en el MVP para máxima flexibilidad del instalador.

### Missing Information / Gaps

- **Gap 1:** Registro de fecha de finalización real (separada de la fecha agendada).

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Finalización de trabajo (Happy Path)

- **Given:** Trabajo activo.
- **When:** Usuario selecciona "Completado".
- **Then:**
  - Toast de confirmación.
  - El estado cambia visualmente (ej. color verde).

### Scenario 2: Cancelación de trabajo

- **When:** Usuario selecciona "Cancelado".
- **Then:** El trabajo se actualiza y se muestra un aviso de que no es editable.

### Scenario 3: Integridad de datos en el cambio

- **Verify:** Cambiar el estado NO afecta a los materiales o clientes asociados.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar transiciones de estado básicas**

- **Type:** Positive | **Level:** E2E (Playwright)
- **Expected Result:** El estado cambia correctamente en la DB tras cada clic en la UI.

#### **Validar seguridad RLS en cambio de estado**

- **Type:** Negative (Security) | **Level:** API
- **Expected Result:** Solo el dueño del trabajo puede ejecutar el cambio de estado.

#### **Validar estados permitidos**

- **When:** Se intenta enviar un estado inexistente (ej. "Enviado") vía API.
- **Then:** Error 400 Bad Request.

---

## 🎯 Definition of Done (QA)

- [ ] Selector de estados funcional.
- [ ] Reflejo inmediato en la lista de trabajos.
- [ ] Validación de permisos completada.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
