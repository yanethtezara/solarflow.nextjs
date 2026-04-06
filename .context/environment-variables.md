# Environment Variables - SolarFlow

Este documento detalla las variables necesarias para el funcionamiento de la aplicación en sus diferentes entornos.

## Variables por Ambiente

### 💻 Development (Local)

**Archivo:** `.env` (Ignorado por Git)

| Variable                        | Valor / Ejemplo                            | Notas                                             |
| :------------------------------ | :----------------------------------------- | :------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://fqaeyzndqyyfugwmkidh.supabase.co` | URL del proyecto actual.                          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...`                                | Key pública de Supabase.                          |
| `SUPABASE_SERVICE_ROLE_KEY`     | `eyJhbG...`                                | **SOLO SERVIDOR.** No usar en componentes client. |
| `NEXT_PUBLIC_APP_URL`           | `http://localhost:3000`                    | URL local.                                        |

---

### 🧪 Staging (Vercel Preview)

**Configuración:** Vercel Dashboard -> Settings -> Environment Variables
**Scope:** `Preview` (Rama `staging`)

| Variable                        | Valor sugerido                                | Notas                                  |
| :------------------------------ | :-------------------------------------------- | :------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL de tu proyecto Supabase.                  | Misma que dev para el MVP.             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon Key de Supabase.                         |                                        |
| `SUPABASE_SERVICE_ROLE_KEY`     | Service Role Key.                             | Necesaria para el trigger de perfiles. |
| `NEXT_PUBLIC_APP_URL`           | `https://solarflow-nextjs-staging.vercel.app` | URL de tu despliegue en Vercel.        |

---

### 🚀 Production (Fase 13)

**Scope:** `Production` (Rama `main`)
_(Se configurará al finalizar el desarrollo)_

---

## Seguridad

- ✅ Las variables con el prefijo `NEXT_PUBLIC_` son accesibles desde el navegador.
- ❌ **NUNCA** añadas `SUPABASE_SERVICE_ROLE_KEY` con el prefijo `NEXT_PUBLIC_`.
- ✅ Asegúrate de añadir los dominios de Vercel en la lista de permitidos en **Supabase Auth -> URL Configuration**.
