# Acceptance Test Plan: STORY-SOL-21 - Edición y Eliminación de Catálogo

**Fecha:** 2026-04-05
**QA Engineer:** AI-Generated (Gemini CLI)
**Story Jira Key:** SOL-21
**Epic:** EPIC-SOL-18 - Catálogo de Servicios y Materiales
**Status:** Draft - Pending PO/Dev Review

---

## 📋 Paso 1: Critical Analysis

### Business Context of This Story

**User Persona Affected:**

- **Primary:** Todos los usuarios.
  **Business Value:**
- **Value Proposition:** Flexibilidad y precisión de datos.
- **Business Impact:** Permite la corrección de errores de dedo y la actualización de precios inflacionarios.

### Technical Context of This Story

**Frontend:**

- Component: `EditItemForm` (reutilizado).
- Component: `ConfirmDeleteDialog`.
  **Backend:**
- API: `PUT /api/catalogo-items/[id]`, `DELETE /api/catalogo-items/[id]`.
  **Security:**
- RLS garantiza que el `UPDATE` y `DELETE` solo afecten filas donde `user_id = auth.uid()`.

---

## 🚨 Paso 2: Story Quality Analysis

### Ambiguities Identified

- **Ambiguity 1:** ¿Se puede cambiar el "tipo" (Material <-> Mano de obra) después de creado?
  - **Suggested Clarification:** NO permitir el cambio de tipo para evitar inconsistencias en la lógica de negocio.

### Missing Information / Gaps

- **Gap 1:** No se define el manejo de errores si el ítem ya no existe (concurrencia).

---

## ✅ Paso 3: Refined Acceptance Criteria

### Scenario 1: Edición exitosa (Happy Path)

- **When:** Usuario edita nombre/precio y guarda.
- **Then:**
  - Toast de éxito.
  - La lista se actualiza (revalidación de caché).

### Scenario 2: Eliminación exitosa

- **Given:** Ítem seleccionado para borrar.
- **When:** Confirma en el modal.
- **Then:** El registro se elimina de la DB.

### Scenario 3: Prevención de borrado accidental

- **When:** Clic en eliminar -> Clic fuera del modal o en "No".
- **Then:** El ítem sigue en la lista.

---

## 🧪 Paso 4: Test Design (Outlines)

#### **Validar edición de costo en material**

- **Type:** Positive | **Level:** E2E
- **Expected Result:** El valor en la tabla cambia al nuevo precio guardado.

#### **Validar que un usuario no puede eliminar ítems ajenos**

- **Type:** Negative (Security) | **Level:** API
- **Expected Result:** Error de permisos. El ítem del otro usuario no se ve afectado.

#### **Validar campos obligatorios en edición**

- **When:** Intenta guardar con nombre vacío durante la edición.
- **Then:** Error visual y bloqueo de guardado.

---

## 🎯 Definition of Done (QA)

- [ ] CRUD completo validado (Create, Read, Update, Delete).
- [ ] Diálogo de confirmación implementado.
- [ ] Seguridad RLS verificada para mutaciones.

---

## 📋 Test Execution Tracking

**Test Execution Date:** [TBD]
**Environment:** Staging
**Executed By:** [Nombre]
