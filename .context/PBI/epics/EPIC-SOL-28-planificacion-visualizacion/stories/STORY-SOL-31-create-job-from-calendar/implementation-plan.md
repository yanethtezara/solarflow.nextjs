# Implementation Plan: STORY-SOL-31 - Crear Trabajo desde Calendario

## Overview

Implementar la capacidad de iniciar la creación de un trabajo haciendo clic directamente en un día del calendario, agilizando el proceso de planificación para el instalador.

**Acceptance Criteria a cumplir:**

- Abrir el formulario de creación al hacer clic en un día del calendario.
- El formulario debe aparecer con la fecha pre-seleccionada automáticamente.
- Reutilizar el formulario completo de creación (SOL-23).
- Tras guardar, el calendario debe refrescarse automáticamente para mostrar el nuevo evento.

---

## Technical Approach

**Chosen approach:** Extender el componente `CalendarView` para manejar el evento `onSelectSlot` (o similar según la librería). Al dispararse el evento, abriremos el `JobCreationForm` dentro de un **Modal**. Pasaremos la fecha del slot seleccionado como una `prop` llamada `initialDate` al formulario. Tras el éxito de la mutación, invalidaremos la query `jobs-calendar` de React Query para forzar el refresco visual.

**Why this approach:**

- ✅ **Agilidad Operativa:** El instalador ve un hueco libre y con un solo clic inicia el registro.
- ✅ **Reutilización:** Evita crear un formulario simplificado y mantiene todas las validaciones de negocio.
- ✅ **Feedback Inmediato:** El refresco automático confirma al usuario que su acción fue procesada.

---

## UI/UX Design

### Componentes a usar:

- **`JobCreationModal`**: Wrapper de modal para el formulario existente.
- **`CalendarSlot`**: Celda interactiva del calendario con indicador visual de "+".

### wireframes/Layout:

```
┌──────────────────────────────────────┐
│ [←] Mayo 2026 [→]                    │
├──────────────────────────────────────┤
│ 18   19  [20+]  21   22              │
│           ^ clic aquí                │
└──────────────────────────────────────┘
      ┌──────────────────────────┐
      │ Nuevo Trabajo (20 May)   │
      │ ------------------------ │
      │ Cliente: [ Seleccionar ] │
      │ [ [ Agendar ] ]          │
      └──────────────────────────┘
```

---

## Types & Type Safety

**Tipos a usar:**

- Interfaces de eventos de la librería de calendario.
- Prop `initialDate: Date | string`.

---

## Content Writing

- **Modal Header:** "Planificar para el {fecha}"
- **Tooltip:** "Clic para añadir trabajo"

---

## Implementation Steps

### **Step 1: Modal de Creación Contextual**

**Task:** Envolver el `JobCreationForm` en un diálogo modal.
**Testing:** Abrir el modal manualmente y verificar que no haya problemas de scroll o visibilidad en móviles.

### **Step 2: Paso de Fecha Inicial**

**Task:** Modificar el formulario para que acepte y asigne el valor por defecto al campo `fecha`.
**Testing:** Hacer clic en el 10 de Junio y verificar que el input date diga "2026-06-10".

### **Step 3: Refresco de Datos**

**Task:** Conectar el callback `onSuccess` del formulario con el disparador de recarga del calendario.
**Testing:** Crear un trabajo y verificar que el "punto" o badge de evento aparezca en el día correspondiente sin recargar la página.

---

## Dependencies

- [x] STORY-23 (Formulario de Creación).
- [x] STORY-29 (Vista de Calendario).

---

## Estimated Effort

- **Total:** 2 Story Points.
