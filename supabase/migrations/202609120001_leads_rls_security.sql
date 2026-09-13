DO $$
BEGIN
  IF to_regclass('public.leads') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Authenticated users can read leads" ON public.leads;
    DROP POLICY IF EXISTS "Backend manages leads" ON public.leads;
    ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
  END IF;

  IF to_regclass('public.lead_notes') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can read lead notes" ON public.lead_notes;
    DROP POLICY IF EXISTS "Backend manages lead notes" ON public.lead_notes;
    ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;
