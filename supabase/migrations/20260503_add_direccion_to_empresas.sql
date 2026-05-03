-- Migración para añadir columna direccion a empresas (SOL-43)
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS direccion text;
