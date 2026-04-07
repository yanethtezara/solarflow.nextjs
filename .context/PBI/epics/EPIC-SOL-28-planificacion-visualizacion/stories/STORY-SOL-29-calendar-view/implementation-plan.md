# Implementation Plan: STORY-SOL-29 - Vista de Calendario

## Overview

Implementar una vista visual de calendario que permita a los instaladores ver la distribución de sus trabajos en el tiempo, facilitando la planificación de su disponibilidad.

**Acceptance Criteria a cumplir:**

- Visualizar trabajos en una cuadrícula mensual y semanal.
- Diferenciar los trabajos por colores según su estado (Azul, Naranja, Verde, Gris).
- Navegar entre meses (limitado a 6 meses atrás y 12 meses adelante).
- Ver resumen del trabajo (Cliente + Hora) al hacer clic o hover.
- Cargar solo los trabajos del usuario autenticado (RLS).

---

## Technical Approach

**Chosen approach:** Utilizar una librería de calendario ligera y compatible con Next.js (ej. `shadcn/ui calendar` extendido o una implementación custom con `date-fns`). La lógica de fetching se integrará con el endpoint `/api/trabajos` pasando parámetros de rango de fecha (`startDate` y `endDate`). Los eventos se renderizarán condicionalmente con clases de Tailwind según el enum de `estado`.

**Why this approach:**

- ✅ **Performance:** El filtrado por rango en el servidor evita descargar todo el historial de trabajos innecesariamente.
- ✅ **UX Familiar:** Un calendario es la herramienta estándar para cualquier profesional que maneje citas.
- ✅ **Consistencia:** Reutiliza la lógica de seguridad y datos ya implementada en la Épica de Trabajos.

---

## UI/UX Design

### Componentes a usar:

- **`CalendarGrid`**: Cuadrícula dinámica de días.
- **`CalendarEvent`**: Indicador visual dentro de cada día.
- **`EventPopover`**: Mini-detalle que aparece al interactuar con un evento.

### Wireframes/Layout:

```
┌──────────────────────────────────────┐
│ [←] Mayo 2026 [→]      [ Vista: Mes▼]│
├──────────────────────────────────────┤
│ L   M   M   J   V   S   D            │
│             1   2   3   4            │
│ 5   6   7   8  [9] 10  11            │
│                (•)                   │
└──────────────────────────────────────┘
(•) 09:00 - Juan Pérez [Agendado]
```

### Código de Colores (Badge):

- **Agendado:** `bg-blue-500`
- **En Progreso:** `bg-orange-500`
- **Completado:** `bg-green-500`
- **Cancelado:** `bg-gray-400`

---

## Types & Type Safety

**Tipos a usar:**

- Tipo `Trabajo` filtrado para el rango visible.
- Interfaces de la librería de calendario elegida.

---

## Content Writing

- **Título:** "Calendario de Instalaciones"
- **Empty Day:** "No tienes trabajos para este día."

---

## Implementation Steps

### **Step 1: Endpoint con Rango de Fechas**

**Task:** Modificar la lógica de fetching para aceptar `?start=...&end=...`.
**Testing:** Probar la API vía Swagger/Postman y confirmar que no devuelve datos fuera del rango.

### **Step 2: Componente CalendarView**

**Task:** Integrar la cuadrícula base y la navegación entre meses.
**Testing:** Verificar que al cambiar de mes se dispare una nueva petición a Supabase con las fechas correctas.

### **Step 3: Mapeo de Eventos y Colores**

**Task:** Transformar el array de trabajos en "Eventos" de calendario y aplicar estilos por estado.
**Testing:** Crear un trabajo de cada estado en DB y verificar que los colores en el calendario coincidan.

### **Step 4: Interacción Detalle Rápido**

**Task:** Implementar el Popover/Tooltip con la info básica.
**Testing:** Verificar que al hacer clic en un evento se vea el nombre del cliente y la hora sin salir de la página.

---

## Dependencies

- [x] STORY-SOL-23 (Creación de trabajos para tener qué mostrar).
- [x] EPIC-SOL-10 (Auth).

---

## Estimated Effort

- **Total:** 5 Story Points (Complejidad media en UI).
