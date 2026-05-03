# Acceptance Test Plan: STORY-SOL-19 - Catálogo de Mano de Obra

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-19
**Epic:** EPIC-SOL-18 - Catálogo de Servicios y Materiales
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** David Rojas (Líder) - Define el costo del instalación de sus técnicos.
  **Business Value:**
- **Value Proposition:** Estandarización de tarifas.
- **Business Impact:** Evita discrepancias en presupuestos entregados a diferentes clientes.

### Technical Context of This Story

**Frontend:**

- Component: `LaborServiceForm`.
- Validation: Zod (min 0.01 para precio).
  **Backend:**
- API: `POST /api/catalogo-items`.
- Logic: Forzar `tipo = 'mano_de_obra'` en el servidor para este formulario.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿El "precio" incluye impuestos o es base?
  - **Suggested Clarification:** Mostrar etiqueta "Precio Base (sin IVA)" para evitar confusiones legales.

### Missing Information / Gaps

- **Gap 1:** Límite de caracteres para el nombre del servicio.

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Registro de servicio exitoso (Happy Path)

- **When:** David completa nombre y precio y guarda.
- **Then:**
  - Redirección a la lista de servicios.
  - Mensaje: "Servicio creado correctamente."

### Scenario 2: Error en precio inválido

- **When:** David ingresa texto en el campo precio.
- **Then:** Zod impide el envío y muestra "Debe ser un número válido."

### Scenario 3: Persistencia de datos

- **When:** Tras guardar, David refresca la página.
- **Then:** El servicio sigue apareciendo en la tabla.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar creación de servicio con nombre y precio válido**

- **Type:** Positive | **Level:** E2E (Playwright)
- **Expected Result:** El servicio aparece en la tabla con el formato de moneda configurado.

#### **Validar que no se permiten precios negativos**

- **Type:** Negative | **Level:** API
- **Expected Result:** Status 400 Bad Request.

#### **Validar visualización en el catálogo de servicios**

- **Given:** Existen 3 servicios y 2 materiales.
- **When:** Entra a "Catálogo de Servicios".
- **Then:** Solo se listan los 3 ítems de tipo mano de obra.

---

## 🎯 Definition of Done (QA)

- [ ] Formulario de servicios funcional.
- [ ] Validación de tipos de datos estricta.
- [ ] Aislamiento RLS verificado.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
