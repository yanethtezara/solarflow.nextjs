# Feature Test Plan: EPIC-SOL-10 - Autenticación y Seguridad de Cuenta

**Fecha:** 2026-04-05
**QA Lead:** AI-Generated (Gemini CLI)
**Epic Jira Key:** SOL-10
**Status:** Draft - Pending Team Review

---

## 📋 Business Context Analysis

### Business Value

Esta épica es el pilar fundamental de SolarFlow. La seguridad y la privacidad son requisitos no negociables para que un instalador confíe sus datos comerciales (clientes, costos, facturación) a la plataforma.

**Key Value Proposition:**

- **Privacidad Total:** Garantiza que los datos de cada instalador sean invisibles para los demás.
- **Confianza:** Un sistema de acceso profesional proyecta seriedad ante clientes y empresas contratantes.

**Success Metrics (KPIs):**

- **Tasa de Activación:** > 60% de usuarios registrados crean su primer trabajo en 7 días.
- **Confiabilidad:** Disponibilidad del servicio de auth del 99.9%.

**User Impact:**

- **Javi Morales (Instalador):** Puede dejar de usar cuadernos y WhatsApp sabiendo que su "oficina" es segura.
- **David Rojas (Líder de Equipo):** Accede a la información de sus cuadrillas de forma centralizada.

---

## 🏗️ Technical Architecture Analysis

### Architecture Components Involved

- **Frontend:** Next.js 15 (App Router). Componentes críticos: `RegistrationForm`, `LoginForm`.
- **Backend:** Next.js API Routes actuando como bridge hacia Supabase.
- **Database:** PostgreSQL en Supabase.
- **Auth Service:** Supabase Auth (gestión de JWT y sesiones).

### Integration Points

- **Frontend → Supabase Auth SDK:** Comunicación directa para flujos de UI.
- **Backend → Supabase Admin:** Validación de sesiones en API Routes.
- **Database → Row Level Security (RLS):** El punto crítico de seguridad donde se aísla la data por `user_id`.

---

## 🚨 Risk Analysis

### Technical Risks

1. **Fallo en Supabase Auth:** Dependencia de un servicio externo para el acceso.
   - **Mitigación:** Implementar manejo de errores robusto y reintentos.
2. **Inyección de Sesión / XSS:** Robo de tokens JWT.
   - **Mitigación:** Usar cookies seguras y las protecciones nativas de Next.js/Supabase.

### Business Risks

1. **Acceso no autorizado a datos de terceros:** El riesgo más crítico para la reputación de la app.
   - **Mitigación:** Auditoría de políticas RLS y tests de integración que intenten acceder a data con IDs de otros usuarios.

---

## 🎯 Test Strategy

### Test Levels

- **Unit Testing (Vitest):** Validación de esquemas Zod, lógica de formateo de errores.
- **Integration Testing:** Validación de flujos de API Auth con Supabase (entorno de pruebas).
- **E2E Testing (Playwright):** Flujos completos desde la perspectiva de Javi y David.
- **API Testing:** Verificación de contratos según `api-contracts.yaml`.

---

## 📊 Test Cases Summary by Story

### STORY-SOL-11: Registro de usuario

**Complexity:** Medium | **Estimated Test Cases:** 6

- Happy path, email duplicado, password débil, formato email inválido.

### STORY-SOL-12: Inicio de sesión

**Complexity:** Low | **Estimated Test Cases:** 5

- Happy path, contraseña incorrecta, usuario no existe, campos vacíos.

### STORY-SOL-13: Recuperación de contraseña

**Complexity:** Medium | **Estimated Test Cases:** 7

- Flujo de solicitud, email genérico (security), expiración de link, cambio de clave exitoso.

### STORY-SOL-14: Cierre de sesión

**Complexity:** Low | **Estimated Test Cases:** 3

- Cierre exitoso, invalidación de token, bloqueo de acceso a /dashboard post-logout.

---

## 🗂️ Test Data Requirements

- Usuarios de prueba pre-registrados en Supabase (entorno staging).
- Emails descartables para pruebas de registro y recuperación.

---

## ✅ Entry/Exit Criteria

### Entry Criteria

- Supabase project configurado y accesible.
- API Contracts de Auth definidos.

### Exit Criteria

- 100% de los casos críticos de seguridad pasando.
- RLS validado para todas las tablas core (Clientes, Trabajos).
- No hay bugs de prioridad Alta/Crítica abiertos.

---

## 📢 Action Required

**@[Product Owner]:**

- ¿Se enviará email de confirmación de cuenta para el MVP o registro directo?

**@[Dev Lead]:**

- Confirmar si se usará el Middleware de Next.js para protección de rutas o HOCs en el cliente.

---

**Next Steps:**

- Proceder a generar los `acceptance-test-plan.md` para cada Story.
- Configurar el entorno de testing en Staging.
