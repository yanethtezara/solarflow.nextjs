# Acceptance Test Plan: STORY-SOL-35 - Descarga de Factura en PDF

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-35
**Epic:** EPIC-SOL-32 - Facturación Simple
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Todos los usuarios (Javi, David).
  **Business Value:**
- **Value Proposition:** Documentación formal y exportable.
- **Business Impact:** Permite la integración con flujos externos del cliente (contabilidad, archivos físicos).

### Technical Context of This Story

**Frontend:**

- Component: `DownloadInvoiceButton`.
- Engine: `jsPDF` + `html2canvas` (o similar).
  **Backend:**
- No requiere lógica si se genera en cliente.
  **Storage:**
- El logo se obtiene de la URL de Supabase Storage.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿Se descarga automáticamente o se abre en una pestaña nueva para imprimir?
  - **Suggested Clarification:** Descarga automática directa para simplificar el flujo en móviles.

### Missing Information / Gaps

- **Gap 1:** Metadata del PDF (Autor, Título) para profesionalismo extra.

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Descarga exitosa (Happy Path)

- **When:** Usuario pulsa el botón de descarga.
- **Then:**
  - Aparece el diálogo de descarga del sistema operativo.
  - El archivo se guarda con extensión `.pdf`.

### Scenario 2: Consistencia de montos

- **Verify:** Los números en el PDF deben ser idénticos a los de la UI (evitar errores de estado al generar el documento).

### Scenario 3: Layout móvil

- **When:** Se descarga desde un smartphone.
- **Then:** El PDF mantiene el formato A4 estándar y no se corta por los bordes.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar trigger de descarga**

- **Type:** Positive | **Level:** E2E (Playwright)
- **Expected Result:** Se detecta un evento de descarga de archivo exitoso.

#### **Validar nombre de archivo dinámico**

- **Steps:** Generar factura para Cliente "Test" y Trabajo "45".
- **Expected Result:** Nombre de archivo contiene "Test" y "45".

#### **Validar que el PDF es de solo lectura**

- **Verify:** Que el archivo generado no permita la edición de los montos tras ser descargado (estándar de PDF).

---

## 🎯 Definition of Done (QA)

- [ ] Generación de PDF validada en Chrome/Safari.
- [ ] Integridad de datos en el documento final.
- [ ] Nomenclatura de archivos correcta.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
