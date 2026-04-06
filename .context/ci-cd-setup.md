# CI/CD Setup - SolarFlow

## GitHub Actions Workflow

**Archivo:** `.github/workflows/ci.yml`

### Triggers

El flujo se activa automáticamente en:

- ✅ **Push** a las ramas `main` y `staging`.
- ✅ **Pull Requests** hacia `main` y `staging`.

### Jobs del Pipeline

1.  **🔍 Lint:** Valida el estilo de código con ESLint.
2.  **🧪 Test:** Ejecuta las pruebas unitarias con Vitest.
3.  **🏗️ Build:** Valida que el proyecto de Next.js compila correctamente.
4.  **🚀 Deploy Staging:**
    - Se ejecuta **SOLO** en la rama `staging`.
    - Despliega automáticamente a Vercel.

### Secrets Requeridos en GitHub

Para que el despliegue funcione, debes configurar los siguientes "Repository Secrets" en GitHub (**Settings -> Secrets and variables -> Actions**):

| Secret              | Descripción                               |
| :------------------ | :---------------------------------------- |
| `VERCEL_TOKEN`      | Token de acceso de tu cuenta de Vercel.   |
| `VERCEL_ORG_ID`     | ID de tu organización/equipo en Vercel.   |
| `VERCEL_PROJECT_ID` | ID de este proyecto específico en Vercel. |

### Flujo de Trabajo

1.  Desarrollas en ramas `test/SOL-XX/...`.
2.  Haces PR a `staging`. El CI valida el código.
3.  Al hacer Merge a `staging`, el CI despliega automáticamente a la URL de pruebas.
4.  Una vez validado por QA, se hace Merge a `main` para producción.
