# Implementation Plan: STORY-SOL-21 - Edición y Eliminación de Catálogo

## Overview

Implementar la capacidad de modificar precios/costos y eliminar ítems del catálogo, asegurando que los cambios no afecten la integridad histórica de los trabajos ya creados.

**Acceptance Criteria a cumplir:**

- Editar nombre y precio/costo de ítems existentes.
- Bloquear el cambio de "tipo" (Material <-> Mano de Obra) tras la creación.
- Eliminar ítems con diálogo de confirmación.
- Asegurar que el borrado esté bloqueado si el ítem tiene referencias en la tabla `trabajos_items`.
- Protección RLS para que solo el dueño del ítem pueda editarlo o borrarlo.

---

## Technical Approach

**Chosen approach:** Reutilizar los formularios `LaborServiceForm` y `MaterialForm` en modo "edit". Implementaremos un hook `useItemMutation` que centralice las llamadas a `update` y `delete` de Supabase. La restricción de borrado se manejará mediante una captura de error de base de datos (Postgres Foreign Key Violation) para informar al usuario por qué no puede eliminar un ítem.

**Why this approach:**

- ✅ **Consistencia:** El usuario usa la misma interfaz para crear y editar.
- ✅ **Seguridad Robusta:** RLS en Postgres es la última línea de defensa contra inyecciones de IDs.
- ✅ **Manejo de Errores Nativo:** Aprovechar las restricciones de la DB evita lógica redundante en el backend.

---

## UI/UX Design

### Componentes a usar:

- **`EditItemModal`**: Modal que carga los datos del ítem seleccionado.
- **`DeleteConfirmationDialog`**: Reutilizado de la sección de Entidades.

### Estados de UI:

- **Confirmación:** " ¿Estás seguro de que deseas eliminar este ítem? Esta acción no se puede deshacer si no está en uso."
- **Bloqueo:** "Este ítem está siendo usado en 3 trabajos y no puede eliminarse."

---

## Types & Type Safety

**Tipos a usar:**

- Tipo `CatalogoItem` generado por Supabase CLI.
- Schema de Zod para edición (similar al de creación pero permitiendo ID obligatorio).

---

## Content Writing

- **Título Modal:** "Editar Ítem"
- **CTA:** "Actualizar precio"
- **Aviso:** "Los cambios de precio solo aplicarán a los nuevos trabajos que crees."

---

## Implementation Steps

### **Step 1: Lógica de Edición**

**Task:** Habilitar el modo edición en los formularios existentes.
**Details:**

- Cargar datos iniciales.
- Ejecutar `UPDATE catalogo_items SET ... WHERE id = X AND user_id = auth.uid()`.
  **Testing:** Editar un precio y verificar que se actualiza en la lista sin recargar (caché de React Query).

### **Step 2: Modal de Eliminación**

**Task:** Conectar el botón de borrado con la lógica de confirmación.
**Testing:** Verificar que al hacer clic en "Cancelar" no ocurra ninguna petición de red.

### **Step 3: Manejo de Restricciones de Integridad**

**Task:** Atipar el error de Postgres al intentar borrar ítems con FK activas.
**Details:**

- Catch error code `23503` (Foreign Key Violation).
- Mostrar Toast amigable.
  **Testing:** Intentar borrar un material que ya está en una factura y validar el mensaje de error.

---

## Dependencies

- [x] EPIC-SOL-18 (Tabla `catalogo_items`).
- [ ] Tabla `trabajos_items` para pruebas de bloqueo.

---

## Estimated Effort

- **Total:** 3 Story Points.
