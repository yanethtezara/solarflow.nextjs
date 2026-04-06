# Acceptance Test Plan: STORY-SOL-34 - Personalización de Factura (Datos Profesionales)

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-34
**Epic:** EPIC-SOL-32 - Facturación Simple
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** David Rojas (Líder) - Quiere que sus facturas se vean corporativas.
  **Business Value:**
- **Value Proposition:** Imagen de marca profesional.
- **Business Impact:** Facilita la aprobación de pagos en empresas grandes que exigen datos fiscales completos.

### Technical Context of This Story

**Frontend:**

- Component: `InvoiceHeader` (Datos Emisor + Logo).
- Component: `InvoiceRecipient` (Datos Cliente).
  **Backend:**
- Fetch: Combinar data de `auth.users` (o `user_profiles`) con el `trabajoId`.
  **Storage:**
- Bucket `logos` en Supabase.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿Qué formatos de imagen se aceptan?
  - **Suggested Clarification:** Soporte para PNG y JPG. Bloquear SVGs por seguridad si es necesario.

### Missing Information / Gaps

- **Gap 1:** Falta campo para el número de teléfono del emisor en la factura.

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Datos del emisor presentes (Happy Path)

- **Given:** Perfil configurado con NIF "B12345678".
- **When:** Visualiza factura.
- **Then:** El NIF aparece bajo el nombre del instalador.

### Scenario 2: Logo inexistente

- **When:** Usuario no ha subido logo.
- **Then:** La factura muestra el nombre del negocio en texto plano en lugar de la imagen (sin dejar un hueco vacío feo).

### Scenario 3: Datos del receptor correctos

- **Given:** Cliente "Solar Systems SL" con dirección "Calle Industria 1".
- **When:** Se factura su trabajo.
- **Then:** Ambos datos aparecen en la sección "Para:".

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar carga dinámica de logo**

- **Type:** Positive | **Level:** E2E (Playwright)
- **Expected Result:** El logo aparece en el DOM con el `src` correcto de Supabase.

#### **Validar manejo de campos fiscales vacíos**

- **Type:** Boundary | **Level:** UI
- **Expected Result:** Si no hay NIF, el sistema muestra un placeholder o simplemente no renderiza la línea, manteniendo el orden.

#### **Validar consistencia de datos de empresa**

- **Verify:** Que cambiar el nombre de la empresa en el Perfil actualice las facturas nuevas (pero idealmente no las pasadas, aunque para MVP se acepta actualización global).

---

## 🎯 Definition of Done (QA)

- [ ] Header de factura con branding funcional.
- [ ] Datos de cliente integrados.
- [ ] Manejo de imágenes (Logo) validado.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
