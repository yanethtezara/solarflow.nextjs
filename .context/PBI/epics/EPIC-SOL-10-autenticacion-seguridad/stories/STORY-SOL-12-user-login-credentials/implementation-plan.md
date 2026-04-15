# Implementation Plan: STORY-SOL-12 - Inicio de Sesión con Credenciales

## Overview

Implementar el flujo de autenticación para usuarios existentes, permitiendo a Javi y David acceder a sus paneles de control de forma segura.

**Acceptance Criteria a cumplir:**

- Inicio de sesión exitoso con credenciales válidas.
- Manejo de errores informativos para contraseñas incorrectas o emails no registrados.
- Sesión persistente (Keep me logged in) activada por defecto.
- Redirección automática al Dashboard tras el login exitoso.
- Protección de rutas privadas mediante Middleware.

---

## Technical Approach

**Chosen approach:** Utilizar `supabase.auth.signInWithPassword()` para la autenticación. Gestionar el estado de la sesión mediante el `AuthContext` ya definido en el proyecto. El middleware de Next.js se encargará de interceptar las peticiones a rutas protegidas (`/dashboard/*`) y redirigir al `/login` si no hay una sesión activa.

**Why this approach:**

- ✅ **Centralización:** El `AuthContext` permite que cualquier componente de la aplicación sepa si el usuario está autenticado.
- ✅ **Seguridad:** El middleware garantiza que la protección ocurra a nivel de servidor, evitando parpadeos de contenido protegido.
- ✅ **UX:** Se implementará una redirección inteligente (opcional para MVP, pero recomendada) para devolver al usuario a la página que intentaba visitar.

---

## UI/UX Design

### Componentes a usar:

- **`LoginForm`**: Formulario con campos de email y contraseña.
- **`PasswordInput`**: Campo de contraseña con opción de "Mostrar/Ocultar" (Sugerido para mejorar UX).
- **`Button`**: Botón de login con estados de carga.

### Estados de UI:

- **Loading:** Spinner en el botón de login mientras Supabase valida.
- **Error:** Alerta superior o mensaje bajo el campo indicando el fallo específico (clave o email).

---

## Types & Type Safety

**Tipos a usar:**

- `User` y `Session` de `@supabase/supabase-js`.
- Schema de Zod para validación:
  ```typescript
  const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
  });
  ```

---

## Content Writing

- **Título:** "Bienvenido de nuevo"
- **Subtítulo:** "Accede a tus instalaciones y clientes."
- **Botón:** "Entrar a mi oficina"
- **Error Email:** "No encontramos ninguna cuenta con ese correo."
- **Error Password:** "La contraseña es incorrecta. Inténtalo de nuevo."

---

## Implementation Steps

### **Step 1: Implementación del LoginForm**

**Task:** Crear la página `/login` y el componente de formulario.
**Details:**

- Aplicar estilos Tailwind coherentes con el Registro.
- Añadir enlace a "Olvidé mi contraseña" (SOL-13).
  **Testing:** Verificar que las validaciones de Zod impidan el envío de campos vacíos.

### **Step 2: Lógica de Autenticación**

**Task:** Integrar el formulario con el `AuthContext` y Supabase.
**Details:**

- Llamar a `signInWithPassword`.
- Actualizar el estado global del usuario tras el éxito.
  **Testing:** Realizar login con un usuario creado en el paso anterior (SOL-11) y verificar redirección a `/dashboard`.

### **Step 3: Protección de Rutas (Middleware)**

**Task:** Validar que el archivo de middleware proteja correctamente las rutas privadas.
**Testing:** Intentar acceder a `/dashboard` sin sesión activa y verificar redirección a `/login`.

---

## Dependencies

- [x] STORY-SOL-11 - Registro de Usuario (necesario para tener usuarios que probar).
- [x] Supabase Auth configurado.

---

## Risks & Mitigations

- **Riesgo:** Sesiones que expiran prematuramente.
- **Mitigación:** Asegurar que el middleware refresque el token JWT automáticamente usando `@supabase/ssr`.

---

## Estimated Effort

- **Total:** 2 Story Points (~medio día de desarrollo).
