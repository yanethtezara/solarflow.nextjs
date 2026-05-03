# Gestión de Instalaciones de Instalación (Core)

**Jira Key:** SOL-22
**Status:** To Do
**Priority:** Critical
**Phase:** Core Features

---

## Epic Description

Esta épica abarca las funcionalidades centrales para la creación y gestión de los instalaciones de instalación solar. Incluye la asociación de clientes y empresas, fechas, ubicaciones, y el seguimiento del estado de cada instalación.

**Business Value:**
Permite a los instaladores organizar y tener un control claro de todos sus proyectos, desde la planificación hasta la finalización, lo que reduce la carga administrativa y mejora la eficiencia operativa. Es el corazón de la aplicación.

---

## User Stories

1. **SOL-23** - As a Javi, I want to poder crear un nuevo instalación de instalación asociando un cliente, una empresa, una fecha, una hora y una ubicación para tener todos los detalles organizados.
2. **SOL-24** - As a David, I want to poder ver un listado de todos mis instalaciones (pasados y futuros) con su estado (ej. Agendado, En Progreso, Completado) para conocer mi carga de instalación.
3. **SOL-25** - As a Javi, I want to poder editar los detalles de un instalación existente para actualizar la información si hay cambios.
4. **SOL-26** - As a David, I want to poder agregar materiales y costos de mano de obra específicos a un instalación para llevar un control de los recursos y gastos del proyecto.
5. **SOL-27** - As a Javi, I want to poder marcar un instalación como "Completado" para saber qué está listo para facturar.

**NOTA:** Los IDs serán actualizados conforme me los proporciones.

---

## Scope

### In Scope

- Creación de instalaciones con asociación a cliente, empresa (opcional), fecha, hora, ubicación.
- Visualización de un listado de instalaciones con filtros por estado.
- Edición de los detalles de un instalación existente.
- Asociación de ítems de catálogo (materiales y servicios) a un instalación con cantidades.
- Cambio del estado de un instalación (Agendado, En Progreso, Completado, etc.).

### Out of Scope (Future)

- Manejo de equipo asignado a un instalación.
- Adjuntar documentos o fotos al instalación.
- Cálculo automático de ruta a la ubicación del instalación.
- Notificaciones automáticas sobre el estado del instalación.

---

## Acceptance Criteria (Epic Level)

1. ✅ Un usuario puede crear un nuevo instalación con todos los detalles necesarios.
2. ✅ Un usuario puede visualizar y gestionar el estado de sus instalaciones.
3. ✅ Un usuario puede asignar materiales y servicios a un instalación y llevar un control de los mismos.

---

## Related Functional Requirements

- **FR-007:** El sistema debe permitir la creación de un nuevo instalación.
- **FR-008:** El sistema debe permitir listar instalaciones.
- **FR-009:** El sistema debe permitir la edición de un instalación.
- **FR-010:** El sistema debe permitir asociar materiales y mano de obra a un instalación.
- **FR-011:** El sistema debe permitir cambiar el estado de un instalación.

See: `.context/SRS/functional-specs.md`

---

## Technical Considerations

### Backend

- API Routes para `/api/trabajos` (GET, POST), `/api/trabajos/[id]` (GET, PUT), `/api/trabajos/[id]/items` (POST, PUT, DELETE).
- Se utiliza el cliente de Supabase para interactuar con las tablas `instalaciones` y `trabajos_items`.

### Database Schema

**Tables:**

- `instalaciones` (id, user_id, cliente_id, empresa_id, fecha, hora, estado, ubicacion, created_at)
- `trabajos_items` (trabajo_id, item_id, cantidad)

### Security Requirements

- RLS debe estar activado en `instalaciones` y `trabajos_items` para que un `user_id` solo acceda a sus propios registros.

---

## Dependencies

### External Dependencies

- Supabase Cloud Platform (PostgreSQL).

### Internal Dependencies

- EPIC-SOL-10: Autenticación y Seguridad de Cuenta.
- EPIC-SOL-15: Gestión de Entidades (Clientes y Empresas).
- EPIC-SOL-18: Catálogo de Servicios y Materiales.

### Blocks

- EPIC-SOLAR-004: Planificación y Visualización (se basa en la existencia de instalaciones).
- EPIC-SOLAR-006: Facturación Simple (se basa en la existencia de instalaciones completados).

---

## Success Metrics

### Functional Metrics

- Tiempo de respuesta de la API para operaciones CRUD < 800ms.
- Tasa de error en operaciones CRUD < 0.2%.

### Business Metrics

- > 5 instalaciones creados por usuario activo en el primer mes.

---

## Risks & Mitigations

| Risk                                                | Impact | Probability | Mitigation                                                           |
| :-------------------------------------------------- | :----- | :---------- | :------------------------------------------------------------------- |
| Complejidad en la UI de creación de instalaciones   | Medium | Medium      | Dividir el formulario en pasos lógicos. Optimizar para mobile-first. |
| Inconsistencia de datos entre instalaciones e ítems | Low    | Low         | Asegurar validaciones a nivel de base de datos (FKs) y API.          |

---

## Notes

La tabla `trabajos_items` será clave para asociar los materiales y servicios del catálogo con un instalación específico y su cantidad.
