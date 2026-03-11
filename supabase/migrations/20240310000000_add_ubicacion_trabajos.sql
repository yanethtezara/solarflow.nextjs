-- Add ubicacion column to trabajos (required by EPIC-SOL-22)
ALTER TABLE public.trabajos ADD COLUMN IF NOT EXISTS ubicacion TEXT;
