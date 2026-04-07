# Feature Test Plan: EPIC-SOL-18 - Catálogo de Servicios y Materiales

**Fecha:** 2026-04-05
**QA Lead:** AI-Generated (Gemini CLI)
**Epic Jira Key:** SOL-18
**Status:** Draft - Pending Team Review

---

## 📋 Business Context Analysis

### Business Value

Esta épica proporciona la estructura de costos necesaria para la rentabilidad del negocio. Al predefinir servicios y materiales, el instalador evita la inconsistencia en los precios cobrados a los clientes y asegura que los márgenes de ganancia sean claros desde la planificación del trabajo.

**Key Value Proposition:**

- **Consistencia:** Precios uniformes para todos los clientes.
- **Rapidez:** Carga de ítems en segundos al crear presupuestos o reportes de trabajo.

**Success Metrics (KPIs):**

- **Uso de Catálogo:** > 80% de los trabajos creados deben usar al menos un ítem del catálogo.
- **Precisión:** Reducción de errores manuales en la entrada de precios.

**User Impact:**

- **David Rojas:** Estandariza el costo de la mano de obra de sus equipos.
- **Javi Morales:** Lleva un control preciso del costo de los insumos (paneles, inversores).

---

## 🏗️ Technical Architecture Analysis

### Architecture Components Involved

- **Frontend:** Next.js 15. Vistas separadas o filtradas para Servicios y Materiales.
- **Backend:** API Route polimórfica `/api/catalogo-items` o rutas específicas.
- **Database:** Tabla `catalogo_items` con discriminador por `tipo`.
- **Security:** RLS activado para aislamiento por instalador.

### Integration Points

- **Data Flow:** Form Input -> Frontend Validation -> API Request -> RLS check -> DB Transaction.
- **Dependency:** El módulo de Trabajos (SOL-22+) dependerá de esta tabla para los selectores de ítems.

---

## 🚨 Risk Analysis

### Technical Risks

1. **Pérdida de Integridad Referencial:** Eliminar un panel solar del catálogo que ya está referenciado en un trabajo activo.
   - **Mitigación:** Impedir borrado físico si existen FKs activas o implementar marcas de "Inactivo".
2. **Precisión Numérica:** Errores de redondeo en precios/costos decimales.
   - **Mitigación:** Usar tipos de datos `decimal` o `numeric` en Postgres y manejar centavos correctamente.

### Business Risks

1. **Precios Obsoletos:** El usuario olvida actualizar costos ante la inflación.
   - **Mitigación:** Mostrar fecha de "Última actualización" en el ítem.

---

## 🎯 Test Strategy

### Test Levels

- **Unit Testing (Vitest):** Validación de inputs numéricos (no negativos, formato moneda).
- **Integration Testing:** Verificación de filtros por `tipo` en la API.
- **E2E Testing (Playwright):** Flujo de "Setup Inicial de Catálogo" (Crear 1 servicio y 1 material, editarlos y listarlos).

---

## 📊 Test Cases Summary by Story

### STORY-SOL-19: Catálogo de Servicios

**Complexity:** Low | **Estimated Test Cases:** 6

- Creación de servicio, validación de precio obligatorio, listado filtrado.

### STORY-SOL-20: Catálogo de Materiales

**Complexity:** Low | **Estimated Test Cases:** 6

- Creación de material, validación de costo, listado filtrado.

### STORY-SOL-21: CRUD/Edición

**Complexity:** Medium | **Estimated Test Cases:** 8

- Edición de precio, eliminación con diálogo, validación de RLS (un usuario no edita el catálogo de otro).

---

## 🗂️ Test Data Requirements

- Lista de servicios comunes (Instalación, Mantenimiento, Visita técnica).
- Lista de materiales (Panel 400W, Inversor, Cable solar, Estructura).

---

## ✅ Entry/Exit Criteria

### Entry Criteria

- Tabla `catalogo_items` definida en el esquema de Supabase.
- Autenticación funcionando (SOL-10).

### Exit Criteria

- CRUD funcional al 100% para ambos tipos de ítems.
- RLS validado (aislamiento total).

---

## 📢 Action Required

**@[Product Owner]:**

- ¿El precio de los servicios es por hora o por unidad de trabajo?
- ¿Se debe permitir eliminar ítems que ya están en facturas o trabajos?

**@[Dev Lead]:**

- ¿Se manejará una sola tabla para ambos o tablas separadas? (Recomendado: Una sola con `tipo`).
- ¿Implementaremos marcas de "Inactivo" para evitar romper historial?

---

**Next Steps:**

- Generar `acceptance-test-plan.md` para las historias de catálogo.
- Validar esquema de base de datos con el equipo.
