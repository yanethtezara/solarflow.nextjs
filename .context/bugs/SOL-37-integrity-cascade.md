# Bug Report: SOL-37

**Status:** ✅ FIXED
**Severity:** High
**Epic:** SOL-15 (Gestión de Entidades)

---

## _RESUMEN_

El sistema permitía eliminar un cliente que poseía trabajos de instalación asociados, violando las reglas de negocio de integridad referencial. Debido a una regla `CASCADE` en la base de datos, los trabajos asociados se eliminaban automáticamente de forma silenciosa al borrar un cliente.

---

## _STEPS TO REPRODUCE_

1. Crear un cliente nuevo.
2. Crear un trabajo asociado a dicho cliente.
3. Intentar eliminar el cliente desde la base de datos o API.

---

## _TECHNICAL ANALYSIS_

- **Causa Raíz:** La restricción de llave foránea `trabajos_cliente_id_fkey` en la tabla `trabajos` tenía configurada la regla `ON DELETE CASCADE`.
- **Consecuencia:** Borrado accidental de registros históricos de trabajos.

---

## _SOLUTION_

Se modificó el esquema de la base de datos para endurecer la integridad referencial:

1. Se eliminó la restricción `CASCADE` existente.
2. Se aplicó `ON DELETE RESTRICT` tanto para `cliente_id` como para `empresa_id` en la tabla `trabajos`.
3. Archivo de migración creado: `supabase/migrations/20260418_fix_entity_integrity_restrict.sql`.

---

## _VALIDATION_

- **Prueba:** Se ejecutó el script `scripts/verify-integrity-defect.ts`.
- **Resultado:** El motor de base de datos ahora bloquea el borrado lanzando el error: `update or delete on table "clientes" violates foreign key constraint`.
