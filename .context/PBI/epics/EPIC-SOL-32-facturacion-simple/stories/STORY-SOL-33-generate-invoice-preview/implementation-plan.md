# Implementation Plan: STORY-SOL-33 - Generación de Vista Previa de Factura

## Overview

Implementar la lógica para ensamblar todos los datos de un instalación completado (materiales, mano de obra, cliente) y mostrarlos en una interfaz de factura profesional antes de su exportación.

**Acceptance Criteria a cumplir:**

- Botón "Generar Factura" visible solo en instalaciones con estado "Completado".
- Calcular automáticamente el total sumando (cantidad \* precio_snapshot).
- Mostrar desglose detallado de ítems.
- Precios incluyen IVA por defecto.
- Numeración automática correlativa (INV-XXX).

---

## Technical Approach

**Chosen approach:** Crear un endpoint de agregación `/api/facturas/[jobId]` que realice un join entre `instalaciones`, `trabajos_items`, `clientes` y `profiles`. La vista previa se renderizará en una ruta dedicada `/dashboard/instalaciones/[id]/factura`. Utilizaremos un componente `InvoiceTemplate` que servirá tanto para la vista web como para la base de la generación del PDF (SOL-35).

**Why this approach:**

- ✅ **Integridad:** Al leer de `trabajos_items`, aseguramos que los precios mostrados sean los pactados originalmente (snapshots).
- ✅ **Centralización:** Los cálculos matemáticos ocurren en el servidor (o en un hook centralizado) para evitar errores de redondeo en el cliente.
- ✅ **UX Profesional:** El usuario puede validar toda la información antes de enviar el documento al cliente.

---

## UI/UX Design

### Componentes a usar:

- **`InvoiceTemplate`**: Layout de factura con secciones de Emisor, Receptor, Tabla de Conceptos y Totales.
- **`CorrelativeBadge`**: Indicador del número de factura generado.

### wireframes/Layout:

```
┌──────────────────────────────────────┐
│ [←] Factura INV-001       [Descargar]│
├──────────────────────────────────────┤
│ SOLARFLOW SOLUTIONS                  │
│ NIF: B12345678                       │
├──────────────────────────────────────┤
│ CLIENTE: Juan Pérez                  │
├──────────────────────────────────────┤
│ Concepto       Cant.   Precio   Total│
│ Panel 450W      5      $200     $1000│
│ Instalación     1      $150     $150 │
├──────────────────────────────────────┤
│ TOTAL (IVA Inc.):           $1150.00 │
└──────────────────────────────────────┘
```

---

## Types & Type Safety

**Tipos a usar:**

- Interface `InvoiceData` que combine el Instalación, sus Items y el Cliente.
- Lógica de numeración: `INV-` + correlativo.

---

## Content Writing

- **Labels:** "Factura a nombre de", "Desglose de servicios y materiales".
- **Footer:** "Gracias por confiar en nuestros servicios solares."

---

## Implementation Steps

### **Step 1: Endpoint de Agregación de Datos**

**Task:** Crear la lógica de obtención de datos consolidados en Supabase.
**Testing:** Verificar que el objeto de respuesta contenga todos los ítems y los datos del cliente vinculados.

### **Step 2: Lógica de Numeración Correlativa**

**Task:** Implementar un contador (ej. en la tabla `profiles` o una tabla `facturas`) que se incremente al generar la primera vista.
**Testing:** Generar dos facturas seguidas y verificar que los números sean `001` y `002`.

### **Step 3: Componente InvoiceTemplate**

**Task:** Crear la UI de la factura usando Tailwind con estilos de impresión (@media print).
**Testing:** Verificar que los totales calculados en la UI coincidan exactamente con la suma de los subtotales de la tabla.

---

## Dependencies

- [x] STORY-27 (Instalación Completado).
- [x] STORY-26 (Items con Snapshots).

---

## Estimated Effort

- **Total:** 5 Story Points.
