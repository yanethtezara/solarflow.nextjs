# Acceptance Test Plan: STORY-SOL-31 - Crear Instalación desde Calendario

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-31
**Epic:** EPIC-SOL-28 - Planificación y Visualización
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Javi Morales (Instalador) - Planifica sobre la marcha basándose en espacios vacíos.
  **Business Value:**
- **Value Proposition:** Planificación ágil y contextual.
- **Business Impact:** Reduce el tiempo administrativo de creación de registros.

### Technical Context of This Story

**Frontend:**

- Component: `CalendarView` (Parent).
- Interaction: Click en el día -> Open `JobCreationForm` (Modal).
- Data: `selectedDate` pasada como prop.
  **Backend:**
- Reutiliza `POST /api/trabajos`.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿El usuario puede elegir la hora en este flujo o se pre-rellena una por defecto?
  - **Suggested Clarification:** Pre-rellenar con la hora actual o las 09:00 AM, pero permitir edición.

### Missing Information / Gaps

- **Gap 1:** Feedback visual de "Día seleccionado" antes de que se abra el formulario.

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Apertura contextual (Happy Path)

- **Given:** Javi está viendo el calendario de Abril.
- **When:** Clic largo o botón "+" en el 15 de Abril.
- **Then:** El formulario de creación aparece con la fecha "15/04/2026" ya establecida.

### Scenario 2: Integridad del formulario

- **Verify:** Todas las validaciones de `SOL-23` (clientes obligatorios, etc.) se mantienen activas en este modal.

### Scenario 3: Refresco inmediato

- **When:** Guarda el instalación exitosamente.
- **Then:** El nuevo evento aparece en el calendario sin necesidad de recargar la página completa.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar consistencia de fecha seleccionada**

- **Type:** Positive | **Level:** E2E (Playwright)
- **Steps:** Clic en 10 de Marzo -> Verificar input date en Modal es "2026-03-10".

#### **Validar que el modal se cierra tras éxito**

- **Expected Result:** El flujo termina volviendo al calendario limpio, con el nuevo instalación renderizado.

#### **Validar validaciones de Zod en Modal**

- **When:** Intenta guardar sin cliente desde el modal del calendario.
- **Then:** Los mensajes de error de SOL-23 deben ser visibles dentro del modal.

---

## 🎯 Definition of Done (QA)

- [ ] Creación contextual validada.
- [ ] Refresco de eventos en UI comprobado.
- [ ] Consistencia de datos con SOL-23.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
