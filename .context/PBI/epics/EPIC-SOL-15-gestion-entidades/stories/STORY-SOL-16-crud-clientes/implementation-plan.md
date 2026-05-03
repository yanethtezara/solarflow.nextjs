# Implementation Plan: STORY-SOL-16 - CRUD de Clientes

## Overview

Implementar la gestión completa de clientes (Crear, Leer, Editar, Eliminar) para permitir a los instaladores centralizar su base de datos de contactos.

**Acceptance Criteria a cumplir:**

- Crear cliente con nombre (obligatorio), dirección y teléfono (obligatorio).
- Listar solo los clientes pertenecientes al usuario autenticado.
- Editar información de clientes existentes.
- Bloquear la eliminación de clientes que tengan instalaciones asociados.
- Impedir nombres de clientes duplicados para el mismo usuario.
- Diálogo de confirmación antes de eliminar.

---

## Technical Approach

**Chosen approach:** Utilizar la API auto-generada de Supabase a través del cliente de navegador. La seguridad y el aislamiento se delegarán a las políticas de **Row Level Security (RLS)** de PostgreSQL. Para el estado de la UI y el caché de datos, utilizaremos **React Query** (o SWR) para asegurar que la lista se mantenga sincronizada tras las mutaciones.

**Why this approach:**

- ✅ **Seguridad por Diseño:** El RLS garantiza que un usuario nunca vea datos de otro, incluso si intenta manipular las peticiones de red.
- ✅ **Integridad Referencial:** Postgres se encargará de bloquear el `DELETE` si existe una llave foránea activa en la tabla de instalaciones.
- ✅ **UX Fluida:** El uso de caché permite transiciones instantáneas entre la lista y el detalle.

---

## UI/UX Design

### Componentes a usar:

- **`ClientTable`**: Lista paginada o con scroll infinito mostrando nombre y teléfono.
- **`ClientForm`**: Formulario modal o página dedicada para creación/edición.
- **`DeleteConfirmationDialog`**: Modal de advertencia.

### Wireframes/Layout:

```
┌──────────────────────────────────────┐
│ [←] Clientes          [+ Nuevo]      │
├──────────────────────────────────────┤
│ 🔍 [ Buscar cliente... ]             │
├──────────────────────────────────────┤
│ > Juan Pérez          600 123 456    │
│ > María García        600 987 654    │
└──────────────────────────────────────┘
```

### Estados de UI:

- **Empty State:** "Aún no tienes clientes. Crea el primero para empezar a agendar instalaciones."
- **Error de Integridad:** "No se puede eliminar el cliente porque tiene instalaciones asociados."

---

## Types & Type Safety

**Tipos a usar:**

- Tipo `Cliente` generado desde el esquema de la DB.
- Schema de Zod:
  ```typescript
  const clientSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    telefono: z.string().min(1, 'El teléfono es obligatorio'),
    direccion: z.string().optional(),
  });
  ```

---

## Content Writing

- **Título:** "Mis Clientes"
- **CTA:** "Guardar Cliente"
- **Aviso:** "Los datos del cliente son privados y solo tú puedes verlos."

---

## Implementation Steps

### **Step 1: Esquema de Base de Datos y RLS**

**Task:** Asegurar la existencia de la tabla `clientes` y configurar políticas.
**Details:**

- Tabla: `id`, `user_id`, `nombre`, `direccion`, `telefono`, `created_at`.
- Policy: `CREATE POLICY "Users can only access their own clients" ON clientes FOR ALL USING (auth.uid() = user_id);`.
  **Testing:** Intentar leer la tabla desde la consola de Supabase con un rol de usuario y verificar el filtrado.

### **Step 2: Vista de Lista y Detalle**

**Task:** Implementar la página `/dashboard/clientes` y el fetching de datos.
**Testing:** Crear datos de prueba y verificar que aparezcan ordenados alfabéticamente.

### **Step 3: Formulario de Creación y Edición**

**Task:** Implementar `ClientForm` con validación Zod.
**Details:**

- Manejar `insert` y `update`.
- Validar unicidad del nombre (atrapando el error de Postgres o consultando previamente).
  **Testing:** Intentar crear un cliente con un nombre ya existente y verificar el mensaje de error.

### **Step 4: Lógica de Eliminación Segura**

**Task:** Implementar el botón de borrado con confirmación.
**Testing:**

1. Eliminar un cliente sin instalaciones (éxito).
2. Intentar eliminar un cliente con un instalación vinculado (error controlado).

---

## Dependencies

- [x] EPIC-SOL-10 (Autenticación) completada.
- [ ] Tabla `instalaciones` creada (necesaria para probar la restricción de integridad).

---

## Risks & Mitigations

- **Riesgo:** Confusión del usuario si no sabe por qué no puede borrar un cliente.
- **Mitigación:** Mostrar un mensaje claro indicando que el cliente tiene "Instalaciones pendientes o históricos".

---

## Estimated Effort

- **Total:** 5 Story Points.
