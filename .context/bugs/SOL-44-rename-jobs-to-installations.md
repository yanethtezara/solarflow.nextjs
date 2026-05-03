# Bug/Mejora: SOL-44 - Cambio de Terminología (Trabajos -> Mis instalaciones)

**Estado:** 🔴 Abierto
**Prioridad:** Baja
**Tipo:** UX / Branding

## Descripción

Para alinear la aplicación con el lenguaje específico del sector de energía solar, se ha decidido renombrar el módulo de "Trabajos" a "Mis instalaciones". Este cambio debe reflejarse tanto en el menú lateral como en las tarjetas de acceso rápido del dashboard.

## Pasos para Reproducir

1. Entrar al Dashboard.
2. Observar el menú lateral y las tarjetas de la Home.
3. Verificar que aparece el texto "Trabajos".

## Comportamiento Esperado

El texto debe ser "Mis instalaciones" en lugar de "Trabajos" o "Mis trabajos".

## Solución Propuesta

1. Modificar el array `navLinks` en `DashboardShell.tsx`.
2. Modificar el título de la tarjeta en `app/dashboard/page.tsx`.
3. Revisar encabezados de página en `app/dashboard/trabajos/page.tsx`.

## Criterios de Aceptación

- El menú lateral muestra "Mis instalaciones".
- La tarjeta del dashboard muestra "Mis instalaciones".
- El cambio es consistente en toda la interfaz principal.
