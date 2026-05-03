# Implementation Plan: STORY-SOL-23 - Crear Nuevo Instalación

## Overview

Implementar la funcionalidad para agendar nuevas instalaciones, permitiendo asociar un cliente, una empresa (opcional), fecha, hora y ubicación específica.

**Acceptance Criteria a cumplir:**

- Crear instalación con Cliente, Fecha, Hora y Ubicación.
- El estado inicial debe ser siempre "Agendado".
- El selector de cliente debe cargar solo los clientes del usuario logueado.
- Sugerir la dirección del cliente seleccionado como ubicación inicial.
- Redirección al listado tras éxito.

---

## Technical Approach

**Chosen approach:** Implementar un formulario de creación utilizando un componente `Combobox` para la selección de clientes y empresas (para manejar listas largas eficientemente). Utilizaremos un `Effect` de React para detectar el cambio de cliente y disparar la sugerencia de ubicación. La persistencia se realizará mediante un `INSERT` en la tabla `instalaciones`, manejando la integridad referencial de las FKs.

**Why this approach:**

- ✅ **UX Mejorada:** La sugerencia automática de dirección ahorra tiempo de escritura a Javi en terreno.
- ✅ **Integridad:** El uso de UUIDs para clientes y empresas asegura que la relación sea sólida en la DB.
- ✅ **Escalabilidad:** El Combobox permite buscar entre cientos de clientes sin saturar la vista.

---

## UI/UX Design

### Componentes a usar:

- **`ClientSelector`**: Combobox con búsqueda integrada.
- **`CompanySelector`**: Selector opcional para la entidad contratante.
- **`DatePicker` & `TimeInput`**: Para selección precisa de agenda.
- **`LocationInput`**: Campo de texto con botón de "Usar dirección del cliente".

### wireframes/Layout:

```
┌──────────────────────────────────────┐
│ [←] Nuevo Instalación                    │
├──────────────────────────────────────┤
│ Cliente: [ Seleccionar... 🔍 ]       │
│ Empresa: [ Seleccionar... 🔍 ]       │
│                                      │
│ Fecha: [ 20/05/2026 ]  Hora: [ 09:00]│
│                                      │
│ Ubicación: [ Calle Ejemplo 123...  ] │
│                                      │
│ [ [ Agendar Instalación ] ]              │
└──────────────────────────────────────┘
```

---

## Types & Type Safety

**Tipos a usar:**

- Tipo `Instalación` del esquema Supabase.
- Schema de Zod:
  ```typescript
  const jobSchema = z.object({
    cliente_id: z.string().uuid('Selecciona un cliente'),
    empresa_id: z.string().uuid().optional().nullable(),
    fecha: z.string().min(1, 'La fecha es obligatoria'),
    hora: z.string().min(1, 'La hora es obligatoria'),
    ubicacion: z.string().min(1, 'La ubicación es obligatoria'),
    estado: z.literal('Agendado').default('Agendado'),
  });
  ```

---

## Content Writing

- **Título:** "Agendar Instalación"
- **CTA:** "Crear Instalación"
- **Placeholder Ubicación:** "Dirección exacta de la obra..."

---

## Implementation Steps

### **Step 1: Endpoint de Creación**

**Task:** Validar que la tabla `instalaciones` en Supabase esté lista con sus FKs y RLS.
**Testing:** Insertar un instalación manual con un ID de cliente inválido y verificar que falle por FK.

### **Step 2: Componente Selector de Clientes**

**Task:** Crear un selector que haga fetch de `clientes` filtrados por `user_id`.
**Testing:** Verificar que solo aparezcan los clientes creados por el usuario actual.

### **Step 3: Lógica de Sugerencia de Ubicación**

**Task:** Al seleccionar un cliente, buscar su `direccion` y llenar el campo `ubicacion`.
**Testing:** Cambiar entre dos clientes con direcciones distintas y verificar que el input se actualice.

### **Step 4: Persistencia y Redirección**

**Task:** Ejecutar el `insert` y navegar a `/dashboard/instalaciones`.
**Testing:** Tras guardar, el nuevo instalación debe aparecer al principio de la lista.

---

## Dependencies

- [x] EPIC-SOL-15 (Clientes/Empresas creados).
- [x] EPIC-SOL-10 (Auth).

---

## Estimated Effort

- **Total:** 5 Story Points.
