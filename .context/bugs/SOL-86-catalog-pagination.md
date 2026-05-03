# Story Report: SOL-86

**Status:** 🏗️ IN PROGRESS
**Severity:** Medium
**Epic:** SOL-18 (Catálogo de Servicios y Materiales)
**Jira:** [SOL-86](https://yanethtezara.atlassian.net/browse/SOL-86)

---

## _RESUMEN_

La vista de catálogo cargaba todos los ítems simultáneamente, lo que afectaba el rendimiento a medida que el catálogo crecía (actualmente +240 ítems). Se requiere implementar una paginación de 15 ítems por página para optimizar la carga y mejorar la experiencia de usuario.

---

## _TECHNICAL CHANGES_

### 1. API (`app/api/catalogo-items/route.ts`)

- Añadir soporte para parámetros `page` y `limit`.
- Usar `count: 'exact'` en la consulta de Supabase para obtener el total de registros.
- Retornar tanto los datos como el `totalCount`.

### 2. Frontend (`app/dashboard/catalogo/CatalogoList.tsx`)

- Añadir estado para `currentPage`.
- Implementar controles de navegación.
- Actualizar el fetch para enviar los parámetros de paginación.

---

## _IMPLEMENTATION PLAN_

1. Modificar el endpoint de la API.
2. Actualizar el componente CatalogoList con la lógica de paginación.
3. Verificar funcionamiento en Staging.
