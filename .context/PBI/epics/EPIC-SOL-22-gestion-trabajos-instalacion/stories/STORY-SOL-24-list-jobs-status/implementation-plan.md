# Implementation Plan: STORY-SOL-24 - Listado de Trabajos

## Overview

Implementar la vista principal de gestión de trabajos, permitiendo a los usuarios visualizar su carga operativa filtrada por estado y ordenada cronológicamente.

**Acceptance Criteria a cumplir:**

- Mostrar lista de trabajos con: Cliente, Fecha, Hora y Estado.
- Ordenar automáticamente por fecha (más próxima primero).
- Implementar filtros por estado (Agendado, En Progreso, Completado, Cancelado).
- Sincronización de filtros con la URL para permitir refrescos de página.
- Mostrar estados vacíos con mensajes motivadores y CTA.

---

## Technical Approach

**Chosen approach:** Utilizar una página dinámica `/dashboard/trabajos` que consuma la API de Supabase. El filtrado por estado se manejará mediante Query Params en la URL, lo que permitirá que el hook `useJobs` (basado en React Query) revalide los datos automáticamente cuando cambie la URL. Los estados visuales se representarán mediante "Chips" o "Badges" de colores definidos en el Design System.

**Why this approach:**

- ✅ **Navegación Intuitiva:** El usuario puede usar el botón "Atrás" del navegador y mantener sus filtros.
- ✅ **Rendimiento:** Solo se piden a la DB los registros que coinciden con el filtro activo.
- ✅ **SEO/Compartibilidad:** Permite enviar un enlace directo a "Trabajos Completados" si fuera necesario.

---

## UI/UX Design

### Componentes a usar:

- **`JobCard`**: Tarjeta compacta para dispositivos móviles con acciones rápidas.
- **`StatusFilterBar`**: Fila de botones/chips para filtrar por estado.
- **`EmptyJobsState`**: Componente visual para cuando no hay datos.

### Wireframes/Layout:

```
┌──────────────────────────────────────┐
│ [≡] Mis Trabajos          [+ Nuevo]  │
├──────────────────────────────────────┤
│ [ Todos ] [Agendados] [En Progreso]  │
├──────────────────────────────────────┤
│ 📅 HOY - 09:00                       │
│ Juan Pérez | Calle Falsa 123         │
│ [ Agendado ]                         │
├──────────────────────────────────────┤
│ 📅 MAÑANA - 10:30                    │
│ Empresa Solar | Av. Libertad         │
│ [ En Progreso ]                      │
└──────────────────────────────────────┘
```

### Estados de UI:

- **Hoy:** Los trabajos de la fecha actual tendrán un borde resaltado.
- **Vencidos:** Trabajos agendados en el pasado que no están completados se mostrarán con una alerta de "Retrasado".

---

## Types & Type Safety

**Tipos a usar:**

- Tipo `Trabajo` extendido con el `Nombre del Cliente` (vía join de Supabase).
- Enum de estados para los filtros.

---

## Content Writing

- **Vacío General:** "Tu agenda está despejada. ¡Es un buen momento para captar nuevos clientes!"
- **Vacío Filtrado:** "No hay trabajos con el estado seleccionado."

---

## Implementation Steps

### **Step 1: Endpoint con Joins**

**Task:** Asegurar que la query de Supabase traiga el nombre del cliente asociado.
**Details:**

- Query: `select('*, clientes(nombre)')`.
  **Testing:** Verificar en la consola de red que el objeto JSON incluya los datos del cliente.

### **Step 2: Barra de Filtros y Sincronización de URL**

**Task:** Implementar la lógica de Query Params.
**Testing:** Cambiar el filtro manualmente en la URL y verificar que la lista se actualice.

### **Step 3: Renderizado de la Lista (Mobile-First)**

**Task:** Crear el componente `JobCard` optimizado para lectura rápida en pantallas pequeñas.
**Testing:** Probar la visualización en modo responsive (iPhone/Android).

---

## Dependencies

- [x] STORY-SOL-23 (Creación de trabajos).
- [x] EPIC-SOL-15 (Integridad de Clientes).

---

## Estimated Effort

- **Total:** 3 Story Points.
