# Feature Test Plan: EPIC-SOL-32 - Facturación Simple

**Fecha:** 2026-04-05
**QA Lead:** AI-Generated (Gemini CLI)
**Epic Jira Key:** SOL-32
**Status:** Draft - Pending Team Review

---

## 📋 Business Context Analysis

### Business Value

La facturación es el cierre del ciclo de valor de SolarFlow. Permitir que un instalador genere un documento profesional en segundos no solo le ahorra tiempo administrativo, sino que acelera su flujo de caja y mejora su imagen ante empresas contratantes y clientes finales.

**Key Value Proposition:**

- **Agilidad:** De trabajo completado a factura en un clic.
- **Consistencia:** Cálculos automáticos basados en la data real del proyecto.

**Success Metrics (KPIs):**

- **Adopción:** > 70% de trabajos completados deben descargar al menos 1 PDF de factura.
- **Precisión:** Cero errores de redondeo reportados.

**User Impact:**

- **Javier Morales:** Envía la factura por email/WhatsApp inmediatamente tras terminar la obra.
- **David Rojas:** Centraliza la documentación de cobro de sus cuadrillas.

---

## 🏗️ Technical Architecture Analysis

### Architecture Components Involved

- **Frontend:** Next.js 15. Vista de impresión CSS-in-JS.
- **Backend:** API Route `/api/facturas/[id]` para agregación de datos.
- **Database:** Relación entre `trabajos`, `trabajos_items`, `clientes` y `user_profiles`.
- **Media:** Supabase Storage para logos.

### Integration Points

- **Data Aggregator:** Endpoint que consulta el estado del trabajo y une con la info fiscal del usuario.
- **PDF Export:** Librería cliente (ej. jsPDF) o servidor para generar el archivo estático.

---

## 🚨 Risk Analysis

### Technical Risks

1. **Fugacidad de Precios:** Si el catálogo cambia, la factura debe preservar lo que se guardó en el trabajo.
   - **Mitigación:** Uso estricto de la tabla de snapshots `trabajos_items`.
2. **Incompatibilidad de Fuentes en PDF:** Caracteres especiales o logos que no cargan.
   - **Mitigación:** Embed de fuentes y validación de URLs de Supabase Storage.

### Business Risks

1. **Facturas Inválidas:** Omisión de datos legales obligatorios (NIF).
   - **Mitigación:** Bloquear generación de factura si el perfil del usuario no está completo.

---

## 🎯 Test Strategy

### Test Levels

- **Unit Testing (Vitest):** Funciones de cálculo de subtotales y totales.
- **Integration Testing:** Validación de que la API de facturas solo permite acceso al dueño del trabajo.
- **E2E Testing (Playwright):** Proceso completo desde la marca de "Completado" hasta la obtención del archivo .pdf.

---

## 📊 Test Cases Summary by Story

### STORY-SOL-33: Vista Previa

**Complexity:** Medium | **Estimated Test Cases:** 6

- Cálculo automático, visibilidad del desglose, estado de error si el trabajo no está completado.

### STORY-SOL-34: Detalles Profesionales

**Complexity:** Medium | **Estimated Test Cases:** 5

- Carga de Logo, datos de emisor (perfil), datos de receptor (cliente).

### STORY-SOL-35: Descarga PDF

**Complexity:** Medium | **Estimated Test Cases:** 4

- Descarga exitosa, nombre de archivo dinámico, integridad visual del PDF vs UI.

---

## 🗂️ Test Data Requirements

- Trabajos con mezcla de servicios y materiales.
- Perfiles con datos fiscales completos.

---

## ✅ Entry/Exit Criteria

### Entry Criteria

- Épica de Trabajos (SOL-22) funcional.
- Tabla `user_profiles` creada.

### Exit Criteria

- PDF generado coincide visualmente con la previsualización.
- No hay desajustes en los montos facturados.

---

## 📢 Action Required

**@[Product Owner]:**

- ¿El número de factura será auto-incremental o libre?
- ¿Se requiere soporte para múltiples divisas?

**@[Dev Lead]:**

- Validar si el Middleware permite la descarga directa de archivos binarios (PDF).
- Confirmar si el logo se redimensionará en el servidor o cliente.

---

**Next Steps:**

- Generar `acceptance-test-plan.md` para SOL-33, 34 y 35.
- Definir template visual final.
