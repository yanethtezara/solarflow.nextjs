# Smoke Test: EPIC-SOL-22 - Gestión de Trabajos de Instalación

**Staging URL:** https://solarflow-nextjs-staging.vercel.app/dashboard/trabajos
**Fecha:** 2026-04-14
**QA:** AI-Assigned (Gemini CLI)

---

## ✅ Checklist

### 1. Acceso Básico

- [ ] **Dashboard de Trabajos carga correctamente**
  - Navegar a `/dashboard/trabajos`.
  - Debe mostrar la lista de trabajos programados.

### 2. Funcionalidad Core (Happy Path)

- [ ] **Botón "Crear Trabajo" funcional**
  - Abre el formulario de nuevo trabajo.
- [ ] **Detalle de Trabajo**
  - Hacer clic en un trabajo existente abre la vista de detalle `/dashboard/trabajos/[id]`.

### 3. Integración Backend

- [ ] **Persistencia de Estados**
  - El selector de estado (pendiente, en curso, completado) actualiza correctamente en DB.

---

## ✅ Resultado

- [ ] **PASSED**
- [ ] **FAILED**
