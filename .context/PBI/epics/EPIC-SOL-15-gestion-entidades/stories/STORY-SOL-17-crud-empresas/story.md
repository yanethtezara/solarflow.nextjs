# Como David, quiero poder agregar, ver, editar y eliminar los datos de las empresas que me contratan (nombre, contacto responsable, teléfono) para poder asociarla a los trabajos.

**Jira Key:** SOL-17
**Epic:** SOL-15 (Gestión de Entidades (Clientes y Empresas))
**Priority:** High
**Story Points:** 5
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** David (jefe de cuadrilla)
**I want to** poder agregar, ver, editar y eliminar los datos de las empresas que me contratan
**So that** poder asociarla a los trabajos

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

-   Una sección/página en la UI dedicada a la gestión de Empresas.
-   Formulario para crear y editar empresas con los campos: nombre (obligatorio), contacto_responsable, telefono_contacto.
-   Vista de lista para mostrar todas las empresas del usuario.
-   Vista de detalle para ver la información completa de una empresa.
-   Funcionalidad para eliminar una empresa (con diálogo de confirmación).
-   Todas las operaciones deben estar protegidas para que un usuario solo pueda gestionar sus propias empresas.

### Out of Scope

-   Búsqueda y filtrado avanzado en la lista de empresas.
-   Paginación en la lista de empresas.
-   Asociar un logo o información fiscal a una empresa.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Agregar una nueva empresa exitosamente

-   **Given:** David está en la sección "Empresas"
-   **When:** hace clic en "Nueva Empresa" y rellena el formulario con nombre, contacto responsable y teléfono
-   **And:** hace clic en "Guardar"
-   **Then:** la nueva empresa "Empresa Solar" aparece en la lista de empresas
-   **And:** David ve un mensaje de éxito "Empresa creada correctamente."

### Scenario: Ver la lista de empresas

-   **Given:** David ha creado varias empresas
-   **When:** navega a la sección "Empresas"
-   **Then:** ve una lista con los nombres de todas sus empresas
-   **And:** puede hacer clic en una empresa para ver sus detalles (contacto y teléfono)

### Scenario: Editar la información de una empresa existente

-   **Given:** David está viendo los detalles de "Empresa Solar"
-   **When:** hace clic en "Editar", cambia el contacto responsable
-   **And:** hace clic en "Guardar"
-   **Then:** los detalles de la empresa se actualizan con el nuevo contacto
-   **And:** David ve un mensaje de éxito "Empresa actualizada correctamente."

### Scenario: Eliminar una empresa

-   **Given:** David está viendo la lista de empresas
-   **When:** hace clic en el botón "Eliminar" junto a "Empresa Solar" y confirma la acción
-   **Then:** la empresa "Empresa Solar" desaparece de la lista
-   **And:** David ve un mensaje de éxito "Empresa eliminada correctamente."

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

-   El nombre de la empresa es un campo obligatorio.
-   Cada empresa debe estar asociada a un `user_id`.

---

## Technical Notes

### Frontend

-   Componentes: `CompanyList`, `CompanyForm` (para crear/editar), `CompanyDetail`.
-   La implementación será muy similar a la de Clientes, buscando la reutilización de componentes y lógica.
-   Uso de `React Query` o `SWR` para la gestión de datos.

### Backend

-   API Routes para `/api/empresas` (GET, POST) y `/api/empresas/[id]` (GET, PUT, DELETE).
-   Se utiliza el cliente de Supabase para interactuar con la tabla `empresas`.

### Database

-   Tabla `empresas` con campos `id` (UUID, PK), `user_id` (UUID, FK a `auth.users`), `nombre` (TEXT), `contacto_responsable` (TEXT), `telefono_contacto` (TEXT), `created_at` (TIMESTAMP).
-   Activación de RLS en la tabla `empresas` para el `user_id`.

---

## Dependencies

### Blocked By

-   STORY-SOL-12 - User Login Credentials (se requiere autenticación para gestionar empresas).

### Blocks

-   STORY-SOL-TBD - Crear un nuevo trabajo (un trabajo se puede asociar a una empresa).

---

## Definition of Done

-   [ ] Código implementado y funcionando (CRUD completo para empresas).
-   [ ] Tests unitarios (coverage > 80%) para componentes frontend y funciones backend.
-   [ ] Tests de integración para las API Routes de empresas, incluyendo RLS.
-   [ ] Tests E2E (Playwright) para flujos de creación, visualización, edición y eliminación de empresas.
-   [ ] Code review aprobado (2 reviewers).
-   [ ] Documentación actualizada.
-   [ ] Deployed to staging.
-   [ ] QA testing passed.
-   [ ] Acceptance criteria validated.
-   [ ] No critical/high bugs open.

---

## Notes

La funcionalidad es análoga a la de la gestión de clientes. Se debe maximizar la reutilización de código.

---

## Related Documentation

-   **Epic:** `.context/PBI/epics/EPIC-SOL-15-gestion-entidades/epic.md`
-   **PRD:** `.context/PRD/mvp-scope.md` (US 2.2)
-   **SRS:** `.context/SRS/functional-specs.md` (FR-006)
-   **API Contracts:** `.context/SRS/api-contracts.yaml` (`/empresas` y `/empresas/{empresaId}`)
