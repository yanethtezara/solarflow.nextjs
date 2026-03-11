# Catálogo de Servicios y Materiales

**Jira Key:** SOL-18
**Status:** To Do
**Priority:** High
**Phase:** Foundation

---

## Epic Description

Esta épica se encarga de la gestión de un catálogo predefinido de servicios de mano de obra y materiales que los instaladores utilizan frecuentemente. El objetivo es agilizar la asignación de costos y recursos a cada trabajo de instalación.

**Business Value:**
Permite a los usuarios estandarizar sus precios y costos, reducir el tiempo dedicado a la introducción de datos en cada trabajo y asegurar una mayor precisión en el cálculo de presupuestos y facturas.

---

## User Stories

1. **SOL-19** - As a David, I want to poder pre-definir un catálogo de mis servicios de mano de obra con sus precios para poder agregarlos rápidamente a los trabajos.
2. **SOL-20** - As a Javi, I want to poder pre-definir un catálogo de los materiales más comunes que uso con sus costos para estandarizar mis presupuestos y gastos.
3. **SOL-21** - As a Javi, I want to que los catálogos de mano de obra y materiales sean editables (CRUD) para mantener mis precios y lista de productos actualizados.

**NOTA:** Los IDs serán actualizados conforme me los proporciones.

---

## Scope

### In Scope

-   Creación y gestión de ítems de catálogo para servicios de mano de obra (nombre, precio).
-   Creación y gestión de ítems de catálogo para materiales (nombre, costo).
-   Cada ítem de catálogo está asociado al usuario que lo creó.
-   Funcionalidad CRUD completa para ambos tipos de ítems.

### Out of Scope (Future)

-   Manejo de inventario de materiales.
-   Variantes de productos (ej. diferentes tamaños o colores del mismo material).
-   Imágenes para ítems de catálogo.
-   Integración con proveedores para precios actualizados de materiales.

---

## Acceptance Criteria (Epic Level)

1. ✅ Un usuario puede mantener un catálogo actualizado de sus servicios de mano de obra.
2. ✅ Un usuario puede mantener un catálogo actualizado de los materiales que usa.
3. ✅ Un usuario solo puede ver y gestionar sus propios ítems de catálogo.

---

## Related Functional Requirements

-   **FR-XXX:** (Se generarán FRs específicos para cada US de esta épica)

See: `.context/SRS/functional-specs.md` (Nota: Los FRs para esta épica no están detallados aún en el `functional-specs.md` que he leído, se asumirá que se crearán siguiendo el patrón).

---

## Technical Considerations

### Backend

-   Creación de API Routes para `/api/catalogo-items` (GET, POST, PUT, DELETE).
-   Las operaciones de base de datos se realizarán a través del cliente de Supabase.

### Database Schema

**Tables:**
-   `catalogo_items` (id, user_id, nombre, tipo (enum: 'mano_de_obra', 'material'), precio/costo, created_at)

### Security Requirements

-   RLS debe estar activado en la tabla `catalogo_items` para que un `user_id` solo pueda acceder a sus propios registros.

---

## Dependencies

### External Dependencies

-   Supabase Cloud Platform (PostgreSQL).

### Internal Dependencies

-   EPIC-SOL-10: Autenticación y Seguridad de Cuenta (se requiere un usuario autenticado para gestionar el catálogo).

### Blocks

-   EPIC-SOLAR-003: Gestión de Trabajos de Instalación (Core) (los trabajos asignarán materiales/servicios del catálogo).
-   EPIC-SOLAR-006: Facturación Simple (las facturas usarán los precios del catálogo).

---

## Success Metrics

### Functional Metrics

-   Tiempo de respuesta de la API para operaciones CRUD < 500ms.
-   Tasa de error en operaciones CRUD < 0.1%.

### Business Metrics

-   Reducción del 20% en el tiempo de creación de un trabajo al usar ítems de catálogo.

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
| :--- | :--- | :--- | :--- |
| Precios desactualizados | Medium | Medium | Implementar una interfaz clara para la edición. Notificaciones para revisar periódicamente precios. |

---

## Notes

Es importante que la diferenciación entre "servicios de mano de obra" y "materiales" sea clara en la UI y el modelo de datos, aunque se gestionen en la misma tabla.
