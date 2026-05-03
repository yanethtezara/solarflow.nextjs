# Implementation Plan: STORY-SOL-25 - Edición de Detalles de Instalación

## Overview

Implementar la capacidad de modificar la información de un instalación agendado (ubicación, fecha, cliente, etc.) para mantener la exactitud de la agenda operativa.

**Acceptance Criteria a cumplir:**

- Editar todos los campos del encabezado del instalación.
- Pre-cargar los datos existentes en el formulario de edición.
- Validar que los campos obligatorios sigan siendo requeridos tras la edición.
- Bloquear la edición si el usuario no es el dueño del instalación (RLS).
- Redirección al detalle del instalación tras guardar los cambios.

---

## Technical Approach

**Chosen approach:** Reutilizar el componente `JobForm` (creado en SOL-23) en modo "update". Utilizaremos una ruta dinámica `/dashboard/instalaciones/[id]/editar` que realice un fetch inicial de los datos. La mutación se realizará mediante `UPDATE instalaciones SET ... WHERE id = id AND user_id = auth.uid()`.

**Why this approach:**

- ✅ **Mantenibilidad:** Un solo formulario para crear y editar reduce la duplicación de lógica de validación (Zod).
- ✅ **Seguridad Nativa:** El RLS de Postgres impedirá cualquier intento de edición maliciosa mediante cambio de IDs en el cliente.
- ✅ **UX Consistente:** El usuario ya conoce el formulario de creación, por lo que la edición le resultará familiar.

---

## UI/UX Design

### Componentes a usar:

- **`JobForm`**: Configurado con `initialData`.
- **`Breadcrumbs`**: Para facilitar el regreso a la lista o al detalle.

### Estados de UI:

- **Fetching:** Mostrar un spinner o esqueleto de formulario mientras cargan los datos originales.
- **Error 404:** Si el instalación no existe o el usuario no tiene permisos, mostrar pantalla de error amigable.

---

## Types & Type Safety

**Tipos a usar:**

- Tipo `Instalación` del esquema generado.
- Schema de Zod extendido para incluir el ID del registro.

---

## Content Writing

- **Título:** "Editar Detalles del Instalación"
- **CTA:** "Guardar Cambios"
- **Éxito:** "Información actualizada correctamente."

---

## Implementation Steps

### **Step 1: Ruta Dinámica y Fetching**

**Task:** Crear la página de edición y obtener los datos por ID.
**Details:**

- Validar que el ID sea un UUID válido antes de llamar a Supabase.
  **Testing:** Intentar acceder a un ID inexistente y verificar que el sistema maneje el error.

### **Step 2: Lógica de Pre-carga**

**Task:** Pasar los datos obtenidos al componente `JobForm`.
**Testing:** Verificar que al abrir la página, todos los campos (cliente, fecha, hora) muestren los valores correctos.

### **Step 3: Mutación de Datos**

**Task:** Implementar la llamada a `update` de Supabase.
**Testing:** Editar la ubicación y verificar que el cambio persista tras refrescar la página.

---

## Dependencies

- [x] STORY-SOL-23 (Formulario Base).
- [x] EPIC-SOL-10 (Auth).

---

## Estimated Effort

- **Total:** 3 Story Points (Reducido por reutilización).
