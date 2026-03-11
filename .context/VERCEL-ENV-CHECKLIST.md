# Checklist: Variables de entorno en Vercel

Para que el deploy funcione, debes configurar estas variables en **Vercel**:

## Pasos

1. Entra a [vercel.com](https://vercel.com) → tu proyecto **solarflow.nextjs**
2. Ve a **Settings** → **Environment Variables**
3. Asegúrate de tener:

| Variable                        | Requerida | Dónde obtenerla                         |
| ------------------------------- | --------- | --------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | ✅ Sí     | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Sí     | Supabase → Settings → API → anon public |

4. **Important:** Marca las variables para **Production**, **Preview** y **Development** si quieres que funcionen en todos los entornos.

5. Si añadiste variables nuevas, haz un **Redeploy** (Deployments → ⋮ → Redeploy).

## Valores de ejemplo (tu proyecto Supabase)

Según tu `.env` local, deberían ser algo como:

```
NEXT_PUBLIC_SUPABASE_URL=https://fqaeyzndqyyfugwmkidh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **No copies estos valores aquí en el repo.** Solo verifica en Vercel que existan y coincidan con los de tu `.env` local.

## Cómo comprobar que están definidas

Si faltan, el build fallará con:

```
Error: Missing environment variable: NEXT_PUBLIC_SUPABASE_URL
```

o

```
Error: Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Variable opcional (para redirects de auth)

| Variable              | Requerida | Valor típico                |
| --------------------- | --------- | --------------------------- |
| `NEXT_PUBLIC_APP_URL` | Para auth | `https://tu-app.vercel.app` |
