# Smoke Test: STORY-SOL-11-user-signup-email - Registrarme con email y contraseña

**Staging URL:** https://solarflow-nextjs-staging.vercel.app (asumiendo patrón de naming)
**Fecha:** 2026-04-14
**QA:** AI-Assigned (Gemini CLI)
**Duración Estimada:** 5-10 minutos

---

## ✅ Checklist

### 1. Acceso Básico

- [ ] **Aplicación carga sin errores 500**
  - Navegar a `/signup`
  - La página debe mostrar el formulario de registro correctamente.
- [ ] **No hay errores en console (F12)**
  - Verificar que no existan errores críticos de JS al cargar la página.
- [ ] **Assets cargan correctamente**
  - Estilos de Tailwind y logo de SunLogo visibles.

### 2. Autenticación (Pre-validación)

- [ ] **Campos de entrada operativos**
  - El campo de email acepta texto.
  - El campo de contraseña oculta los caracteres.
- [ ] **Botón "Crear Cuenta" visible**
  - El botón está habilitado y es clickeable.

### 3. Happy Path de Story

- [ ] **Paso 1: Completar formulario**
  - Ingresar un email nuevo y contraseña válida (mín. 8 caracteres, 1 mayúscula, 1 número).
- [ ] **Paso 2: Envío de formulario**
  - Al hacer clic en "Crear Cuenta", el sistema debe procesar la solicitud.
- [ ] **Paso 3: Redirección al Dashboard**
  - El usuario debe ser redirigido a `/dashboard` tras el éxito.

### 4. Integración Backend

- [ ] **API call exitosa**
  - Verificar en Network tab que la llamada a Supabase Auth retorna 200/201.
- [ ] **Persistencia en DB**
  - El usuario debe aparecer en la tabla de `auth.users` (validar vía Supabase si es posible).

---

## ✅ Resultado

- [ ] **PASSED:** Deployment funcional, continuar con exploratory testing.
- [ ] **FAILED:** Deployment roto, reportar bug crítico.
