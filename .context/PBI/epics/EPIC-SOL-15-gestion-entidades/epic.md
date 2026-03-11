# Gestión de Entidades (Clientes y Empresas)

**Jira Key:** SOL-15
**Status:** To Do
**Priority:** High
**Phase:** Foundation

---

## Epic Description

Esta épica se centra en la capacidad del usuario para administrar de manera eficiente su base de datos de clientes y las empresas contratantes. Permite crear, visualizar, editar y eliminar información clave, asegurando que todos los detalles relevantes estén centralizados y actualizados.

**Business Value:**
Centralizar la información de contacto elimina la necesidad de buscar en diferentes aplicaciones (WhatsApp, notas, email), reduce errores y agiliza la creación de nuevos trabajos. Proporciona una fuente única de verdad para la información del cliente y la empresa.

---

## User Stories

1. **SOL-16** - As a Javi, I want to poder agregar, ver, editar y eliminar la información de mis clientes para tener una base de datos centralizada.
2. **SOL-17** - As a David, I want to poder agregar, ver, editar y eliminar los datos de las empresas que me contratan para poder asociarlas a los trabajos.

**NOTA:** Los IDs serán actualizados conforme me los proporciones.

---

## Scope

### In Scope

-   Funcionalidad CRUD (Crear, Leer, Actualizar, Eliminar) completa para clientes.
-   Funcionalidad CRUD completa para empresas.
-   Cada cliente y empresa está asociado al usuario que lo creó.

### Out of Scope (Future)

-   Importación/exportación masiva de clientes/empresas desde un archivo (CSV, Excel).
-   Historial de cambios en los datos de un cliente/empresa.
-   Campos personalizados para clientes/empresas.
-   Fusión de registros duplicados.

---

## Acceptance Criteria (Epic Level)

1. ✅ Un usuario puede gestionar su lista de clientes a través de operaciones CRUD.
2. ✅ Un usuario puede gestionar su lista de empresas a través de operaciones CRUD.
3. ✅ Un usuario solo puede ver y gestionar los clientes y empresas que él mismo ha creado.

---

## Related Functional Requirements

-   **FR-005:** El sistema debe permitir las operaciones CRUD para Clientes.
-   **FR-006:** El sistema debe permitir las operaciones CRUD para Empresas Contratantes.

See: `.context/SRS/functional-specs.md`

---

## Technical Considerations

### Backend

-   Creación de API Routes para `/api/clientes` y `/api/empresas` que manejen todas las operaciones CRUD.
-   Las operaciones de base de datos se realizarán a través del cliente de Supabase.

### Database Schema

**Tables:**
-   `clientes` (id, user_id, nombre, direccion, telefono, created_at)
-   `empresas` (id, user_id, nombre, contacto_responsable, telefono_contacto, created_at)

### Security Requirements

-   RLS (Row Level Security) debe estar activado en las tablas `clientes` y `empresas` para que un `user_id` solo pueda acceder a sus propios registros.

---

## Dependencies

### External Dependencies

-   Supabase Cloud Platform (PostgreSQL).

### Internal Dependencies

-   EPIC-SOL-10: Autenticación y Seguridad de Cuenta (se requiere un usuario autenticado para gestionar entidades).

### Blocks

-   EPIC-SOLAR-003: Gestión de Trabajos de Instalación (Core) (los trabajos se asocian a clientes y empresas).

---

## Success Metrics

### Functional Metrics

-   Tiempo de respuesta de la API para operaciones CRUD < 500ms.
-   Tasa de error en operaciones CRUD < 0.1%.

### Business Metrics

-   Promedio de >3 clientes/empresas creados por usuario activo en el primer mes.

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
| :--- | :--- | :--- | :--- |
| Creación de datos duplicados | Medium | Medium | Implementar una UI clara que permita buscar antes de crear. La fusión de duplicados se deja para V2. |
| Inconsistencia de datos | Low | Low | Usar transacciones de base de datos para operaciones complejas si fuera necesario. |

---

## Notes

La interfaz para la gestión de estas entidades debe ser simple y estar optimizada para móviles, permitiendo una rápida adición o consulta de información "sobre la marcha".
