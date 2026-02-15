# Non-Functional Specifications: SolarFlow
---
## 1. Performance
-   **Page Load Time (LCP):** < 2.5 segundos para el 75% de las visitas en una conexión 4G.
-   **API Response Time:** < 500ms para el 95% de las lecturas (GET) y < 800ms para las
      escrituras (POST, PUT, DELETE).
-   **Time to Interactive (TTI):** < 3.5 segundos en dispositivos móviles.
-   **Concurrent Users (MVP):** El sistema debe soportar 100 usuarios concurrentes sin
      degradación notable del rendimiento.
-   **Database Query Time:** Las consultas simples a Supabase deben resolverse en < 150ms.
---
## 2. Security
-   **Authentication:** La autenticación se manejará mediante JWT (JSON Web Tokens) provist
      por Supabase Auth. Los tokens tendrán una vida útil corta (ej. 1 hora) y se usarán refresh
      tokens para mantener la sesión.
-   **Authorization:** Se implementará Row Level Security (RLS) en la base de datos de
      Supabase. Cada consulta a la base de datos debe estar restringida al `user_id` del usuario
      autenticado, asegurando que un usuario no pueda ver ni modificar datos ajenos.
-   **Data Encryption:**
-   **At rest:** Gestionado automáticamente por Supabase, que encripta los datos en el
      disco.
-   **In transit:** Todo el tráfico entre el cliente y el servidor (Vercel) y entre el
      servidor y la base de datos (Supabase) debe ser a través de HTTPS/TLS 1.3.
-   **Input Validation:** Toda entrada del usuario debe ser validada tanto en el cliente
      (para feedback rápido) como en el servidor (para seguridad). Se usarán librerías como Zod
      para definir esquemas estrictos.
-   **Password Policy:** Mínimo 8 caracteres, conteniendo al menos 1 letra mayúscula y 1
      número. Esta política será impuesta por Supabase Auth.
-   **OWASP Top 10:** Se aplicarán mitigaciones para las vulnerabilidades más comunes,
      incluyendo la protección contra Inyección SQL (manejada por el ORM/cliente de Supabase), XS
      (manejada por Next.js) y CSRF (Next.js implementa protecciones por defecto).
---
## 3. Scalability
-   **Infraestructura de Frontend/Backend:** La aplicación se desplegará en Vercel. Las API
      routes (Serverless Functions) escalarán horizontalmente de forma automática según la demand
-   **Base de Datos:** Se utilizará una instancia de PostgreSQL gestionada por Supabase. Pa
      el MVP, un plan estándar es suficiente. La escalabilidad vertical (mejorar la instancia) se
      el primer paso si se alcanza el límite.
-   **CDN:** Vercel Edge Network se usará automáticamente para cachear y servir activos
      estáticos (imágenes, CSS, JS) globalmente, reduciendo la latencia.
-   **Caching Strategy:**
-   Se usará `stale-while-revalidate` para datos que no cambian frecuentemente (ej.
      perfil de usuario).
-   Se aplicará ISR (Incremental Static Regeneration) en páginas que puedan ser
      pre-renderizadas pero necesiten actualización periódica.
---
## 4. Accessibility
-   **WCAG Compliance:** El objetivo es alcanzar el nivel AA de las Web Content Accessibili
      Guidelines (WCAG) 2.1.
-   **Keyboard Navigation:** Toda la funcionalidad interactiva (formularios, botones, menús
      debe ser completamente accesible y operable usando solo el teclado.
-   **Screen Reader Support:** Se usarán etiquetas ARIA y HTML semántico para asegurar la
      compatibilidad con lectores de pantalla como NVDA y VoiceOver.
-   **Color Contrast:** Se respetará el requisito de diseño de "alto contraste", asegurando
      un ratio mínimo de 4.5:1 para el texto normal sobre su fondo, para garantizar la legibilida
      en exteriores.
-   **Focus Indicators:** Los indicadores de foco del navegador serán visibles y
      personalizados para que coincidan con la estética de la app.
---
## 5. Browser Support
-   **Desktop:** Últimas 2 versiones de Chrome, Firefox, Safari y Edge.
-   **Mobile:** Últimas 2 versiones de iOS Safari y Android Chrome.
---
## 6. Reliability
-   **Uptime:** El objetivo de disponibilidad de la aplicación es del 99.9%, aprovechando l
      alta disponibilidad de Vercel y Supabase.
-   **Error Rate:** El porcentaje de requests al servidor que resultan en un error 5xx debe
      ser inferior al 0.5%.
-   **Backups:** La base de datos de Supabase tendrá backups automáticos diarios con una
      política de retención de 7 días.
-   **Recovery Time Objective (RTO):** En caso de un incidente crítico, el servicio debe se
      restaurado en menos de 1 hora.
---
## 7. Maintainability
-   **Code Coverage:** Se buscará una cobertura de tests unitarios y de integración superio
      al 80% para la lógica de negocio crítica.
-   **Documentation:** Además de los documentos en `.context`, el código deberá tener
      comentarios (JSDoc) en las funciones y componentes complejos.
-   **Linting & Formatting:** Se configurará ESLint y Prettier en el proyecto y se ejecutar
      en un hook de pre-commit para garantizar un estilo de código consistente.
-   **TypeScript:** El proyecto se desarrollará en TypeScript con el modo `strict` habilita
      para minimizar errores en tiempo de ejecución.
