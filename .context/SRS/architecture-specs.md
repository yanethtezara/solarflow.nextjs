# Software Architecture Specifications: SolarFlow
---
## 1. System Architecture (C4 Model - Level 2)
Este diagrama muestra los principales contenedores del sistema SolarFlow y cómo interactúan
     entre sí.
  graph TD
      subgraph "Internet"
          U(👤<br>Instalador Solar)
      end


      subgraph "SolarFlow System on Vercel"
          WebApp[🌐<br><b>Next.js Frontend</b><br>(React Server Components,
  TailwindCSS)<br>Aplicación web con la que interactúa el usuario.]
          ApiRoutes[⚙️<br><b>Next.js API Routes</b><br>(Serverless Functions)<br>Backend que
  maneja la lógica de negocio y la comunicación con la base de datos.]
      end


      subgraph "Supabase Cloud Platform"
          Auth[🔒<br><b>Supabase Auth</b><br>Gestiona registro, login y tokens JWT.]
          DB[(🐘<br><b>PostgreSQL DB</b><br>Almacena todos los datos de la aplicación. Protegida
  con RLS.)]
          Storage[📦<br><b>Supabase Storage</b><br>(Futuro) Almacena el logo de la empresa y los
  PDFs de las facturas.]
      end


      U -- "Usa (HTTPS)" --> WebApp
      WebApp -- "Llama a (API, HTTPS)" --> ApiRoutes
      ApiRoutes -- "Valida usuario con" --> Auth
      ApiRoutes -- "Ejecuta queries (SQL)" --> DB
      Auth -- "Gestiona usuarios en" --> DB
