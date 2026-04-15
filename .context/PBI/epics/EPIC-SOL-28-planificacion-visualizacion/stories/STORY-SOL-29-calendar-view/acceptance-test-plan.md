# Acceptance Test Plan: STORY-SOL-29 - Visualización de Calendario

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-29
**Epic:** EPIC-SOL-28 - Planificación y Visualización
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** David Rojas (Líder) - Necesita ver la distribución de trabajos en el tiempo.
  **Business Value:**
- **Value Proposition:** Optimización de la agenda.
- **Business Impact:** Reduce el riesgo de solapamiento de trabajos y mejora la puntualidad.

### Technical Context of This Story

**Frontend:**

- Component: `CalendarGrid`.
- Library: FullCalendar o similar.
  **Backend:**
- API: `GET /api/trabajos`.
- Parameters: `startDate`, `endDate`.
  **Security:**
- RLS garantiza que solo se carguen eventos propios en el rango de fechas.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿Qué sucede con los trabajos sin hora especificada (si existieran)?
  - **Suggested Clarification:** Todos los trabajos en SolarFlow requieren hora (SOL-23), por lo que siempre deben tener posición horaria.

### Missing Information / Gaps

- **Gap 1:** Indicador de carga. El calendario puede tardar en obtener los eventos; se necesita un estado de `loading`.

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Navegación mensual (Happy Path)

- **When:** El usuario cambia de mes.
- **Then:**
  - La API es consultada con las nuevas fechas.
  - Los eventos del nuevo mes aparecen en la cuadrícula.

### Scenario 2: Detalle rápido

- **When:** Clic en un evento del calendario.
- **Then:** Se muestra un popover o modal con: Cliente, Hora, Ubicación y un botón para "Ver más".

### Scenario 3: Vista Semanal

- **When:** Alterna a vista de semana.
- **Then:** Se visualiza el desglose por horas del día actual y los siguientes 6 días.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar carga de eventos por rango**

- **Type:** Integration | **Level:** API/UI
- **Expected Result:** Si el calendario pide Abril, la API no debe devolver trabajos de Mayo.

#### **Validar consistencia de zona horaria**

- **Verify:** Que las horas mostradas en el calendario coincidan con las ingresadas en el formulario de creación, evitando desfases por UTC.

#### **Validar comportamiento en días sin trabajos**

- **Expected Result:** El calendario se muestra limpio, sin errores, y permite interactuar con los días vacíos.

---

## 🎯 Definition of Done (QA)

- [ ] Vistas mensual y semanal funcionando.
- [ ] Navegación temporal validada.
- [ ] Integración con la API de trabajos optimizada por rango.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
