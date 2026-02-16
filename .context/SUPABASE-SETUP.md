# Guía: Configurar Supabase para SolarFlow

## 1. Crear un proyecto en Supabase (si aún no tienes uno)

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Clic en **New project**
3. Elige nombre, contraseña de DB, y región
4. Espera unos minutos hasta que el proyecto termine de crearse

---

## 2. Obtener las credenciales

1. En el panel de tu proyecto, ve a **Settings** (⚙️) en el menú lateral
2. Abre **API** en el submenú
3. Verás estas secciones:

| Variable en .env | Dónde copiarla en Supabase |
|-----------------|---------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** (ej: `https://abcdefgh.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Project API keys** → **anon** / **public** |
| `SUPABASE_SERVICE_ROLE_KEY` | **Project API keys** → **service_role** (clic en "Reveal") |

4. Copia cada valor y pégalo en tu archivo `.env`

---

## 3. Editar tu archivo .env

Abre `.env` en la raíz del proyecto y reemplaza las líneas 74-76:

```env
# Antes (placeholders):
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Después (tus valores reales):
NEXT_PUBLIC_SUPABASE_URL=https://tu-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mi...
```

⚠️ **Importante:** No compartas tu `SUPABASE_SERVICE_ROLE_KEY`. Bypasea las políticas RLS.

---

## 4. Configurar URL de redirección (Auth)

Para que el login funcione correctamente, debes agregar la URL de callback en Supabase:

1. Ve a **Authentication** → **URL Configuration**
2. En **Redirect URLs**, agrega: `http://localhost:3002/auth/callback`
3. En **Site URL** para desarrollo local puedes usar: `http://localhost:3002`

> **Nota:** La app corre en puerto **3002** (ver `package.json` → `"dev": "next dev -p 3002"`)

---

## 5. Crear el schema de la base de datos

Ejecuta el SQL del archivo **`.context/supabase-initial-schema.sql`** en Supabase:

1. Ve a **SQL Editor** → **New query**
2. Copia y pega el contenido de `supabase-initial-schema.sql`
3. Clic en **Run**

Esto crea las tablas: `profiles`, `clientes`, `empresas`, `trabajos`, `catalogo_items`, `trabajos_items` con RLS.

---

## 6. Comprobar la configuración

1. Guarda `.env`
2. Reinicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

3. Si algo falla, `src/lib/config.ts` mostrará qué variable falta
