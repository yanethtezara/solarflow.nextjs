-- Política explícita de borrado para corregir SOL-48
CREATE POLICY "Enable delete for users based on job ownership" 
ON public.trabajos_items 
FOR DELETE 
USING (
  trabajo_id IN (
    SELECT id FROM public.trabajos WHERE user_id = auth.uid()
  )
);
