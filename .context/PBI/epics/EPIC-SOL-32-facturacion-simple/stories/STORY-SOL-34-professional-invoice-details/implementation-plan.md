# Implementation Plan: STORY-SOL-34 - Personalización de Factura

## Overview

Asegurar que las facturas generadas proyecten una imagen profesional del instalador, incluyendo su logo, datos fiscales (NIF) y los datos completos del cliente.

**Acceptance Criteria a cumplir:**

- Incluir Logo del negocio en la cabecera de la factura.
- Mostrar datos fiscales del emisor (Instalador) obtenidos de su perfil.
- Mostrar datos completos del receptor (Cliente).
- Snapshot de Perfil: Guardar "foto" de los datos del emisor al momento de facturar.
- Soporte para nombres largos y direcciones en el layout.

---

## Technical Approach

**Chosen approach:** Implementar la tabla `user_profiles` para almacenar Nombre del Negocio, NIF, Dirección Fiscal y URL del Logo. Utilizaremos **Supabase Storage** para gestionar el archivo de imagen. Al generar la factura, los datos del perfil se copiarán a una tabla de `facturas_emitidas` (o se incluirán en el snapshot del trabajo) para asegurar que el documento no cambie si el usuario edita su perfil después.

**Why this approach:**

- ✅ **Legalidad:** Una factura emitida debe ser inalterable. El snapshot de perfil garantiza esto.
- ✅ **Flexibilidad:** Permite al usuario cambiar su branding para futuros trabajos sin romper el histórico.
- ✅ **Escalabilidad:** El uso de Storage gestiona eficientemente los activos binarios (imágenes).

---

## UI/UX Design

### Componentes a usar:

- **`ImageUploader`**: Componente en el perfil para subir y previsualizar el logo.
- **`InvoiceBranding`**: Sub-componente de la factura que renderiza el logo y NIF.

### wireframes/Layout:

```
┌──────────────────────────────────────┐
│  [ LOGO ]          Nro: INV-001      │
│                    Fecha: 20/05/2026 │
├──────────────────────────────────────┤
│ EMISOR:            RECEPTOR:         │
│ Mi Negocio Solar   Juan Pérez        │
│ NIF: B12345678     Calle Falsa 123   │
└──────────────────────────────────────┘
```

---

## Types & Type Safety

**Tipos a usar:**

- Tipo `UserProfile` vinculado a `auth.users`.
- Extendiendo `InvoiceData` para incluir los campos del perfil snapshot.

---

## Content Writing

- **Labels Perfil:** "NIF / CIF / ID Fiscal", "Nombre Comercial", "Logo de Empresa".
- **Empty Logo:** Si no hay logo, usar tipografía Bold elegante con el nombre del negocio.

---

## Implementation Steps

### **Step 1: Tabla de Perfil y Bucket de Storage**

**Task:** Crear la tabla `profiles` y el bucket `logos` con permisos públicos de lectura.
**Details:**

- RLS Policy para Storage: `(storage.foldername(name))[1] = auth.uid()::text`.
  **Testing:** Subir una imagen desde el cliente y verificar que la URL pública sea accesible.

### **Step 2: Formulario de Configuración de Perfil**

**Task:** Crear la página `/dashboard/perfil` para que el instalador llene sus datos.
**Testing:** Validar que los campos se guarden correctamente en la DB.

### **Step 3: Lógica de Snapshot en Factura**

**Task:** Al generar la vista previa, capturar los datos actuales del perfil.
**Testing:**

1. Generar factura.
2. Cambiar nombre del negocio en Perfil.
3. Verificar que la factura antigua mantenga el nombre anterior.

---

## Dependencies

- [x] STORY-33 (Vista Previa Base).
- [x] Supabase Storage habilitado.

---

## Estimated Effort

- **Total:** 4 Story Points (Incluye gestión de archivos).
