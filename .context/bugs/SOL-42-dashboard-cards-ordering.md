# Bug: SOL-42 - Orden de Tarjetas en Home del Dashboard (Empresas antes que Clientes)

**Estado:** 🔴 Abierto
**Prioridad:** Media
**Tipo:** UX / Jerarquía de Información

## Descripción

Al igual que en el menú lateral (corregido en SOL-41), las tarjetas de acceso rápido en la página principal del Dashboard (`/dashboard`) muestran a los "Clientes" antes que a las "Empresas". Esto rompe la consistencia jerárquica donde la empresa es la entidad de nivel superior en el contexto de gestión B2B de SolarFlow.

## Pasos para Reproducir

1. Iniciar sesión y entrar al Dashboard (`/dashboard`).
2. Observar el grid de tarjetas de acceso rápido.
3. Verificar que la tarjeta de "Clientes" aparece a la izquierda (o arriba en móvil) de la tarjeta de "Empresas".

## Comportamiento Esperado

El orden de las tarjetas debe ser:

1. Empresas
2. Clientes
3. Trabajos
4. Catálogo

## Solución Propuesta

Reordenar los componentes `<Link>` en el grid de `app/dashboard/page.tsx`.

## Criterios de Aceptación

- La tarjeta de "Empresas" aparece primero en el flujo visual del dashboard.
- El orden es consistente con el menú lateral de navegación.
