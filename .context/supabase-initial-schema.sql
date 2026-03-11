-- SolarFlow - Schema inicial para Supabase
-- Ejecuta este SQL en Supabase: SQL Editor → New query → Pegar y Run

-- 1. Tabla profiles (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger para crear profile al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Tabla clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  direccion TEXT,
  telefono TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own clientes" ON public.clientes
  FOR ALL USING (auth.uid() = user_id);

-- 3. Tabla empresas
CREATE TABLE IF NOT EXISTS public.empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  contacto_responsable TEXT,
  telefono_contacto TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own empresas" ON public.empresas
  FOR ALL USING (auth.uid() = user_id);

-- 4. Tabla trabajos
CREATE TABLE IF NOT EXISTS public.trabajos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE SET NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL DEFAULT '09:00',
  ubicacion TEXT,
  estado TEXT NOT NULL DEFAULT 'agendado' CHECK (estado IN ('agendado', 'en_progreso', 'completado', 'cancelado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trabajos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own trabajos" ON public.trabajos
  FOR ALL USING (auth.uid() = user_id);

-- 5. Tabla catalogo_items
CREATE TABLE IF NOT EXISTS public.catalogo_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('material', 'mano_de_obra')),
  precio DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.catalogo_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own catalogo_items" ON public.catalogo_items
  FOR ALL USING (auth.uid() = user_id);

-- 6. Tabla trabajos_items (many-to-many)
CREATE TABLE IF NOT EXISTS public.trabajos_items (
  trabajo_id UUID NOT NULL REFERENCES public.trabajos(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.catalogo_items(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (trabajo_id, item_id)
);

ALTER TABLE public.trabajos_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage trabajos_items via trabajos" ON public.trabajos_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trabajos t
      WHERE t.id = trabajos_items.trabajo_id AND t.user_id = auth.uid()
    )
  );
