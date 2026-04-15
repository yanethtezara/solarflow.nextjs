# Acceptance Test Plan: STORY-SOL-23 - Crear Nuevo Trabajo

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-23
**Epic:** EPIC-SOL-22 - Gestión de Trabajos de Instalación
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Javi Morales (Instalador) - Necesita agendar sus próximas visitas técnicas.
  **Business Value:**
- **Value Proposition:** Organización de la agenda operativa.
- **Business Impact:** Evita el olvido de citas y profesionaliza el trato con el cliente.

### Technical Context of This Story

**Frontend:**

- Component: `JobCreationForm`.
- Dynamic Selectors: Clientes y Empresas (filtrados por usuario).
  **Backend:**
- Endpoint: `POST /api/trabajos`.
  **Database:**
- Tabla `trabajos`. Campos obligatorios: `cliente_id`, `fecha`, `hora`.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿La ubicación es la dirección del cliente o una dirección de obra específica?
  - **Suggested Clarification:** Pre-cargar la dirección del cliente pero permitir sobrescribirla para la ubicación del trabajo.

### Missing Information / Gaps

- **Gap 1:** Validación de horas de trabajo (ej. no permitir 03:00 AM sin advertencia).

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Creación exitosa (Happy Path)

- **Given:** Javi tiene al cliente "Juan Pérez".
- **When:** Crea trabajo para mañana a las 10:00 en "Obra A".
- **Then:**
  - Status 201.
  - El trabajo aparece en "Agendados".

### Scenario 2: Omisión de cliente

- **When:** Intenta guardar sin elegir cliente.
- **Then:** Error visual "Selecciona un cliente".

### Scenario 3: Validación de fecha

- **When:** Ingresa una fecha con formato inválido.
- **Then:** El datepicker o Zod impiden el envío.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar creación de trabajo con empresa opcional**

- **Type:** Positive | **Level:** E2E (Playwright)
- **Expected Result:** El trabajo se crea correctamente vinculando ambas entidades.

#### **Validar que un usuario no puede inyectar clientes de otros**

- **Type:** Negative (Security) | **Level:** API
- **Steps:** Enviar `POST` con un `cliente_id` que no le pertenece.
- **Expected Result:** Status 403 Forbidden o Error de FK.

#### **Validar estado inicial por defecto**

- **When:** Se crea un trabajo nuevo.
- **Then:** El campo `estado` en la DB debe ser obligatoriamente 'Agendado'.

---

## 🎯 Definition of Done (QA)

- [ ] Formulario de creación validado.
- [ ] Selectores dinámicos cargando data correcta.
- [ ] Seguridad a nivel de API confirmada.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
