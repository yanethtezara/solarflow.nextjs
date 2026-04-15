# Implementation Plan: STORY-SOL-11 - Registro de Usuario (Email/Password)

## Overview

Implementar la funcionalidad de registro para nuevos instaladores, permitiéndoles crear una cuenta segura en SolarFlow usando su correo electrónico y una contraseña.

**Acceptance Criteria a cumplir:**

- Registro exitoso con email válido y contraseña segura (mín. 6 caracteres).
- Manejo de error si el email ya existe en el sistema.
- Validación de campos obligatorios y formato de email en el cliente.
- Redirección automática al Dashboard tras el registro exitoso (Auto-login).
- Mensaje de bienvenida "¡Bienvenido a SolarFlow!".

---

## Technical Approach

**Chosen approach:** Utilizar `supabase.auth.signUp()` a través de la librería `@supabase/ssr` para manejar la creación del usuario. Implementar validación en el cliente usando **Zod** y **React Hook Form** (si está disponible, sino nativo con estados) para una UX fluida.

**Why this approach:**

- ✅ **Seguridad Nativa:** Supabase maneja el hashing de contraseñas y la seguridad de los tokens JWT de forma profesional.
- ✅ **Simplicidad:** Se integra perfectamente con el middleware de Next.js ya configurado en el proyecto.
- ✅ **Rapidez:** Permite el auto-login tras el registro mediante la configuración de Supabase.

---

## UI/UX Design

### Componentes a usar:

- **`RegistrationForm`**: Componente de servidor/cliente que contendrá los campos de entrada.
- **`Input`**: Campo de texto reutilizable para email y contraseña.
- **`Button`**: Botón de acción con estado de "Loading".
- **`Toast` / `Alert`**: Para mensajes de éxito o error.

### Wireframes/Layout:

```
┌──────────────────────────────────────┐
│          Logo SolarFlow              │
├──────────────────────────────────────┤
│        ¡Crea tu oficina!             │
│                                      │
│  [ Email ]                           │
│  [ Contraseña ]                      │
│                                      │
│  [ [ Crear Cuenta ] ]                │
├──────────────────────────────────────┤
│  ¿Ya tienes cuenta? Inicia Sesión    │
└──────────────────────────────────────┘
```

### Estados de UI:

- **Loading:** Deshabilitar botón y mostrar spinner durante la llamada a Supabase.
- **Error:** Resaltar campos con borde rojo y mostrar mensaje debajo del input.
- **Success:** Redirección inmediata a `/dashboard`.

---

## Types & Type Safety

**Tipos a usar:**

- `User` de `@supabase/supabase-js`.
- Schema de Zod para la validación:
  ```typescript
  const signupSchema = z.object({
    email: z.string().email('Formato de email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
  });
  ```

---

## Content Writing

**Tono:** Profesional y alentador.

- **Título:** "Únete a SolarFlow"
- **Subtítulo:** "Tu oficina de bolsillo para instalaciones solares."
- **Botón:** "Crear mi cuenta"
- **Éxito:** "¡Bienvenido a SolarFlow! Tu cuenta ha sido creada."

---

## Implementation Steps

### **Step 1: Setup de Rutas y Middleware**

**Task:** Asegurar que la ruta `/signup` sea pública y el middleware permita el flujo de auth.
**Testing:** Acceder a `/signup` sin estar logueado.

### **Step 2: Creación del Formulario de Registro**

**Task:** Implementar `app/signup/page.tsx` y el componente de formulario.
**Details:**

- Usar Tailwind para diseño mobile-first.
- Integrar Zod para validaciones en tiempo real.
  **Testing:** Intentar enviar el formulario vacío y verificar que aparezcan los errores.

### **Step 3: Integración con Supabase Auth**

**Task:** Conectar el submit del formulario con `supabase.auth.signUp()`.
**Details:**

- Configurar el cliente de Supabase para cliente (`createBrowserClient`).
- Manejar la respuesta: redirección en éxito, mostrar error si el email existe.
  **Testing:** Registrar un usuario nuevo y verificar su creación en la tabla `auth.users` de Supabase.

---

## Dependencies

- [x] Configuración de Supabase (URL y API Key en `.env`).
- [x] Middleware de Auth configurado (Fase 3).

---

## Risks & Mitigations

- **Riesgo:** Fallo en el envío de datos por red intermitente.
- **Mitigación:** Implementar estados de carga y manejo de errores `try/catch` con reintentos manuales.

---

## Estimated Effort

- **Total:** 3 Story Points (~1 día de desarrollo).
