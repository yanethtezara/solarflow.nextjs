# Acceptance Test Plan: STORY-SOL-33 - Generación de Vista Previa de Factura

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-33
**Epic:** EPIC-SOL-32 - Facturación Simple
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Javi Morales (Instalador) - Necesita ver el monto final antes de cobrar.
  **Business Value:**
- **Value Proposition:** Verificación de costos.
- **Business Impact:** Evita errores de facturación que afectan la rentabilidad.

### Technical Context of This Story

**Frontend:**

- Component: `InvoicePreview`.
- Route: `/dashboard/trabajos/[id]/factura`.
  **Backend:**
- API: `/api/facturas/[id]`.
  **Security:**
- RLS garantiza que solo se consulten ítems del trabajo propio.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿Se deben agrupar materiales y mano de obra o mostrarse en una sola lista mezclada?
  - **Suggested Clarification:** Mostrar una sola tabla cronológica según se agregaron al trabajo.

### Missing Information / Gaps

- **Gap 1:** Manejo de redondeo. Se debe usar `fixed(2)` en la UI para evitar decimales infinitos.

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Generación exitosa (Happy Path)

- **Given:** Trabajo completado con 3 paneles ($600) y 1 instalación ($150).
- **When:** Carga la vista previa.
- **Then:**
  - Subtotales: $600 y $150.
  - Total: $750.00.

### Scenario 2: Trabajo no completado

- **When:** Intenta entrar a la ruta de factura de un trabajo "Agendado".
- **Then:** Redirige al detalle del trabajo con un aviso: "Solo se pueden facturar trabajos completados".

### Scenario 3: Cambio de datos en caliente

- **When:** Se edita un precio mientras la factura está abierta (y se refresca).
- **Then:** El total debe reflejar el cambio.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar precisión matemática del total**

- **Type:** Positive | **Level:** Unit/API
- **Expected Result:** El total es la suma exacta de (cantidad \* precio) de todos los registros vinculados.

#### **Validar bloqueo de botón "Factura"**

- **Type:** Positive | **Level:** UI
- **Steps:** Ver trabajo agendado -> Verificar ausencia de botón. Ver trabajo completado -> Verificar presencia de botón.

#### **Validar visualización de datos del cliente en factura**

- **Expected Result:** El nombre y dirección del cliente deben ser legibles y correctos en la cabecera.

---

## 🎯 Definition of Done (QA)

- [ ] Lógica de cálculo validada.
- [ ] Filtro por estado "Completado" funcionando.
- [ ] Aislamiento de datos confirmado.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