---
## 2. Database Design (Entity-Relationship Diagram)
Este ERD muestra las entidades principales de la base de datos y sus relaciones.
**Nota:** Este es un modelo conceptual. El schema real será gestionado por Supabase y las
     migraciones. El `user_id` en cada tabla es la clave para implementar Row Level Security (RLS
  erDiagram
      users {
          UUID id PK "Supabase Auth ID"
          string email
      }

      clientes {
          UUID id PK
          UUID user_id FK
          string nombre
          string direccion
          string telefono
          timestamp created_at
      }


      empresas {
          UUID id PK
          UUID user_id FK
          string nombre
          string contacto_responsable
          string telefono_contacto
          timestamp created_at
      }


      trabajos {
          UUID id PK
          UUID user_id FK
          UUID cliente_id FK
          UUID empresa_id FK
          date fecha
          time hora
          string estado
          timestamp created_at
      }


      catalogo_items {
          UUID id PK
          UUID user_id FK
          string nombre
          string tipo "material o mano_de_obra"
          decimal precio
          timestamp created_at
      }

      trabajos_items {
          UUID trabajo_id PK, FK
          UUID item_id PK, FK
          integer cantidad
      }


      users ||--o{ clientes : "gestiona"
      users ||--o{ empresas : "gestiona"
      users ||--o{ trabajos : "gestiona"
      users ||--o{ catalogo_items : "gestiona"
      clientes ||--o{ trabajos : "asociado a"
      empresas ||--o{ trabajos : "asociado a"
      trabajos }o--o{ trabajos_items : "contiene"
      catalogo_items }o--o{ trabajos_items : "contenido en"
---
## 3. Tech Stack Justification
-   **Frontend & Backend: Next.js 15 (App Router)**
-   ✅ **Framework Full-stack:** Permite construir el frontend y el backend (API Routes
      en un solo lugar, simplificando el desarrollo y el despliegue.
-   ✅ **React Server Components (RSC):** Mejora drásticamente el rendimiento al
      renderizar componentes en el servidor, enviando menos JavaScript al cliente.
-   ✅ **Ecosistema y Comunidad:** Amplio soporte, librerías y una comunidad muy activa
-   ❌ **Trade-off:** La curva de aprendizaje del App Router y los Server Components
      puede ser un poco más pronunciada para desarrolladores que vienen del modelo tradicional de
      React (CSR).
-   **Base de Datos y Autenticación: Supabase (PostgreSQL)**
-   ✅ **Backend-as-a-Service (BaaS) Completo:** Provee base de datos, autenticación, y
      almacenamiento en una única plataforma, lo que acelera enormemente el desarrollo del MVP.
-   ✅ **Seguridad Integrada:** Facilita enormemente la implementación de Row Level
      Security (RLS), una forma robusta de asegurar que los usuarios solo accedan a sus propios
      datos.
-   ✅ **Basado en Estándares:** Usa PostgreSQL, una de las bases de datos relacionales
      más potentes y confiables del mundo.
-   ❌ **Trade-off:** Genera una dependencia de un proveedor externo. Sin embargo, al
      estar basado en PostgreSQL, la migración a una solución auto-gestionada en el futuro es
      factible.
-   **Plataforma de Despliegue: Vercel**
-   ✅ **Integración Perfecta con Next.js:** Creado por el mismo equipo, ofrece la mejo
      experiencia de despliegue, con CI/CD automático desde un `git push`.
-   ✅ **Escalabilidad Automática:** La infraestructura serverless escala automáticamen
      con el tráfico, sin necesidad de gestión manual.
-   ✅ **Edge Network Global:** Sirve la aplicación desde ubicaciones cercanas a los
      usuarios, garantizando baja latencia en todo el mundo.
-   ❌ **Trade-off:** Puede ser más costoso a gran escala en comparación con soluciones
      IaaS como AWS, pero para un MVP y la fase de crecimiento inicial, su conveniencia y
      rendimiento lo justifican.
---
## 4. Data Flow Example: Crear un Nuevo Trabajo
1.  **Usuario (Frontend):** Javi rellena el formulario para crear un nuevo trabajo en la
      interfaz de Next.js y presiona "Guardar".
2.  **Validación (Cliente):** La app de Next.js valida los campos del formulario (ej. la
      fecha no puede estar vacía) usando una librería como Zod.
3.  **Request (API):** Si la validación del cliente pasa, se realiza una petición `POST` a
      API Route `/api/trabajos`. El `access_token` (JWT) de Javi se incluye en la cabecera
      `Authorization`.
4.  **Middleware (Servidor):** Un middleware en el servidor intercepta la petición, verific
      el JWT usando la librería de Supabase para validar la sesión de Javi.
5.  **Validación (Servidor):** La API Route vuelve a validar los datos recibidos con el mis
      esquema de Zod para asegurar la integridad.
6.  **Lógica de Negocio (Servidor):** La API Route construye el objeto a insertar en la bas
      de datos.
7.  **Consulta a DB (Supabase):** Se ejecuta una consulta `INSERT` en la tabla `trabajos` a
      través del cliente de Supabase. RLS en la base de datos asegura que la fila se inserte con
      `user_id` correcto de Javi.
8.  **Respuesta (API):** La base de datos retorna el nuevo registro. La API Route construye
      una respuesta `201 Created` con el nuevo trabajo en formato JSON.
9.  **Actualización de UI (Frontend):** La aplicación de Next.js recibe la respuesta,
      actualiza el estado (ej. SWR o React Query) y muestra el nuevo trabajo en el
      calendario/lista, junto a un mensaje de éxito.
---
## 5. Security Architecture
-   **Authentication Flow:**
1.  **Registro/Login:** El usuario interactúa con un formulario en el Frontend.
2.  **Supabase Auth:** El Frontend se comunica directamente con Supabase Auth para
      registrar/loguear al usuario.
3.  **Tokens:** Supabase Auth devuelve un `access_token` (JWT de corta duración) y un
      `refresh_token`. El `access_token` se usará para llamar a nuestras API Routes.
4.  **Session Management:** Los tokens se almacenan de forma segura en el cliente (ej.
      cookies). La librería de Supabase gestiona el refresco automático del `access_token` usando
      el `refresh_token`.
-   **RBAC (Role-Based Access Control) Implementation:**
-   Para el MVP, el sistema solo tiene un rol: `user`. La autorización no se basa en
      roles, sino en la **propiedad de los datos**.
-   La implementación se basa exclusivamente en **Row Level Security (RLS)** de
      PostgreSQL, activada en Supabase. Se crearán políticas de seguridad que añaden una condició
      `WHERE user_id = auth.uid()` a cada `SELECT`, `INSERT`, `UPDATE`, `DELETE`, garantizando el
      aislamiento total de los datos de cada usuario a nivel de base de datos.
