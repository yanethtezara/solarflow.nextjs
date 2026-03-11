# Como Javi, quiero poder crear un nuevo trabajo de instalación asociando un cliente, una empresa, una fecha, una hora y una ubicación para tener todos los detalles organizados.

**Jira Key:** SOL-23
**Epic:** SOL-22 (Gestión de Trabajos de Instalación (Core))
**Priority:** High
**Story Points:** 5
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** Javi
**I want to** poder crear un nuevo trabajo de instalación asociando un cliente, una empresa, una fecha, una hora y una ubicación
**So that** tener todos los detalles organizados

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

-   Formulario de creación de trabajo con campos para:
    -   Cliente (selector, obligatorio).
    -   Empresa (selector, opcional).
    -   Fecha (selector de fecha, obligatorio).
    -   Hora (selector de hora, obligatorio).
    -   Ubicación (campo de texto, opcional).
-   El estado inicial del trabajo es "Agendado".
-   El trabajo creado debe estar asociado al usuario autenticado.

### Out of Scope

-   Búsqueda de clientes/empresas en el selector.
-   Autocompletado de dirección.
-   Validación de disponibilidad de fecha/hora.
-   Asignación de equipo al trabajo.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Crear un nuevo trabajo exitosamente con cliente y empresa

-   **Given:** Javi está autenticado y tiene clientes y empresas registrados
-   **When:** navega a la sección "Crear Trabajo"
-   **And:** rellena el formulario seleccionando "Cliente A" y "Empresa B"
-   **And:** selecciona la fecha "2026-03-01", la hora "10:00", y la ubicación "Calle Solar 123"
-   **And:** hace clic en "Guardar Trabajo"
-   **Then:** el nuevo trabajo aparece en su lista de trabajos con estado "Agendado"
-   **And:** Javi ve un mensaje de éxito "Trabajo creado correctamente."

### Scenario: Crear un nuevo trabajo solo con cliente (sin empresa)

-   **Given:** Javi está autenticado y tiene clientes registrados
-   **When:** navega a la sección "Crear Trabajo"
-   **And:** rellena el formulario seleccionando "Cliente C", sin seleccionar empresa
-   **And:** selecciona fecha, hora y ubicación
-   **And:** hace clic en "Guardar Trabajo"
-   **Then:** el nuevo trabajo aparece en su lista de trabajos asociado solo al "Cliente C"

### Scenario: Intento de crear trabajo sin cliente

-   **Given:** Javi está autenticado
-   **When:** navega a la sección "Crear Trabajo"
-   **And:** rellena el formulario sin seleccionar un cliente
-   **And:** hace clic en "Guardar Trabajo"
-   **Then:** el sistema muestra un mensaje de error "El cliente es obligatorio."
-   **And:** el trabajo no se crea

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

-   El cliente, la fecha y la hora son campos obligatorios para la creación de un trabajo.
-   La empresa es opcional.
-   El trabajo debe ser asociado al `user_id` del usuario autenticado.

---

## Technical Notes

### Frontend

-   Componente `JobCreationForm` para el formulario.
-   Uso de selectores para clientes y empresas que carguen dinámicamente desde la API.
-   Validación de formulario (ej. Zod) para campos obligatorios.

### Backend

-   API Route `POST /api/trabajos` para la creación de trabajos.
-   Debe verificar la existencia y pertenencia del `clienteId` y `empresaId` (si se proporciona) al usuario autenticado.

### Database

-   Insertar un nuevo registro en la tabla `trabajos`.
-   Asegurar RLS para el `user_id`.

---

## Dependencies

### Blocked By

-   STORY-SOL-16 - CRUD Clientes (se necesita un cliente para crear un trabajo).
-   STORY-SOL-17 - CRUD Empresas (se necesita una empresa para asociarla a un trabajo).

### Blocks

-   STORY-SOL-TBD - Listar trabajos.
-   EPIC-SOL-TBD - Planificación y Visualización (requiere trabajos existentes).

---

## Definition of Done

-   [ ] Código implementado y funcionando (formulario y API para crear trabajos).
-   [ ] Tests unitarios (coverage > 80%) para componentes frontend y funciones backend.
-   [ ] Tests de integración para la API Route de creación de trabajos.
-   [ ] Tests E2E (Playwright) para el flujo completo de creación de trabajos.
-   [ ] Code review aprobado (2 reviewers).
-   [ ] Documentación actualizada.
-   [ ] Deployed to staging.
-   [ ] QA testing passed.
-   [ ] Acceptance criteria validated.
-   [ ] No critical/high bugs open.

---

## Notes

La experiencia de usuario al seleccionar clientes y empresas debe ser fluida, quizás con un campo de búsqueda integrado en los selectores.

---

## Related Documentation

-   **Epic:** `.context/PBI/epics/EPIC-SOL-22-gestion-trabajos-instalacion/epic.md`
-   **PRD:** `.context/PRD/mvp-scope.md` (US 3.1), `.context/PRD/user-journeys.md` (Journey 1: Step 4, Step 5)
-   **SRS:** `.context/SRS/functional-specs.md` (FR-007)
