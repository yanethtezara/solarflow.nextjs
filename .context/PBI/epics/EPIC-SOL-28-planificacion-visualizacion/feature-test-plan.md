# Feature Test Plan: EPIC-SOL-28 - Planificación y Visualización

**Fecha:** 2026-04-05
**QA Lead:** AI-Generated (Gemini CLI)
**Epic Jira Key:** SOL-28
**Status:** Draft - Pending Team Review

---

## 📋 Business Context Analysis

### Business Value

La capacidad de visualizar el instalación en un calendario transforma a SolarFlow de un simple CRUD a una herramienta de planificación real. Permite al instalador ver su disponibilidad futura y optimizar sus días de instalación, reduciendo el "tiempo muerto" entre instalaciones.

**Key Value Proposition:**

- **Organización Visual:** Entender la carga de instalación de un vistazo.
- **Agilidad:** Creación de instalaciones contextual (hacer clic en un hueco libre).

**Success Metrics (KPIs):**

- **Engagement:** Frecuencia de uso de la vista de calendario vs lista.
- **Velocidad de Carga:** Interacción fluida al navegar entre meses.

**User Impact:**

- **Javi Morales:** Revisa su celular al despertar para ver qué tiene hoy y mañana.
- **David Rojas:** Identifica semanas libres para proponer nuevas instalaciones a las empresas.

---

## 🏗️ Technical Architecture Analysis

### Architecture Components Involved

- **Frontend:** Next.js + Librería de UI (ej. shadcn/ui calendar o FullCalendar).
- **State Management:** Persistencia de la vista (lista/cal) en `localStorage`.
- **Backend:** Endpoint `/api/trabajos` con filtros `startDate` y `endDate`.
- **Security:** RLS de Supabase garantiza que el calendario solo muestre data propia.

### Integration Points

- **Data Fetching:** Sincronización entre la navegación del calendario (flechas mes ant/sig) y los re-fetches de la API.
- **Navigation:** Click en evento de calendario -> Ir al detalle del instalación (SOL-24).

---

## 🚨 Risk Analysis

### Technical Risks

1. **Renderizado Pesado:** Muchos eventos en un solo día pueden romper el layout del calendario.
   - **Mitigación:** Usar vistas compactas o indicadores numéricos (+3 más) con popovers.
2. **Desincronización de Fecha:** Problemas con el formato ISO8601 y la hora local.
   - **Mitigación:** Testear con diferentes zonas horarias y asegurar el uso de `date-fns` o `dayjs` de forma consistente.

### Business Risks

1. **Error de Agendamiento:** El usuario cree que un día está libre porque el calendario no cargó bien.
   - **Mitigación:** Indicadores de carga (skeletons) y manejo de estados de error de red claros.

---

## 🎯 Test Strategy

### Test Levels

- **Unit Testing (Vitest):** Funciones de utilidad para generar cuadrículas de días y meses.
- **Integration Testing:** Verificar que la API de instalaciones filtra correctamente por rango cuando el calendario lo solicita.
- **E2E Testing (Playwright):** Probar el cambio de mes, cambio de vista (Cal -> Lista) y creación de instalación desde un slot de fecha.

---

## 📊 Test Cases Summary by Story

### STORY-SOL-29: Vista de Calendario

**Complexity:** Medium | **Estimated Test Cases:** 6

- Carga mensual, carga semanal, indicadores de eventos, navegación entre meses.

### STORY-SOL-30: Alternancia de Vistas

**Complexity:** Low | **Estimated Test Cases:** 4

- Cambio Lista/Cal, persistencia en refresco, consistencia de datos entre vistas.

### STORY-SOL-31: Creación desde Calendario

**Complexity:** Medium | **Estimated Test Cases:** 5

- Apertura de formulario con fecha pre-llenada, guardado exitoso y reflejo inmediato en el día seleccionado.

---

## 🗂️ Test Data Requirements

- Instalaciones distribuidos en diferentes semanas y meses.
- Instalaciones en diferentes estados (colores).

---

## ✅ Entry/Exit Criteria

### Entry Criteria

- API de instalaciones con soporte para filtros de fecha.
- Componente de calendario base integrado en el proyecto.

### Exit Criteria

- Navegación fluida y sin errores de consola en el calendario.
- Persistencia de la preferencia de vista comprobada.

---

## 📢 Action Required

**@[Product Owner]:**

- ¿Se mostrará la ubicación en el pequeño recuadro del calendario o solo el nombre del cliente?
- ¿Permitimos la creación de instalaciones en días pasados desde el calendario?

**@[Dev Lead]:**

- ¿Manejaremos la zona horaria del servidor (UTC) o la del usuario?
- Confirmar si se usará el `JobCreationForm` existente como un modal o navegación a página nueva.

---

**Next Steps:**

- Generar `acceptance-test-plan.md` para las historias de planificación.
- Validar el performance del endpoint de instalaciones con filtros de fecha.
