# Acceptance Test Plan: STORY-SOL-24 - Listado y Filtros de Trabajos

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-24
**Epic:** EPIC-SOL-22 - Gestión de Trabajos de Instalación
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** David Rojas (Líder) - Necesita supervisar el progreso de las instalaciones.
  **Business Value:**
- **Value Proposition:** Monitoreo operativo.
- **Business Impact:** Permite priorizar trabajos urgentes o retrasados.

### Technical Context of This Story

**Frontend:**

- Component: `JobList`.
- State: Filtros locales sincronizados con la URL.
  **Backend:**
- Endpoint: `GET /api/trabajos`.
- Query Params: `?estado=...`.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿Cómo se visualizan los trabajos de "Hoy"?
  - **Suggested Clarification:** Resaltar visualmente (ej. borde de color) los trabajos cuya fecha coincida con la fecha actual del sistema.

### Missing Information / Gaps

- **Gap 1:** Formato de fecha (ej. "DD/MM/YYYY" vs "hace 2 días"). Se recomienda formato absoluto para evitar confusiones.

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Visualización de lista (Happy Path)

- **Given:** Existen trabajos creados.
- **When:** Carga la página de lista.
- **Then:** Se muestran en tarjetas o tabla con info clave (Cliente, Fecha).

### Scenario 2: Filtro por estado

- **When:** Clic en chip "En Progreso".
- **Then:** La lista se reduce solo a esos elementos.

### Scenario 3: Acceso directo por URL

- **When:** Navega a `/trabajos?estado=agendado`.
- **Then:** La lista carga pre-filtrada correctamente.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar ordenación cronológica**

- **Type:** Positive | **Level:** E2E
- **Expected Result:** Los trabajos con fecha más antigua aparecen al principio (o según configuración de orden).

#### **Validar mensaje de "No resultados"**

- **When:** Se aplica un filtro que no tiene coincidencias.
- **Then:** Se visualiza una ilustración o texto de "Sin resultados".

#### **Validar que la lista es reactiva**

- **When:** Se edita un trabajo y se vuelve a la lista.
- **Then:** El cambio (ej. de estado) es visible inmediatamente.

---

## 🎯 Definition of Done (QA)

- [ ] Lista de trabajos funcional.
- [ ] Filtros por estado validados.
- [ ] Seguridad RLS confirmada (aislamiento).

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
