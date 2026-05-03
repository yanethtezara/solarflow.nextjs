# Acceptance Test Plan: STORY-SOL-26 - Asignación de Materiales y Servicios

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-26
**Epic:** EPIC-SOL-22 - Gestión de Instalaciones de Instalación
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** David Rojas (Líder) - Necesita imputar gastos y mano de obra a cada proyecto.
  **Business Value:**
- **Value Proposition:** Control de rentabilidad por obra.
- **Business Impact:** Permite la generación de facturas precisas y el cálculo de márgenes.

### Technical Context of This Story

**Frontend:**

- Component: `JobDetailView` con subsección `ItemsTable`.
- Search: Selector de ítems con búsqueda simple.
  **Backend:**
- API: `POST /api/trabajos/[id]/items`.
- Transaction: Debe insertar el ítem y recalcular el total del instalación (o el total se calcula bajo demanda).
  **Database:**
- Tabla asociativa `trabajos_items`.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿Qué sucede si el instalador agrega un material y luego se da cuenta que era otro?
  - **Suggested Clarification:** Permitir la eliminación del ítem y re-adición (cubierto en "In Scope").

### Missing Information / Gaps

- **Gap 1:** Snapshot de precios. Es CRÍTICO que el precio guardado en el instalación no cambie si el catálogo se actualiza mañana.

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Agregar Material (Happy Path)

- **Given:** Instalación ID `123` existe.
- **When:** Selecciona "Panel Solar", cantidad "5", clic en agregar.
- **Then:**
  - Status 201 Created.
  - La tabla de ítems muestra el nuevo registro con subtotal.

### Scenario 2: Error en Cantidad

- **When:** Ingresa cantidad "0" o texto.
- **Then:** El sistema bloquea el guardado.

### Scenario 3: Recálculo de Total

- **Given:** El instalación tiene un material de $100.
- **When:** Se agrega un servicio de $50.
- **Then:** El total del instalación mostrado en la UI debe ser exactamente $150.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar snapshot de precio al agregar**

- **Type:** Integration | **Level:** DB/API
- **Steps:**
  1. Agregar ítem con precio X al instalación.
  2. Cambiar precio del ítem en catálogo a Y.
- **Expected Result:** El instalación debe seguir mostrando precio X.

#### **Validar eliminación de ítem y actualización de total**

- **Type:** Positive | **Level:** E2E
- **Expected Result:** Al borrar el último ítem, el costo total del instalación debe volver a $0.00.

#### **Validar que no se permiten ítems duplicados (opcional)**

- **When:** Intenta agregar el mismo ID de material dos veces.
- **Then:** El sistema debe preguntar si desea sumar a la cantidad existente o mostrar error.

---

## 🎯 Definition of Done (QA)

- [ ] Listado de ítems por instalación funcional.
- [ ] Cálculos matemáticos validados (precisión decimal).
- [ ] Protección RLS para la tabla asociativa.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
