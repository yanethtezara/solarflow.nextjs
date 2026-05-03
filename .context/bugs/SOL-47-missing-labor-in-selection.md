# Bug: SOL-47 - Selección incompleta en ítems de instalación

**Estado:** 🔴 Abierto
**Prioridad:** Alta
**Tipo:** Funcionalidad / UX

## Descripción

Los usuarios informan que al intentar agregar ítems a una instalación, solo ven materiales y no pueden seleccionar "Mano de obra". El sistema debe permitir la selección de ambos tipos de ítems (materiales y servicios) para calcular el total de la factura correctamente.

## Pasos para Reproducir

1. Entrar al detalle de una instalación.
2. Desplazarse al formulario "Agregar ítem".
3. Desplegar la lista de ítems disponibles.
4. Verificar si aparecen los ítems de tipo 'mano_de_obra'.

## Análisis Técnico

- La API `/api/catalogo-items` soporta ambos tipos.
- El componente `AddItemToJobForm` solicita todos los ítems.
- **Hipótesis:** Es posible que el usuario no tenga ítems de tipo 'mano_de_obra' creados en su catálogo personal debido al aislamiento multi-tenant.

## Solución Propuesta

1. Mejorar el selector visual para diferenciar claramente entre Material y Mano de obra.
2. Añadir un mensaje informativo si el catálogo del usuario no tiene ítems de un tipo específico.
3. Verificar la integridad de los datos cargados masivamente.

## Criterios de Aceptación

- Un usuario con ítems de ambos tipos en su catálogo puede verlos y seleccionarlos en el formulario de la instalación.
- La distinción entre Material y Mano de obra es clara en el dropdown.
