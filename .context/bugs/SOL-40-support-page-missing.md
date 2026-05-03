# Bug: SOL-40 - Enlace de Soporte sin Destino

**Estado:** 🔴 Abierto (Pendiente de Corrección)
**Prioridad:** Baja
**Tipo:** Funcionalidad Faltante / Experiencia de Usuario

## Descripción

En la página de inicio de sesión (y potencialmente en el footer global), el enlace "Contacta con soporte" no tiene un destino válido (`href="#"`), lo que genera una mala experiencia de usuario al no proporcionar ayuda técnica.

## Pasos para Reproducir

1. Navegar a la página de login (`/login`).
2. Desplazarse hasta el final de la tarjeta de inicio de sesión.
3. Hacer clic en "Contacta con soporte".
4. Observar que no ocurre nada (o la página vuelve al inicio).

## Comportamiento Esperado

El enlace debe redirigir a una página informativa que indique que el servicio de soporte está en construcción o proporcionar medios de contacto alternativos.

## Solución Propuesta

1. Crear una nueva ruta `/support`.
2. Implementar una página sencilla con el mensaje "Página en construcción".
3. Actualizar todos los enlaces que deberían apuntar a soporte para que usen `/support`.

## Criterios de Aceptación

- Al hacer clic en "Contacta con soporte", el usuario llega a `/support`.
- La página `/support` es visualmente coherente con el resto de la aplicación.
- No hay enlaces rotos relacionados con soporte.
