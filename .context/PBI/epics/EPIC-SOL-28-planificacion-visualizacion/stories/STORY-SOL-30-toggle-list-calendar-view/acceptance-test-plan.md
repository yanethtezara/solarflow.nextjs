# Acceptance Test Plan: STORY-SOL-30 - Alternar Vistas Lista/Calendario

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-30
**Epic:** EPIC-SOL-28 - Planificación y Visualización
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Javi Morales (Instalador) - Prefiere la lista para ver tareas del día y el calendario para planificación futura.
  **Business Value:**
- **Value Proposition:** Flexibilidad de visualización.
- **Business Impact:** Mejora la satisfacción del usuario al permitir personalización de la interfaz.

### Technical Context of This Story

**Frontend:**

- Logic: Hook `useViewPreference` para manejar el estado.
- Storage: `localStorage` para persistencia.
  **Components:**
- `JobList` y `CalendarGrid` montados condicionalmente.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿El cambio de vista debe disparar una nueva petición a la API?
  - **Suggested Clarification:** Si los datos ya están en caché (React Query), el cambio debe ser instantáneo y sin spinners.

### Missing Information / Gaps

- **Gap 1:** Posicionamiento del botón de toggle (accesibilidad).

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Alternancia exitosa (Happy Path)

- **When:** Usuario pulsa el botón de vista alternativa.
- **Then:**
  - La UI cambia sin latencia perceptible.
  - Los datos mostrados son coherentes.

### Scenario 2: Recuperación de preferencia

- **When:** El usuario abre la app tras haber seleccionado "Lista" previamente.
- **Then:** La app inicia en "Vista de Lista".

### Scenario 3: Feedback visual

- **When:** Una vista está activa.
- **Then:** El botón correspondiente en el toggle debe resaltar visualmente (estado `active`).

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar alternancia fluida de componentes**

- **Type:** Positive | **Level:** E2E (Playwright)
- **Expected Result:** Ambos componentes (`JobList` y `Calendar`) se montan/desmontan correctamente sin errores de React.

#### **Validar persistencia de preferencia de vista**

- **Type:** Positive | **Level:** UI
- **Steps:**
  1. Seleccionar Calendario.
  2. Limpiar caché (no localStorage).
  3. Recargar.
- **Expected Result:** Se mantiene la vista de Calendario.

#### **Validar que los filtros se heredan al cambiar de vista**

- **Verify:** Si hay un filtro de "Completados", este debe aplicar tanto a la lista como al calendario al alternar.

---

## 🎯 Definition of Done (QA)

- [ ] Toggle de vistas funcional.
- [ ] Persistencia en `localStorage` validada.
- [ ] Sin regresiones en la carga de datos.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
