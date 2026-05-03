# Bug: SOL-48 - Imposibilidad de eliminar ítems de una instalación

**Estado:** 🔴 Abierto
**Prioridad:** Alta
**Tipo:** Funcionalidad / Seguridad (RLS)

## Descripción

Los usuarios no pueden eliminar materiales o servicios una vez agregados a una instalación. Al hacer clic en el botón de eliminar y confirmar la acción, el ítem permanece en la lista.

## Pasos para Reproducir

1. Entrar al detalle de una instalación que tenga ítems.
2. Hacer clic en el icono de papelera (rojo) de un ítem.
3. Confirmar la eliminación en el diálogo emergente.
4. Observar que el ítem no desaparece y la lista se refresca sin cambios.

## Análisis Técnico

- El API Route `DELETE /api/trabajos/[id]/items/[itemId]` se ejecuta correctamente.
- La tabla `trabajos_items` es una tabla asociativa que no contiene directamente la columna `user_id`.
- **Causa probable:** Falta de políticas RLS en la tabla `trabajos_items` que permitan el borrado mediante una comprobación cruzada (JOIN) con la tabla `trabajos` para verificar la propiedad.

## Solución Propuesta

Implementar una política de seguridad en Supabase para la tabla `trabajos_items`:
`CREATE POLICY "Users can delete own job items" ON public.trabajos_items FOR DELETE USING (EXISTS (SELECT 1 FROM public.trabajos WHERE id = trabajo_id AND user_id = auth.uid()));`

## Criterios de Aceptación

- Un usuario puede eliminar cualquier ítem de una instalación que le pertenezca.
- Un usuario no puede eliminar ítems de instalaciones de otros usuarios.
