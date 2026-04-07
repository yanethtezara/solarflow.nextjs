# Implementation Plan: STORY-SOL-20 - Catálogo de Materiales

## Overview

Implementar la gestión de materiales comunes (ej. Paneles, Inversores, Cableado) para estandarizar los costos de insumos en los presupuestos y trabajos.

**Acceptance Criteria a cumplir:**

- Crear material con nombre y costo (obligatorio, mayor a 0).
- Listar solo ítems de tipo "Material".
- Bloquear eliminación de materiales ya utilizados en trabajos.
- Moneda única en USD.
- El usuario escribe la unidad de medida en el nombre (ej. "Cable 4mm (m)").

---

## Technical Approach

**Chosen approach:** Reutilizar la tabla `catalogo_items` creada en SOL-19. La lógica de inserción forzará el `tipo = 'material'`. La UI será una copia del componente de servicios pero adaptada semánticamente a "Materiales" y "Costos" en lugar de "Servicios" y "Precios".

**Why this approach:**

- ✅ **Máxima Reutilización:** Minimiza el tiempo de desarrollo al usar el mismo backend y lógica de validación.
- ✅ **Consistencia:** El usuario percibe una interfaz coherente en todo el catálogo.

---

## UI/UX Design

### Componentes a usar:

- **`MaterialForm`**: Reutiliza `LaborServiceForm` con labels cambiados.
- **`MaterialTable`**: Lista filtrada por `tipo = 'material'`.

### Wireframes/Layout:

```
┌──────────────────────────────────────┐
│ [←] Materiales        [+ Nuevo]      │
├──────────────────────────────────────┤
│ > Panel Solar 450W          $210.50  │
│ > Inversor String 5kW       $850.00  │
└──────────────────────────────────────┘
```

---

## Types & Type Safety

**Tipos a usar:**

- Schema de Zod:
  ```typescript
  const materialSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    precio: z.number().positive('El costo debe ser mayor a 0'), // 'precio' es el nombre de la columna en la DB
    tipo: z.literal('material'),
  });
  ```

---

## Content Writing

- **Título:** "Catálogo de Materiales"
- **Label:** "Costo unitario (USD)"
- **Placeholder:** "Ej: Panel Solar 400W"

---

## Implementation Steps

### **Step 1: Adaptación de la UI**

**Task:** Crear la página `/dashboard/materiales` y el formulario.
**Details:**

- Asegurar que el `tipo` enviado a la API sea siempre `material`.
  **Testing:** Crear un material y verificar que aparezca en la lista correcta.

### **Step 2: Validación de Costos**

**Task:** Aplicar las mismas restricciones de SOL-19 (Positivo, Obligatorio).
**Testing:** Intentar guardar sin nombre y verificar el bloqueo.

### **Step 3: Protección de Datos (RLS)**

**Task:** Validar que las políticas creadas en SOL-19 cubren automáticamente a los materiales.
**Testing:** Cambiar de usuario y verificar que el catálogo esté vacío para el nuevo usuario.

---

## Dependencies

- [x] EPIC-SOL-18 (Tabla `catalogo_items`).

---

## Estimated Effort

- **Total:** 2 Story Points (Reducido por reutilización).
