# Implementation Plan: STORY-SOL-27 - Completar y Gestionar Estados de Instalación

## Overview

Implementar la lógica de transiciones de estado para los instalaciones, permitiendo al instalador marcar el progreso desde que se agenda hasta que se completa para su cobro.

**Acceptance Criteria a cumplir:**

- Cambiar el estado de un instalación entre: Agendado, En Progreso, Completado y Cancelado.
- Mostrar visualmente el estado actual con colores distintivos.
- Bloquear la edición de ítems si el instalación está en estado "Completado" o "Cancelado" (Regla de integridad).
- Actualizar el estado en tiempo real en la lista y detalle.
- Seguridad RLS para evitar que terceros cambien el estado de un instalación.

---

## Technical Approach

**Chosen approach:** Utilizar un componente `StatusSelector` que dispare una mutación `PATCH` a Supabase. Definiremos un Enum en PostgreSQL para los estados. Implementaremos una lógica de protección en la UI que deshabilite los botones de "Agregar Ítem" o "Editar" basándose en el valor de la columna `estado`.

**Why this approach:**

- ✅ **Flujo de Instalación Claro:** El instalador tiene un control visual del ciclo de vida del proyecto.
- ✅ **Consistencia de Datos:** Impedir ediciones en instalaciones completados evita discrepancias tras la generación de facturas.
- ✅ **Eficiencia:** El uso de `PATCH` optimiza el tráfico de red al actualizar solo una columna.

---

## UI/UX Design

### Componentes a usar:

- **`StatusBadge`**: Componente visual reutilizable para mostrar el estado en toda la app.
- **`StatusDropdown`**: Selector de estados con feedback de carga.

### wireframes/Layout:

```
┌──────────────────────────────────────┐
│ [≡] Detalle Instalación #45              │
├──────────────────────────────────────┤
│ ESTADO: [ En Progreso ▼ ]            │
│ (Cambiar a: Completado | Cancelado)  │
└──────────────────────────────────────┘
```

### Código de Colores:

- **Agendado:** Azul
- **En Progreso:** Naranja
- **Completado:** Verde
- **Cancelado:** Gris

---

## Types & Type Safety

**Tipos a usar:**

- Enum `JobStatus` ('Agendado' | 'En Progreso' | 'Completado' | 'Cancelado').
- Schema de Zod para la actualización parcial.

---

## Content Writing

- **Confirmación:** "¿Deseas marcar este instalación como Completado? No podrás editar los materiales después."
- **Aviso:** "Instalación completado. Listo para facturar."

---

## Implementation Steps

### **Step 1: Definición de Estados en DB**

**Task:** Crear el tipo Enum en Postgres y actualizar la columna `estado`.
**Testing:** Intentar insertar un estado inválido (ej. "Enviado") y verificar el error de la DB.

### **Step 2: Componente StatusSelector**

**Task:** Implementar la interfaz para cambiar estados.
**Testing:** Verificar que al seleccionar un nuevo estado, el badge cambie de color inmediatamente.

### **Step 3: Lógica de Bloqueo de Edición**

**Task:** En el detalle del instalación, condicionar los botones de acción al estado.
**Details:**

- `isEditable = estado !== 'Completado' && estado !== 'Cancelado'`.
  **Testing:** Cambiar a "Completado" y verificar que los botones de "Añadir Material" desaparezcan o se inhabiliten.

### **Step 4: Middleware de Seguridad**

**Task:** (Opcional) Validar en la API que no se permitan mutaciones si el estado es terminal.
**Testing:** Intentar un `PUT` vía Postman a un instalación completado y verificar el rechazo.

---

## Dependencies

- [x] STORY-SOL-23 (Estructura de Instalación).
- [x] STORY-SOL-26 (Items asignados).

---

## Estimated Effort

- **Total:** 2 Story Points.
