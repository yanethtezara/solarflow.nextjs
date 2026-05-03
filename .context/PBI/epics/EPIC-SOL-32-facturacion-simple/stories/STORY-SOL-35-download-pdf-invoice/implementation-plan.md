# Implementation Plan: STORY-SOL-35 - Descarga de Factura en PDF

## Overview

Implementar la capacidad de exportar la vista previa de la factura a un archivo PDF estático, permitiendo al instalador enviar el documento formal por medios externos (WhatsApp, Email).

**Acceptance Criteria a cumplir:**

- Generar archivo PDF fiel a la vista previa (WYSIWYG).
- Nombre de archivo automático: `Factura_SOL-[ID]_[Cliente].pdf`.
- El PDF debe incluir texto seleccionable y logo de alta calidad.
- Descarga directa al dispositivo sin pasos intermedios.
- Soporte para caracteres especiales (tildes, ñ) y layout responsive.

---

## Technical Approach

**Chosen approach:** Utilizar la librería **`jsPDF`** junto con **`html2canvas`** (o `react-to-pdf`) para capturar el componente `InvoiceTemplate` y transformarlo en un documento binario en el cliente. Esta aproximación evita sobrecargar el servidor con procesos de renderizado de PDF y permite una descarga instantánea.

**Why this approach:**

- ✅ **Velocidad:** La generación en el cliente es casi inmediata.
- ✅ **Offline-ready:** Funciona incluso con latencia alta una vez cargada la página.
- ✅ **Fidelidad:** Captura exactamente lo que el usuario ve en pantalla (CSS @media print).

---

## UI/UX Design

### Componentes a usar:

- **`DownloadPDFButton`**: Botón con ícono de archivo y estado de "Generando...".
- **`SuccessNotification`**: Aviso temporal tras iniciar la descarga.

### Estados de UI:

- **Generando:** Mostrar un spinner o barra de progreso dentro del botón mientras se procesa el canvas.
- **Error:** "No se pudo generar el PDF. Por favor, intenta usar la función de impresión del sistema."

---

## Types & Type Safety

**Tipos a usar:**

- Interfaces de la librería `jsPDF`.
- Helpers para limpieza de nombres de archivo (reemplazo de espacios por guiones).

---

## Content Writing

- **Label Botón:** "Descargar Factura (PDF)"
- **Título de ventana:** "Generando documento..."

---

## Implementation Steps

### **Step 1: Integración de Librería de Exportación**

**Task:** Instalar y configurar `jsPDF` y `html2canvas`.
**Testing:** Verificar que la librería cargue correctamente en el bundle de producción sin aumentar excesivamente el peso.

### **Step 2: Lógica de Captura de Template**

**Task:** Implementar la función `generatePDF` que apunte a la referencia del DOM del componente `InvoiceTemplate`.
**Testing:** Generar un PDF de prueba y verificar que los bordes y el logo no se corten.

### **Step 3: Formateo de Nombre de Archivo**

**Task:** Implementar lógica para limpiar el nombre del cliente y concatenar el ID del instalación.
**Testing:** Para el cliente "Peña & Hnos", el archivo debe llamarse `Factura_SOL-45_Pena-Hnos.pdf`.

### **Step 4: Soporte Mobile**

**Task:** Validar el trigger de descarga en navegadores móviles (Safari iOS y Chrome Android).
**Testing:** Abrir el PDF en un smartphone y verificar que sea legible y escalable.

---

## Dependencies

- [x] STORY-33 (Vista Previa).
- [x] STORY-34 (Branding).

---

## Estimated Effort

- **Total:** 5 Story Points (Complejidad alta por ajustes de layout y fuentes).
