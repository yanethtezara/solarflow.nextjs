# Bug: SOL-41 - Orden Jerárquico en el Menú (Empresas antes que Clientes)

**Estado:** 🔴 Abierto
**Prioridad:** Media
**Tipo:** UX / Regla de Negocio

## Descripción

El orden actual del menú de navegación no refleja la jerarquía lógica del negocio. Dado que las empresas son las entidades que agrupan o definen el contexto de operación principal, deben aparecer antes que los clientes individuales en el menú lateral o de gestión.

## Pasos para Reproducir

1. Entrar al Dashboard.
2. Observar el menú lateral.
3. Verificar que "Clientes" aparece antes que "Empresas".

## Comportamiento Esperado

El menú debe seguir el orden:

1. Dashboard (General)
2. Empresas
3. Clientes
4. ... (otros módulos)

## Solución Propuesta

Reordenar los elementos de navegación en el componente de menú correspondiente para priorizar la visibilidad de "Empresas" sobre "Clientes".

## Criterios de Aceptación

- El enlace a "Empresas" aparece físicamente por encima de "Clientes" en el menú.
- La navegación es coherente con el flujo de trabajo donde primero se define la empresa y luego sus clientes asociados.
