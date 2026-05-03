# Implementation Plan: STORY-SOL-14 - Cierre de Sesión Seguro

## Overview

Implementar la funcionalidad para que el usuario pueda finalizar su sesión de forma segura, garantizando la eliminación de tokens y datos sensibles del dispositivo.

**Acceptance Criteria a cumplir:**

- Invalida la sesión del usuario tanto en el cliente como en el servidor (Supabase).
- Limpieza total de LocalStorage y caché del navegador.
- Redirección automática a la página de login.
- El botón de logout es visible en el Sidebar/Header.
- Muestra mensaje de confirmación "Sesión cerrada con éxito".

---

## Technical Approach

**Chosen approach:** Utilizar `supabase.auth.signOut()` para invalidar la sesión en el servidor. Implementar un método de limpieza manual en el `AuthContext` para purgar el `localStorage` y resetear el estado global de React. La redirección se manejará mediante el `useRouter` de Next.js.

**Why this approach:**

- ✅ **Seguridad Total:** Evita que el siguiente usuario del mismo dispositivo pueda ver datos cacheados.
- ✅ **Simplicidad:** Supabase maneja la invalidación del JWT de forma transparente.
- ✅ **Experiencia de Usuario:** El feedback visual confirma al usuario que la operación fue exitosa.

---

## UI/UX Design

### Componentes a usar:

- **`LogoutButton`**: Ubicado en el Sidebar (Mobile y Desktop) para visibilidad permanente.
- **`ConfirmationToast`**: Alerta temporal tras la redirección.

### Wireframes/Layout:

El botón se ubicará en la parte inferior del Sidebar:

```
┌─────────────────┐
│ [Dashboard]     │
│ [Clientes]      │
│ [Instalaciones]      │
│                 │
│ [ Cerrar Sesión]│
└─────────────────┘
```

---

## Types & Type Safety

**Tipos a usar:**

- N/A (Operación de acción sin retorno de datos complejos).

---

## Content Writing

- **Etiqueta:** "Cerrar Sesión"
- **Éxito:** "Has cerrado sesión correctamente. ¡Vuelve pronto!"

---

## Implementation Steps

### **Step 1: Botón de Logout en Sidebar**

**Task:** Añadir el componente de logout a la navegación principal.
**Details:**

- Usar Tailwind para un estilo de "Peligro sutil" (ej. texto rojo suave o ícono de salida).
  **Testing:** Verificar que el botón sea visible en todas las resoluciones.

### **Step 2: Lógica de Cierre en AuthContext**

**Task:** Implementar la función `handleLogout`.
**Details:**

- Ejecutar `supabase.auth.signOut()`.
- Ejecutar `localStorage.clear()`.
- Redirigir a `/login`.
  **Testing:** Tras hacer clic, verificar que el token `sb-access-token` desaparezca de las cookies/storage.

### **Step 3: Validación de Protección de Rutas**

**Task:** Asegurar que el Middleware bloquee el regreso al Dashboard mediante el botón "Atrás" del navegador.
**Testing:** Hacer logout -> intentar volver atrás -> verificar que el sistema redirija de nuevo al login.

---

## Dependencies

- [x] `AuthContext` y `AuthMiddleware` configurados.

---

## Risks & Mitigations

- **Riesgo:** Fallo de red al intentar desloguear del servidor.
- **Mitigación:** Priorizar la limpieza del cliente. Si la llamada al servidor falla, limpiar el LocalStorage de todos modos para que el usuario no pueda seguir navegando.

---

## Estimated Effort

- **Total:** 1 Story Point.
