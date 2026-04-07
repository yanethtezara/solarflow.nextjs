# Como Javi, quiero poder agregar, ver, editar y eliminar la información de mis clientes (nombre, dirección, teléfono) para tener una base de datos centralizada.

**Jira Key:** SOL-16
**Epic:** SOL-15 (Gestión de Entidades (Clientes y Empresas))
**Priority:** High
**Story Points:** 5
**Status:** To Do
**Assignee:** null

---

## User Story

**As a** Javi (instalador)
**I want to** poder agregar, ver, editar y eliminar la información de mis clientes (nombre, dirección, teléfono)
**So that** tener una base de datos centralizada

---

## Scope

<!-- Jira Field: customfield_10401 (⛳SCOPE) -->

### In Scope

- Una sección/página en la UI dedicada a la gestión de Clientes.
- Formulario para crear y editar clientes con los campos: nombre (obligatorio), dirección, teléfono.
- Vista de lista para mostrar todos los clientes del usuario.
- Vista de detalle para ver la información completa de un cliente.
- Funcionalidad para eliminar un cliente (con diálogo de confirmación).
- Todas las operaciones deben estar protegidas para que un usuario solo pueda gestionar sus propios clientes.

### Out of Scope

- Búsqueda y filtrado avanzado en la lista de clientes.
- Paginación en la lista de clientes.
- Asociar un logo o imagen a un cliente.

---

## Acceptance Criteria (Gherkin format)

<!-- Jira Field: customfield_10201 (✅ Acceptance Criteria) -->

### Scenario: Agregar un nuevo cliente exitosamente

- **Given:** Javi está en la sección "Clientes"
- **When:** hace clic en "Nuevo Cliente" y rellena el formulario con nombre, dirección y teléfono
- **And:** hace clic en "Guardar"
- **Then:** el nuevo cliente "Cliente Ejemplo" aparece en la lista de clientes
- **And:** Javi ve un mensaje de éxito "Cliente creado correctamente."

### Scenario: Ver la lista de clientes

- **Given:** Javi ha creado varios clientes
- **When:** navega a la sección "Clientes"
- **Then:** ve una lista con los nombres de todos sus clientes
- **And:** puede hacer clic en un cliente para ver sus detalles (dirección y teléfono)

### Scenario: Editar la información de un cliente existente

- **Given:** Javi está viendo los detalles de "Cliente Ejemplo"
- **When:** hace clic en "Editar", cambia el número de teléfono
- **And:** hace clic en "Guardar"
- **Then:** los detalles del cliente se actualizan con el nuevo número de teléfono
- **And:** Javi ve un mensaje de éxito "Cliente actualizado correctamente."

### Scenario: Eliminar un cliente

- **Given:** Javi está viendo la lista de clientes
- **When:** hace clic en el botón "Eliminar" junto a "Cliente Ejemplo" y confirma la acción
- **Then:** el cliente "Cliente Ejemplo" desaparece de la lista
- **And:** Javi ve un mensaje de éxito "Cliente eliminado correctamente."

---

## Business Rules

<!-- Jira Field: customfield_10202 (🚩BUSINESS RULES SPEC) - Opcional -->

- **Integridad:** BLOQUEAR eliminación si el cliente tiene trabajos asociados.
- **Unicidad:** Nombre de cliente debe ser único por usuario.
- **Obligatorios:** Nombre y Teléfono son requeridos.
- Cada cliente debe estar asociado a un `user_id`.

---

## Technical Notes

### Frontend

- Componentes: `ClientList`, `ClientForm` (para crear/editar), `ClientDetail`.
- Uso de `React Query` o `SWR` para la gestión de datos.
- Validación de formulario (ej. Zod) para el nombre obligatorio.

### Backend

- API Routes para `/api/clientes` (GET, POST) y `/api/clientes/[id]` (GET, PUT, DELETE).
- Se utiliza el cliente de Supabase para interactuar con la tabla `clientes`.

### Database

- Tabla `clientes` con campos `id` (UUID, PK), `user_id` (UUID, FK a `auth.users`), `nombre` (TEXT), `direccion` (TEXT), `telefono` (TEXT), `created_at` (TIMESTAMP).
- Activación de RLS en la tabla `clientes` para el `user_id`.

---

## Dependencies

### Blocked By

- STORY-SOL-12 - User Login Credentials (se requiere autenticación para gestionar clientes).

### Blocks

- STORY-SOL-TBD - Crear un nuevo trabajo (un trabajo requiere un cliente).

---

## Definition of Done

- [ ] Código implementado y funcionando (CRUD completo para clientes).
- [ ] Tests unitarios (coverage > 80%) para componentes frontend y funciones backend.
- [ ] Tests de integración para las API Routes de clientes, incluyendo RLS.
- [ ] Tests E2E (Playwright) para flujos de creación, visualización, edición y eliminación de clientes.
- [ ] Code review aprobado (2 reviewers).
- [ ] Documentación actualizada.
- [ ] Deployed to staging.
- [ ] QA testing passed.
- [ ] Acceptance criteria validated.
- [ ] No critical/high bugs open.

---

## Notes

La implementación de RLS es crítica para la seguridad de los datos de los clientes.

---

## Related Documentation

- **Epic:** `.context/PBI/epics/EPIC-SOL-15-gestion-entidades/epic.md`
- **PRD:** `.context/PRD/mvp-scope.md` (US 2.1)
- **SRS:** `.context/SRS/functional-specs.md` (FR-005)
- **API Contracts:** `.context/SRS/api-contracts.yaml` (`/clientes` y `/clientes/{clienteId}`)
