# Feature Test Plan: EPIC-SOL-22 - Gestión de Instalaciones de Instalación (Core)

**Fecha:** 2026-04-05
**QA Lead:** AI-Generated (Gemini CLI)
**Epic Jira Key:** SOL-22
**Status:** Draft - Pending Team Review

---

## 📋 Business Context Analysis

### Business Value

Esta épica es el núcleo de SolarFlow. Representa la actividad productiva del instalador. Un "Instalación" bien gestionado garantiza que se use el material correcto, se cobre lo justo y se cumplan los tiempos con el cliente. Es el habilitador para la facturación y la analítica futura.

**Key Value Proposition:**

- **Control Operativo:** Visibilidad clara de "qué", "cuándo" y "dónde".
- **Rentabilidad:** Seguimiento preciso de materiales y mano de obra consumida.

**Success Metrics (KPIs):**

- **Volumen Operativo:** Número de instalaciones creados por semana.
- **Completitud:** % de instalaciones que llegan al estado "Completado" con ítems asignados.

**User Impact:**

- **Javier Morales:** Usa esta sección como su diario de campo digital.
- **David Rojas:** Gestiona la carga de instalación de múltiples proyectos simultáneos.

---

## 🏗️ Technical Architecture Analysis

### Architecture Components Involved

- **Frontend:** Next.js 15. Páginas dinámicas con carga de datos relacionales (Selectores de Clientes/Empresas).
- **Backend:** API Routes con validación de integridad referencial.
- **Database:**
  - `instalaciones`: Tabla principal de encabezado.
  - `trabajos_items`: Tabla de detalle (muchos a muchos entre instalaciones y catálogo).
- **Security:** RLS de Supabase aplicado a ambas tablas vinculadas.

### Integration Points

- **Relacionales:** Integración crítica con EPIC-SOL-15 (Entidades) y EPIC-SOL-18 (Catálogo).
- **Data Flow:** Job Header Creation -> Job Detail Item Addition -> Status Transition -> Ready for Billing.

---

## 🚨 Risk Analysis

### Technical Risks

1. **Snapshoting de Precios:** Si el precio de un panel cambia en el catálogo, no debería cambiar en instalaciones ya cerrados o agendados.
   - **Mitigación:** La tabla `trabajos_items` debe guardar una copia del precio/costo al momento de la inserción.
2. **Carga en Cascada:** Al eliminar un cliente, ¿qué pasa con sus instalaciones?
   - **Mitigación:** Implementar restricciones de FK (No permitir borrado de cliente con instalaciones activos).

### Business Risks

1. **Agendamiento Conflictivo:** Dos instalaciones a la misma hora para el mismo instalador.
   - **Mitigación:** (V2) Alerta de conflicto. Para MVP, permitir pero resaltar en la UI.

---

## 🎯 Test Strategy

### Test Levels

- **Unit Testing (Vitest):** Lógica de suma de subtotales y cálculo de impuestos (si aplica).
- **Integration Testing:** Validar que solo se puedan asociar ítems de catálogo que pertenezcan al mismo usuario.
- **E2E Testing (Playwright):** Flujo "End-to-End": Login -> Crear Cliente -> Crear Material -> Crear Instalación -> Añadir Material al Instalación -> Marcar como Completado.

---

## 📊 Test Cases Summary by Story

### STORY-SOL-23: Crear Instalación

**Complexity:** High | **Estimated Test Cases:** 8

- Creación exitosa, campos obligatorios, validación de fechas futuras/pasadas.

### STORY-SOL-24: Listado y Filtros

**Complexity:** Low | **Estimated Test Cases:** 6

- Listado por fecha, filtros por estado (Agendado, Completado, etc.).

### STORY-SOL-25: Edición de Detalles

**Complexity:** Medium | **Estimated Test Cases:** 6

- Cambio de fecha/ubicación, validación de permisos.

### STORY-SOL-26: Asignación de Items (Core)

**Complexity:** High | **Estimated Test Cases:** 10

- Agregar material con cantidad, agregar mano de obra, recalcular total al eliminar ítem.

### STORY-SOL-27: Cambio de Estado

**Complexity:** Low | **Estimated Test Cases:** 5

- Transición a "Completado", bloqueo de ediciones en estados terminales.

---

## 🗂️ Test Data Requirements

- Datos de clientes y empresas pre-cargados.
- Catálogo base de materiales y servicios.

---

## ✅ Entry/Exit Criteria

### Entry Criteria

- CRUD de Entidades y Catálogo funcional.
- Esquema de DB para `instalaciones` y `trabajos_items` desplegado.

### Exit Criteria

- Flujo transaccional completo validado sin errores de integridad.
- RLS confirmado (un usuario no puede añadir ítems al instalación de otro).

---

## 📢 Action Required

**@[Product Owner]:**

- ¿El estado "Completado" bloquea la edición de materiales? (Recomendado: Sí).
- ¿Se permite la creación de instalaciones sin empresa asociada? (Confirmado en story como opcional).

**@[Dev Lead]:**

- Confirmar uso de `decimal(12,2)` para precios en la tabla asociativa.
- ¿Usaremos un Wizard para la creación o un formulario único largo?

---

**Next Steps:**

- Generar los 5 `acceptance-test-plan.md` correspondientes.
- Revisar el impacto del Middleware en el flujo de creación.
