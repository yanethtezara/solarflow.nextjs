# Smoke Test: EPIC-SOL-22 - Gestión de Instalaciones de Instalación

**Staging URL:** https://solarflow-nextjs-staging.vercel.app/dashboard/instalaciones
**Fecha:** 2026-04-14
**QA:** AI-Assigned (Gemini CLI)

---

## ✅ Checklist

### 1. Acceso Básico

- [ ] **Dashboard de Instalaciones carga correctamente**
  - Navegar a `/dashboard/instalaciones`.
  - Debe mostrar la lista de instalaciones programados.

### 2. Funcionalidad Core (Happy Path)

- [ ] **Botón "Crear Instalación" funcional**
  - Abre el formulario de nuevo instalación.
- [ ] **Detalle de Instalación**
  - Hacer clic en un instalación existente abre la vista de detalle `/dashboard/instalaciones/[id]`.

### 3. Integración Backend

- [ ] **Persistencia de Estados**
  - El selector de estado (pendiente, en curso, completado) actualiza correctamente en DB.

---

## ✅ Resultado

- [ ] **PASSED**
- [ ] **FAILED**
