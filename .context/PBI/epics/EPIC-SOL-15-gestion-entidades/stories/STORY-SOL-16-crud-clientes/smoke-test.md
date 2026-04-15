# Smoke Test: EPIC-SOL-15 - Gestión de Entidades (Clientes y Empresas)

**Staging URL:** https://solarflow-nextjs-staging.vercel.app/dashboard/clientes
**Fecha:** 2026-04-14
**QA:** AI-Assigned (Gemini CLI)

---

## ✅ Checklist

### 1. Acceso Básico

- [ ] **Página de Clientes carga correctamente**
  - Navegar a `/dashboard/clientes`.
  - Se debe visualizar la tabla o lista de clientes.
- [ ] **Página de Empresas carga correctamente**
  - Navegar a `/dashboard/empresas`.

### 2. Funcionalidad Core (Happy Path)

- [ ] **Apertura de Formulario de Creación**
  - Hacer clic en "Nuevo Cliente" o similar.
  - El modal o página de formulario debe abrirse sin errores.
- [ ] **Validación de Campos**
  - Los campos obligatorios (Nombre, etc.) están presentes.

### 3. Integración Backend

- [ ] **Listado de datos**
  - Se visualizan datos (o mensaje de "sin clientes") provenientes de la tabla `clientes`.

---

## ✅ Resultado

- [ ] **PASSED**
- [ ] **FAILED**
