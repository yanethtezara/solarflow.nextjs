# Bug Report: SOL-38

**Status:** ✅ FIXED
**Severity:** Medium
**Epic:** SOL-18 (Catálogo de Servicios y Materiales)

---

## _RESUMEN_

El sistema permitía la creación de ítems en el catálogo (mano de obra y materiales) con precios o costos negativos, incumpliendo las reglas de negocio que exigen valores positivos.

---

## _STEPS TO REPRODUCE_

1. Navegar a la creación de un nuevo ítem de catálogo.
2. Ingresar un precio negativo (ej: -150.00).
3. Guardar el ítem.

---

## _TECHNICAL ANALYSIS_

- **Causa Raíz:** Falta de restricción `CHECK` en la tabla `catalogo_items` y validación insuficiente en el nivel de base de datos, permitiendo inserciones directas vía cliente de Supabase con valores negativos.

---

## _SOLUTION_

1. **DB:** Se agregó un `CONSTRAINT` de tipo `CHECK (precio >= 0)` en la tabla `catalogo_items`.
2. **Data Fix:** Se identificaron ítems con precios negativos en la base de datos y se resetearon a 0 antes de aplicar el constraint.
3. **API/UI:** Se verificaron y reforzaron las validaciones en `CatalogoForm.tsx` y en las API Routes correspondientes.
4. Archivo de migración creado: `supabase/migrations/20260418_fix_catalog_price_check.sql`.

---

## _VALIDATION_

- **Prueba:** Se ejecutó el script de integración `scripts/test-catalog-crud.ts`.
- **Resultado:** Cualquier intento de insertar un precio negativo ahora es rechazado por la base de datos.
