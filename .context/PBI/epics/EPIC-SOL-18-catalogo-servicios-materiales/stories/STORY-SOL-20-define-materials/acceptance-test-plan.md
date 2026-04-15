# Acceptance Test Plan: STORY-SOL-20 - Catálogo de Materiales

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-20
**Epic:** EPIC-SOL-18 - Catálogo de Servicios y Materiales
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Javi Morales (Instalador) - Necesita saber cuánto le cuesta cada pieza de hardware instalada.
  **Business Value:**
- **Value Proposition:** Control de costos de insumos.
- **Business Impact:** Evita pérdidas por subestimación de materiales.

### Technical Context of This Story

**Frontend:**

- Component: `MaterialForm`.
- Reusability: Debe compartir lógica con `LaborServiceForm`.
  **Backend:**
- API: `POST /api/catalogo-items`.
- Security: RLS estricto.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿El costo es por unidad mínima o por paquete?
  - **Suggested Clarification:** Permitir que el usuario lo defina en el nombre (ej. "Cable (metro)").

### Missing Information / Gaps

- **Gap 1:** Falta campo para "Marca" o "Fabricante" (Opcional para MVP).

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Registro de material exitoso (Happy Path)

- **When:** Javi ingresa nombre y costo válido.
- **Then:**
  - Toast de éxito.
  - El material aparece en la lista de materiales.

### Scenario 2: Error en costo inválido

- **When:** Ingresa un valor negativo.
- **Then:** El sistema muestra error de validación.

### Scenario 3: Filtrado de catálogo

- **When:** Navega a la sección de materiales.
- **Then:** Solo ve ítems con `tipo = 'material'`.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar creación de material básico**

- **Type:** Positive | **Level:** E2E (Playwright)
- **Expected Result:** El material se visualiza correctamente en la tabla de materiales.

#### **Validar que no se permiten nombres vacíos**

- **Type:** Negative | **Level:** UI
- **Expected Result:** Error "El nombre es obligatorio".

#### **Validar integridad de precios decimales**

- **When:** Ingresa costo "99.99".
- **Then:** Se guarda y muestra exactamente como "99.99" (sin errores de redondeo binario).

---

## 🎯 Definition of Done (QA)

- [ ] CRUD funcional para materiales.
- [ ] Validación de decimales probada.
- [ ] Aislamiento de datos entre usuarios.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
