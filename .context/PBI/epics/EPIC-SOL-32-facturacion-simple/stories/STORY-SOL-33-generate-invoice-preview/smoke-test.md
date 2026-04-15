# Smoke Test: EPIC-SOL-32 - Facturación Simple

**Staging URL:** https://solarflow-nextjs-staging.vercel.app/dashboard/trabajos/[id]/factura
**Fecha:** 2026-04-14
**QA:** AI-Assigned (Gemini CLI)

---

## ✅ Checklist

### 1. Acceso Básico

- [ ] **Vista de Factura accesible**
  - Desde un trabajo completado, hacer clic en "Ver Factura".
  - La página `/factura` debe cargar con el diseño profesional.

### 2. Funcionalidad Core (Happy Path)

- [ ] **Cálculo de Totales**
  - El total de la factura debe coincidir con la suma de ítems + mano de obra.
- [ ] **Botón de Impresión**
  - El botón "Imprimir o Guardar PDF" dispara el diálogo del sistema.

### 3. Integración Backend

- [ ] **Datos del Cliente/Empresa**
  - La factura muestra correctamente los nombres y datos fiscales.

---

## ✅ Resultado

- [ ] **PASSED**
- [ ] **FAILED**
