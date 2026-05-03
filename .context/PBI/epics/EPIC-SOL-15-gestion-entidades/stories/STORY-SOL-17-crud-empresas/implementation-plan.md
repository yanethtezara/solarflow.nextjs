# Implementation Plan: STORY-SOL-17 - CRUD de Empresas

## Overview

Implementar la gestión de empresas contratantes (subcontratistas o clientes corporativos), permitiendo a Javi y David organizar sus instalaciones por entidad pagadora.

**Acceptance Criteria a cumplir:**

- Crear empresa con nombre (obligatorio), contacto responsable y teléfono (obligatorio).
- Listar solo las empresas pertenecientes al usuario autenticado.
- Editar información de empresas existentes.
- Bloquear la eliminación de empresas que tengan instalaciones asociados.
- Impedir nombres de empresas duplicados para el mismo usuario.
- Diálogo de confirmación antes de eliminar.

---

## Technical Approach

**Chosen approach:** Reutilizar el patrón de arquitectura de `SOL-16` (Supabase Client + RLS). Utilizaremos la tabla `empresas` y aplicaremos políticas de aislamiento idénticas. Para la UI, se crearán componentes específicos que hereden el diseño de la sección de clientes para mantener la consistencia visual.

**Why this approach:**

- ✅ **Coherencia:** El usuario aprende a usar una sección y ya sabe usar la otra.
- ✅ **Mantenibilidad:** El código compartido (como el `DeleteDialog`) reduce el esfuerzo de desarrollo y testing.
- ✅ **Seguridad:** El RLS centraliza la protección de datos en la base de datos.

---

## UI/UX Design

### Componentes a usar:

- **`CompanyTable`**: Lista detallada con el nombre de la empresa y la persona de contacto.
- **`CompanyForm`**: Formulario con campos: Nombre Empresa, Contacto Responsable, Teléfono y Dirección.
- **`DeleteConfirmationDialog`**: Reutilizado del módulo de clientes.

### Estados de UI:

- **Loading:** Skeleton de tabla mientras se obtienen los datos.
- **Error de Integridad:** Mensaje: "Esta empresa no puede ser eliminada porque tiene instalaciones vinculados."

---

## Types & Type Safety

**Tipos a usar:**

- Tipo `Empresa` generado desde Supabase.
- Schema de Zod:
  ```typescript
  const companySchema = z.object({
    nombre: z.string().min(1, 'El nombre de la empresa es obligatorio'),
    contacto_responsable: z.string().optional(),
    telefono: z.string().min(1, 'El teléfono de contacto es obligatorio'),
    direccion: z.string().optional(),
  });
  ```

---

## Content Writing

- **Título:** "Empresas Contratantes"
- **Subtítulo:** "Gestiona las empresas que subcontratan tus servicios."
- **Campos:** "Persona de contacto", "Nombre legal / Comercial".

---

## Implementation Steps

### **Step 1: Esquema de Base de Datos y RLS**

**Task:** Validar tabla `empresas` y políticas.
**Details:**

- Tabla: `id`, `user_id`, `nombre`, `contacto_responsable`, `telefono`, `direccion`.
- RLS Policy: `auth.uid() = user_id`.
  **Testing:** Verificar que al insertar desde la API se asigne correctamente el `user_id`.

### **Step 2: Página de Listado (/dashboard/empresas)**

**Task:** Crear la vista principal de gestión de empresas.
**Testing:** Asegurar que el filtro de búsqueda (si se implementa) sea insensible a mayúsculas/minúsculas.

### **Step 3: CRUD de Empresas**

**Task:** Implementar la lógica de creación y edición.
**Testing:**

- Crear empresa con éxito.
- Validar que no se permiten nombres duplicados bajo el mismo usuario.

### **Step 4: Validación de Eliminación**

**Task:** Implementar borrado con restricción de integridad.
**Testing:** Intentar borrar una empresa con instalaciones asociados y confirmar que el sistema lo impide con un mensaje amigable.

---

## Dependencies

- [x] EPIC-SOL-10 (Autenticación).
- [ ] EPIC-SOL-22 (Instalaciones) para pruebas de integridad referencial.

---

## Estimated Effort

- **Total:** 4 Story Points.
