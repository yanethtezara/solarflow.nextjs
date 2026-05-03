# Bug/Mejora: SOL-46 - Cambio de Moneda (EUR -> USD)

**Estado:** 🔴 Abierto
**Prioridad:** Media
**Tipo:** Requerimiento de Negocio / Localización

## Descripción

El sistema utiliza actualmente el Euro (€) como moneda predeterminada para precios, costos y facturación. Se requiere cambiar la moneda oficial a Dólares Estadounidenses ($) para alinearse con el mercado objetivo.

## Pasos para Reproducir

1. Navegar al Catálogo.
2. Navegar a la sección de Instalaciones.
3. Generar una factura.
4. Observar que los precios se muestran con el símbolo € o la denominación EUR.

## Comportamiento Esperado

Todos los valores monetarios deben mostrarse con el símbolo $ y utilizar el formato de moneda USD.

## Solución Propuesta

1. Reemplazar todas las instancias de `currency: 'EUR'` por `currency: 'USD'` en las funciones de formateo (`toLocaleString`).
2. Actualizar los símbolos `€` estáticos en componentes de React por `$`.
3. Actualizar etiquetas de formularios (ej. `Precio (€)` -> `Precio ($)`).

## Criterios de Aceptación

- Las facturas muestran el símbolo $ y el total en USD.
- El catálogo muestra los precios en $.
- No quedan referencias visuales al Euro en la interfaz de usuario.
