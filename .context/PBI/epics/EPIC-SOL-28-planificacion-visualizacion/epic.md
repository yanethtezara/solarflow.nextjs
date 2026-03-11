# Planificación y Visualización

**Jira Key:** SOL-28
**Status:** To Do
**Priority:** Medium
**Phase:** Core Features

---

## Epic Description

Esta épica se enfoca en proporcionar al usuario herramientas para visualizar y planificar sus trabajos de instalación de manera efectiva, ofreciendo diferentes vistas (calendario y lista) y la capacidad de crear trabajos directamente desde la vista de calendario.

**Business Value:**
Mejora la organización del tiempo del instalador, permitiéndole tener una visión clara de su carga de trabajo, planificar de forma más eficiente y reducir conflictos de agenda o trabajos olvidados.

---

## User Stories

1. **SOL-29** - As a David, I want to poder ver mis trabajos agendados en una vista de calendario (mensual/semanal) para planificar mi disponibilidad y la de mi equipo.
2. **SOL-30** - As a Javi, I want to poder alternar entre una vista de lista y una vista de calendario para elegir la que mejor me convenga en cada momento.
3. **SOL-31** - As a Javi, I want to poder crear un nuevo trabajo directamente desde la vista de calendario para agilizar la planificación.

**NOTA:** Los IDs serán actualizados conforme me los proporciones.

---

## Scope

### In Scope

-   Vista de calendario mensual y/o semanal que muestra los trabajos agendados.
-   Capacidad de alternar entre la vista de calendario y la vista de lista de trabajos.
-   Opción para crear un nuevo trabajo directamente desde una fecha seleccionada en el calendario.

### Out of Scope (Future)

-   Sincronización con calendarios externos (Google Calendar, Outlook).
-   Visualización de disponibilidad de equipo en el calendario.
-   Arrastrar y soltar trabajos para re-agendarlos en el calendario.
-   Notificaciones basadas en eventos del calendario.

---

## Acceptance Criteria (Epic Level)

1. ✅ Un usuario puede visualizar sus trabajos en un formato de calendario.
2. ✅ Un usuario puede cambiar entre diferentes vistas de trabajos.
3. ✅ Un usuario puede crear un trabajo de forma eficiente desde el calendario.

---

## Related Functional Requirements

-   **FR-XXX:** (Se generarán FRs específicos para cada US de esta épica)

See: `.context/SRS/functional-specs.md` (Nota: Los FRs para esta épica no están detallados aún en el `functional-specs.md` que he leído, se asumirá que se crearán siguiendo el patrón).

---

## Technical Considerations

### Backend

-   API Routes existentes para `trabajos` serán utilizadas para obtener los datos.
-   Posibilidad de añadir parámetros de filtro por rango de fechas a la API de trabajos para la vista de calendario.

### Database Schema

-   Utiliza la tabla `trabajos` existente.

### Security Requirements

-   RLS debe estar activo para todas las consultas de trabajos.

---

## Dependencies

### External Dependencies

-   Ninguna.

### Internal Dependencies

-   EPIC-SOL-10: Autenticación y Seguridad de Cuenta.
-   EPIC-SOL-22: Gestión de Trabajos de Instalación (Core) (requiere trabajos existentes para visualizar).

### Blocks

-   Ninguna.

---

## Success Metrics

### Functional Metrics

-   Tiempo de carga de la vista de calendario < 3 segundos.

### Business Metrics

-   Reducción del 15% en el tiempo dedicado a la planificación de trabajos.

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
| :--- | :--- | :--- | :--- |
| UI de calendario compleja de implementar | Medium | Medium | Usar una librería de calendario bien establecida (ej. FullCalendar, React Big Calendar) para el frontend. |
| Problemas de rendimiento con muchos trabajos | Low | Low | Implementar paginación o carga bajo demanda en la API si la cantidad de trabajos se vuelve muy grande. |

---

## Notes

La vista de calendario debe ser intuitiva y visualmente clara, destacando los días con trabajos.
La creación de un trabajo desde el calendario debe pre-seleccionar la fecha para ahorrar tiempo al usuario.
