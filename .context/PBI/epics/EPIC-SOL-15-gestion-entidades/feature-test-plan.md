# Feature Test Plan: EPIC-SOL-15 - Gestión de Entidades (Clientes y Empresas)

**Fecha:** 2026-04-05
**QA Lead:** AI-Generated (Gemini CLI)
**Epic Jira Key:** SOL-15
**Status:** Draft - Pending Team Review

---

## 📋 Business Context Analysis

### Business Value

Esta épica organiza la información base necesaria para la operación diaria. La centralización de clientes y empresas contratantes reduce el tiempo administrativo y minimiza errores en la facturación y agendamiento.

**Key Value Proposition:**

- **Orden Operativo:** Información de contacto siempre a mano.
- **Trazabilidad:** Historial de clientes y sus respectivos instalaciones.

**Success Metrics (KPIs):**

- **Adopción:** Promedio de >3 entidades creadas por usuario en su primer mes.
- **Eficiencia:** Reducción del tiempo de creación de un instalación al tener los datos pre-cargados.

**User Impact:**

- **Javier Morales:** Mantiene su agenda limpia y profesional.
- **David Rojas:** Gestiona múltiples empresas subcontratistas sin confusiones.

---

## 🏗️ Technical Architecture Analysis

### Architecture Components Involved

- **Frontend:** Next.js 15. Páginas de gestión de entidades con formularios reactivos.
- **Backend:** API Routes protegidas por middleware de auth.
- **Database:** PostgreSQL. Tablas `clientes` y `empresas`.
- **Security:** Supabase RLS (Row Level Security).

### Integration Points

- **Internal:** API Routes consultando a la DB usando el ID del usuario de la sesión actual.
- **Data Flow:** UI Form -> Client Validation (Zod) -> API Route -> Server Validation (Zod) -> DB Query (RLS filtered).

---

## 🚨 Risk Analysis

### Technical Risks

1. **Fallo en RLS:** Riesgo de que un usuario vea datos de otro por error de configuración en la política de Postgres.
   - **Mitigación:** Tests de integración que intenten leer datos usando el ID de un usuario diferente.
2. **Duplicidad de Datos:** Usuarios creando el mismo cliente varias veces.
   - **Mitigación:** Búsqueda dinámica o validación de unicidad por nombre/email.

### Business Risks

1. **Eliminación Accidental:** Perder datos de un cliente crítico.
   - **Mitigación:** Diálogos de confirmación obligatorios y consideración de Soft Delete.

---

## 🎯 Test Strategy

### Test Levels

- **Unit Testing (Vitest):** Validar esquemas de Zod y formateadores de teléfono/nombre.
- **Integration Testing:** Probar los endpoints `/api/clientes` y `/api/empresas` con diferentes usuarios para validar el aislamiento.
- **E2E Testing (Playwright):** Escenarios de uso real (Crear un cliente, buscarlo, editarlo y borrarlo).

---

## 📊 Test Cases Summary by Story

### STORY-SOL-16: CRUD de Clientes

**Complexity:** Medium | **Estimated Test Cases:** 8

- Creación (Happy path), Validación de obligatorios (Nombre), Edición de teléfono, Eliminación con confirmación, Verificación de aislamiento (RLS).

### STORY-SOL-17: CRUD de Empresas

**Complexity:** Medium | **Estimated Test Cases:** 8

- Creación (Happy path), Validación de obligatorios, Edición de contacto responsable, Eliminación, Verificación de aislamiento.

---

## 🗂️ Test Data Requirements

- Conjuntos de datos realistas para nombres de clientes y empresas.
- Números de teléfono en diferentes formatos internacionales.

---

## ✅ Entry/Exit Criteria

### Entry Criteria

- Tablas `clientes` y `empresas` creadas en Supabase con políticas RLS iniciales.
- API Routes base definidas.

### Exit Criteria

- 100% de las operaciones CRUD validadas.
- Confirmación de que el borrado de una entidad no rompe la consistencia de instalaciones (o se bloquea si hay instalaciones activos).

---

## 📢 Action Required

**@[Product Owner]:**

- ¿Se debe validar la unicidad del nombre del cliente/empresa por usuario?
- ¿Qué campos, además del nombre, son estrictamente obligatorios?

**@[Dev Lead]:**

- ¿Usaremos un componente de tabla genérico para ambas vistas?
- Confirmar si se implementará Soft Delete para evitar pérdida de datos accidental.

---

**Next Steps:**

- Generar `acceptance-test-plan.md` para SOL-16 y SOL-17.
- Revisar el esquema de DB para asegurar que la integridad referencial no bloquee el MVP.
