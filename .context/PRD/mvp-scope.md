 # MVP Scope: SolarFlow
## 1. In Scope (Must Have)
Estas son las características fundamentales que constituirán el Producto Mínimo Viable (MVP
      de SolarFlow.
---
### **EPIC-SOLAR-001: Autenticación y Seguridad de Cuenta**
*   **Epic Title:** Autenticación y Seguridad de Cuenta
*   **User Stories:**
*   **US 1.1:** Como **Javi (instalador)**, quiero poder registrarme en la plataforma
      usando mi email y una contraseña para tener una cuenta segura y privada.
*   **US 1.2:** Como **David (jefe de cuadrilla)**, quiero poder iniciar sesión con mis
      credenciales para acceder a la información de mis trabajos.
*   **US 1.3:** Como **Javi**, quiero una opción para "recuperar mi contraseña" si la
      olvido, para no perder el acceso a mi cuenta.
*   **US 1.4:** Como usuario, quiero poder cerrar sesión de forma segura para proteger
      información en dispositivos compartidos.
---
### **EPIC-SOLAR-002: Gestión de Entidades (Clientes y Empresas)**
*   **Epic Title:** Gestión de Entidades (Clientes y Empresas)
*   **User Stories:**
*   **US 2.1:** Como **Javi**, quiero poder agregar, ver, editar y eliminar la
      información de mis clientes (nombre, dirección, teléfono) para tener una base de datos
      centralizada.
*   **US 2.2:** Como **David**, quiero poder agregar, ver, editar y eliminar los datos
      las empresas que me contratan (nombre, contacto responsable, teléfono) para poder asociarla
      a los trabajos.
---
### **EPIC-SOLAR-003: Gestión de Trabajos de Instalación (Core)**
*   **Epic Title:** Gestión de Trabajos de Instalación (Core)
*   **User Stories:**
*   **US 3.1:** Como **Javi**, quiero poder crear un nuevo trabajo de instalación
      asociando un cliente, una empresa, una fecha, una hora y una ubicación para tener todos los
      detalles organizados.
*   **US 3.2:** Como **David**, quiero poder ver un listado de todos mis trabajos
      (pasados y futuros) con su estado (ej. Agendado, En Progreso, Completado) para conocer mi
      carga de trabajo.
*   **US 3.3:** Como **Javi**, quiero poder editar los detalles de un trabajo existente
      para actualizar la información si hay cambios.
*   **US 3.4:** Como **David**, quiero poder agregar materiales y costos de mano de obr
      específicos a un trabajo para llevar un control de los recursos y gastos del proyecto.
*   **US 3.5:** Como **Javi**, quiero poder marcar un trabajo como "Completado" para
      saber qué está listo para facturar.
---
### **EPIC-SOLAR-004: Planificación y Visualización**
*   **Epic Title:** Planificación y Visualización
*   **User Stories:**
*   **US 4.1:** Como **David**, quiero poder ver mis trabajos agendados en una vista de
      calendario (mensual/semanal) para planificar mi disponibilidad y la de mi equipo.
*   **US 4.2:** Como **Javi**, quiero poder alternar entre una vista de lista y una vis
      de calendario para elegir la que mejor me convenga en cada momento.
*   **US 4.3:** Como **Javi**, quiero poder crear un nuevo trabajo directamente desde l
      vista de calendario para agilizar la planificación.
---
### **EPIC-SOLAR-005: Catálogo de Servicios y Materiales**
*   **Epic Title:** Catálogo de Servicios y Materiales
*   **User Stories:**
*   **US 5.1:** Como **David**, quiero poder pre-definir un catálogo de mis servicios d
      mano de obra con sus precios para poder agregarlos rápidamente a los trabajos.
*   **US 5.2:** Como **Javi**, quiero poder pre-definir un catálogo de los materiales m
      comunes que uso con sus costos para estandarizar mis presupuestos y gastos.
*   **US 5.3:** Como **Javi**, quiero que los catálogos de mano de obra y materiales se
      editables (CRUD) para mantener mis precios y lista de productos actualizados.
---
### **EPIC-SOLAR-006: Facturación Simple**
*   **Epic Title:** Facturación Simple
*   **User Stories:**
*   **US 6.1:** Como **Javi**, quiero poder generar una vista de factura para un trabaj
      "Completado" con un solo clic, que calcule automáticamente el total sumando la mano de obra
      los materiales.
*   **US 6.2:** Como **David**, quiero que la factura generada incluya los datos de mi
      empresa, los datos del cliente, el desglose de conceptos y el logo de mi negocio para que s
      profesional.
*   **US 6.3:** Como **Javi**, quiero poder descargar la factura en formato PDF para
      poder enviarla fácilmente a la empresa contratante.
---
## 2. Out of Scope (Nice to Have for V2)
-   **Gestión de Equipos:** Asignación de trabajos a miembros específicos de la cuadrilla d
      David.
-   **Notificaciones Avanzadas:** Recordatorios automáticos por email/SMS para Javi sobre l
      trabajos del día siguiente.
-   **Dashboard y Reportes:** Gráficos con ingresos mensuales, trabajos por cliente, etc.
-   **Gestión de Inventario:** Control de stock de materiales.
-   **Integraciones:** Conexión con software de contabilidad (QuickBooks, Xero) o calendari
      externos (Google Calendar).
-   **App Móvil Nativa:** Desarrollo de aplicaciones para iOS y Android. El MVP será una
      WebApp responsiva.
-   **Portal de Cliente:** Un acceso para que el cliente final pueda ver el estado de su
      instalación.
## 3. Success Criteria
El MVP se considerará un éxito y estará listo para un lanzamiento más amplio cuando se
      cumplan las siguientes condiciones:
-   **Criterios de Aceptación del MVP:**
-   Todas las User Stories "In Scope" están implementadas, probadas y funcionales.
-   Un usuario puede completar el flujo completo sin errores bloqueantes: registrarse,
      crear un cliente, crear un trabajo, agregarle materiales, completarlo y generar una factura
      en PDF.
-   La aplicación es completamente funcional y usable en las últimas versiones de Chrom
      para escritorio y móvil (Android/iOS).
-   **Métricas Mínimas a Alcanzar (tras 3 meses de lanzamiento beta):**
-   Se ha alcanzado el objetivo de **100 usuarios activos semanales (WAU)**.
-   La tasa de retención de la semana 4 es de al menos **30%**.
-   Se han creado más de **500 trabajos** en la plataforma.
-   **Condiciones para Lanzamiento:**
-   El equipo ha realizado pruebas end-to-end (E2E) de los flujos críticos.
-   La infraestructura en Vercel y Supabase está configurada para un entorno de
      producción.
-   Existe un plan de rollback y un sistema de monitoreo de errores básicos.
