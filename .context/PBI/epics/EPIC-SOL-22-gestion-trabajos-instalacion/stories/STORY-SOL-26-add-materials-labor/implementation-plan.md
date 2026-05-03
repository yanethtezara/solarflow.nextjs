# Implementation Plan: STORY-SOL-26 - Asignación de Materiales y Servicios

## Overview

Implementar la capacidad de desglosar materiales y servicios consumidos en un instalación específico, permitiendo calcular el costo total de la obra de forma precisa y persistente.

**Acceptance Criteria a cumplir:**

- Agregar ítems del catálogo (Materiales/Mano de Obra) a un instalación.
- Definir cantidad para cada ítem agregado.
- Snapshot de Precios: Guardar el precio/costo del momento de la asignación.
- Recalcular el total del instalación automáticamente al añadir o eliminar ítems.
- Listar todos los ítems asociados en la vista de detalle del instalación.
- Eliminar ítems del desglose.

---

## Technical Approach

**Chosen approach:** Utilizar la tabla asociativa `trabajos_items`. La lógica de inserción se realizará mediante una **Stored Procedure** en Supabase (o una transacción compleja en el cliente) que: 1. Obtenga el precio actual del catálogo, 2. Inserte en `trabajos_items` incluyendo ese precio como snapshot, 3. (Opcional) Actualice la columna `total_acumulado` en la tabla `instalaciones`. Para la UI, utilizaremos un buscador de ítems con autocompletado.

**Why this approach:**

- ✅ **Consistencia Financiera:** El snapshot evita que una subida de precios en el catálogo altere facturas de instalaciones pasados.
- ✅ **Rendimiento:** Almacenar el snapshot evita joins complejos con el catálogo para calcular totales históricos.
- ✅ **UX de Alta Calidad:** El buscador dinámico permite a David encontrar materiales rápidamente entre cientos de opciones.

---

## UI/UX Design

### Componentes a usar:

- **`ItemSelector`**: Buscador con filtros por tipo.
- **`ItemsTable`**: Desglose con columnas: Ítem, Cantidad, Precio Unitario, Subtotal y Acción (Eliminar).
- **`TotalFooter`**: Resumen visual del costo total del instalación.

### wireframes/Layout:

```
┌──────────────────────────────────────┐
│ [≡] Detalle Instalación #45              │
├──────────────────────────────────────┤
│ CLIENTE: Juan Pérez                  │
├──────────────────────────────────────┤
│ MATERIALES Y SERVICIOS      [+ Add]  │
│ ------------------------------------ │
│ Panel 450W   x5   $200   $1000  [X]  │
│ Mano Obra    x1   $150   $150   [X]  │
│ ------------------------------------ │
│ TOTAL:                   $1150.00    │
└──────────────────────────────────────┘
```

---

## Types & Type Safety

**Tipos a usar:**

- Tipo `TrabajoItem` extendido con el nombre del ítem (para visualización).
- Lógica de cálculo usando `Big.js` o similar para evitar errores de precisión decimal en JS.

---

## Content Writing

- **Sección:** "Desglose de Costos"
- **CTA:** "Añadir al Instalación"
- **Empty:** "No hay materiales asignados aún."

---

## Implementation Steps

### **Step 1: Tabla trabajos_items y Snapshoting**

**Task:** Definir tabla en Supabase: `id`, `trabajo_id`, `item_id`, `cantidad`, `precio_snapshot`, `costo_snapshot`.
**Testing:** Insertar un ítem y verificar que el precio guardado no sea nulo.

### **Step 2: Buscador de Ítems del Catálogo**

**Task:** Implementar un selector que permita filtrar por nombre y tipo.
**Testing:** Buscar "Panel" y verificar que solo aparezcan los ítems del catálogo del usuario.

### **Step 3: Lógica de Inserción y Totales**

**Task:** Implementar la mutación que añade el ítem y recalcula el total de la vista.
**Testing:** Añadir 2 ítems y verificar que el `Total` sea la suma exacta de sus subtotales.

### **Step 4: Eliminación de ítems**

**Task:** Implementar `DELETE` en `trabajos_items` y refrescar la UI.
**Testing:** Eliminar un ítem y verificar que el total disminuya.

---

## Dependencies

- [x] EPIC-SOL-18 (Catálogo de Ítems).
- [x] STORY-SOL-23 (Estructura de Instalación).

---

## Estimated Effort

- **Total:** 8 Story Points (Alta complejidad lógica).
