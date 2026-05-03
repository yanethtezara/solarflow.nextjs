# Implementation Plan: STORY-SOL-19 - Catálogo de Mano de Obra

## Overview

Implementar la gestión de servicios de mano de obra (ej. Instalación, Mantenimiento) para que el instalador pueda estandarizar sus precios base antes de agendar instalaciones.

**Acceptance Criteria a cumplir:**

- Crear servicio con nombre y precio (obligatorio, mayor a 0).
- Listar solo servicios de tipo "Mano de Obra".
- Bloquear eliminación de servicios ya utilizados en instalaciones.
- Moneda única en USD.
- Validación de que el nombre incluya la unidad si es necesario (regla de negocio sugerida).

---

## Technical Approach

**Chosen approach:** Utilizar una única tabla `catalogo_items` en Supabase con una columna discriminadora `tipo` (Enum: `material`, `mano_de_obra`). Esto simplifica las consultas y permite reutilizar componentes de UI. Aplicaremos RLS para asegurar que cada usuario gestione su propio catálogo.

**Why this approach:**

- ✅ **Escalabilidad:** Permite añadir nuevos tipos de ítems en el futuro fácilmente.
- ✅ **Simplicidad de DB:** Una sola tabla con un índice por `user_id` y `tipo` es altamente eficiente.
- ✅ **Reutilización de Código:** Los formularios de servicios y materiales compartirán el 90% de la lógica.

---

## UI/UX Design

### Componentes a usar:

- **`LaborServiceForm`**: Formulario con campos: Nombre del Servicio y Precio (USD).
- **`LaborServiceTable`**: Vista de lista filtrada por `tipo = 'mano_de_obra'`.

### wireframes/Layout:

```
┌──────────────────────────────────────┐
│ [←] Mano de Obra      [+ Nuevo]      │
├──────────────────────────────────────┤
│ > Instalación Estándar      $150.00  │
│ > Mantenimiento VIP         $200.00  │
└──────────────────────────────────────┘
```

---

## Types & Type Safety

**Tipos a usar:**

- Enum `ItemType` ('material' | 'mano_de_obra').
- Schema de Zod:
  ```typescript
  const laborSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    precio: z.number().positive('El precio debe ser mayor a 0'),
    tipo: z.literal('mano_de_obra'),
  });
  ```

---

## Content Writing

- **Título:** "Servicios de Mano de Obra"
- **Label:** "Precio por servicio (USD)"
- **Ayuda:** "Define cuánto cobras por tus servicios recurrentes."

---

## Implementation Steps

### **Step 1: Creación de la Tabla catalogo_items**

**Task:** Definir el esquema en Supabase y activar RLS.
**Details:**

- Columnas: `id`, `user_id`, `nombre`, `precio`, `tipo`, `created_at`.
- Constraint: `CHECK (precio > 0)`.
  **Testing:** Verificar que no se puedan insertar precios negativos desde la consola de Supabase.

### **Step 2: Lógica de Filtrado por Tipo**

**Task:** Asegurar que la vista de servicios solo pida y muestre `mano_de_obra`.
**Testing:** Crear un material manual y verificar que no aparezca en la lista de servicios.

### **Step 3: Formulario de Creación de Servicios**

**Task:** Implementar la UI para agregar nuevos servicios.
**Testing:** Validar que el botón "Guardar" esté deshabilitado si el precio es 0.

### **Step 4: Validación de Eliminación Segura**

**Task:** Implementar restricción de borrado si existen referencias en `trabajos_items`.
**Testing:** Intentar borrar un servicio usado y confirmar el bloqueo.

---

## Dependencies

- [x] EPIC-SOL-10 (Auth).
- [ ] Tabla `trabajos_items` (necesaria para el bloqueo de borrado).

---

## Estimated Effort

- **Total:** 3 Story Points.
