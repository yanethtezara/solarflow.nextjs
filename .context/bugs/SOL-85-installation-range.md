# Story Report: SOL-85

**Status:** 🏗️ IN PROGRESS
**Severity:** High (Core Feature)
**Epic:** SOL-22 (Gestión de Instalaciones)
**Jira:** [SOL-85](https://yanethtezara.atlassian.net/browse/SOL-85)

---

## _RESUMEN_

Ampliación del modelo de datos de instalaciones para permitir rangos de tiempo complejos. Actualmente, una instalación solo tiene una fecha y hora única de inicio, lo que impide planificar trabajos que duren varios días o bloques horarios específicos.

---

## _TECHNICAL CHANGES_

### 1. Database (Supabase)

- Añadir columna `fecha_fin` (date) a la tabla `trabajos`.
- Añadir columna `hora_fin` (time) a la tabla `trabajos`.
- Mantener `fecha` y `hora` como puntos de inicio (renombrarlos semánticamente en la UI).

### 2. API Routes

- `app/api/trabajos/route.ts`: Actualizar GET y POST para manejar `fecha_fin` y `hora_fin`.
- `app/api/trabajos/[id]/route.ts`: Actualizar PUT para permitir la edición de estos campos.

### 3. Frontend

- **Formulario**: Añadir inputs para Fecha Fin y Hora Fin.
- **Validación**: Asegurar que Fecha/Hora Fin sea posterior a Inicio.
- **Calendario**: Modificar la lógica de renderizado para mostrar bloques extendidos.

---

## _IMPLEMENTATION PLAN_

1. Ejecutar migración SQL.
2. Actualizar tipos de TypeScript.
3. Modificar backend.
4. Modificar frontend (Formulario -> Lista -> Calendario).
