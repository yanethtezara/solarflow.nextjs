# Bug Report: SOL-83 (Legacy SOL-56)

**Status:** ✅ FIXED
**Severity:** Low
**Epic:** SOL-28 (Planificación y Visualización)
**Jira:** [SOL-83](https://yanethtezara.atlassian.net/browse/SOL-83)

---

## _RESUMEN_

Inconsistencia en la terminología del sistema. La vista de calendario utiliza el término "Trabajos" en el título principal, cuando la terminología oficial del proyecto ha sido actualizada a "Instalaciones" (según SOL-44 y SOL-45).

---

## _STEPS TO REPRODUCE_

1. Iniciar sesión en la plataforma.
2. Navegar a la sección "Calendario" desde el menú lateral.
3. Observar el título de la página en la parte superior.

---

## _TECHNICAL ANALYSIS_

- **Archivo afectado:** `app/dashboard/calendario/page.tsx`
- **Línea:** 49
- **Causa:** Hardcodeo del título con terminología antigua.

---

## _EXPECTED BEHAVIOR_

El título debe decir: **"CALENDARIO DE INSTALACIONES"**.

---

## _SOLUTION PLAN_

1. Modificar el componente en `app/dashboard/calendario/page.tsx`.
2. Actualizar el texto del tag `<h1>`.
