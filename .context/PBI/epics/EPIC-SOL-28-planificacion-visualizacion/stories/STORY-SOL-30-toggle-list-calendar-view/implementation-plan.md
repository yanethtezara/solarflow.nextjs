# Implementation Plan: STORY-SOL-30 - Alternar Vistas Lista/Calendario

## Overview

Implementar un mecanismo que permita al usuario cambiar fluidamente entre la vista de lista y la de calendario, recordando su preferencia para futuras sesiones.

**Acceptance Criteria a cumplir:**

- Botón de toggle para alternar entre Lista y Calendario.
- Persistencia de la vista elegida en `localStorage`.
- Sincronización de filtros (estado, fechas) entre ambas vistas.
- Transición instantánea sin recarga de página (Uso de estados de React).

---

## Technical Approach

**Chosen approach:** Implementar un hook custom `useViewPreference` que gestione el estado `'list' | 'calendar'`. El componente padre `/dashboard/trabajos` renderizará condicionalmente `JobListView` o `CalendarView`. La sincronización de filtros se asegurará mediante el uso de los mismos Query Params en la URL para ambas vistas.

**Why this approach:**

- ✅ **UX Continua:** Si David filtra por "En Progreso" en la lista y cambia al calendario, seguirá viendo solo los "En Progreso".
- ✅ **Simplicidad:** Delegar la persistencia a `localStorage` evita llamadas innecesarias al backend para guardar preferencias menores.

---

## UI/UX Design

### Componentes a usar:

- **`ViewToggle`**: Grupo de botones (Tabs o Segmented Control) con íconos de lista y calendario.
- **`DashboardHeader`**: Espacio donde se ubicará el toggle para acceso global.

### wireframes/Layout:

```
┌──────────────────────────────────────┐
│ [≡] Trabajos      [ Lista | Calendario ] │
├──────────────────────────────────────┤
│ [ Filtros ]                          │
├──────────────────────────────────────┤
│ { Componente condicional aquí }      │
└──────────────────────────────────────┘
```

---

## Types & Type Safety

**Tipos a usar:**

- Tipo `ViewType = 'list' | 'calendar'`.

---

## Content Writing

- **Labels:** "Vista de Lista", "Vista de Calendario".

---

## Implementation Steps

### **Step 1: Hook useViewPreference**

**Task:** Crear la lógica de lectura/escritura en `localStorage`.
**Testing:** Seleccionar "Calendario", refrescar la página y verificar que la app inicie en Calendario.

### **Step 2: Componente ViewToggle**

**Task:** Crear el interruptor visual en el layout del Dashboard.
**Testing:** Verificar que al hacer clic se actualice el estado global de la aplicación.

### **Step 3: Renderizado Condicional**

**Task:** Integrar los componentes `JobList` y `CalendarGrid` en el switch de la página.
**Testing:** Asegurar que no haya errores de renderizado ("hydration errors") al alternar rápidamente.

---

## Dependencies

- [x] STORY-24 (Lista).
- [x] STORY-29 (Calendario).

---

## Estimated Effort

- **Total:** 1 Story Point.
