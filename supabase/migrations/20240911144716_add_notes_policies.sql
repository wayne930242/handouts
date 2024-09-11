ALTER TABLE public.notes ADD COLUMN is_shared BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_full_access_own_notes" ON public.notes
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "users_read_update_shared_notes" ON public.notes
    FOR SELECT USING (is_shared = TRUE);
  
CREATE POLICY "users_update_shared_notes" ON public.notes
    FOR UPDATE USING (is_shared = TRUE)
    WITH CHECK (is_shared = TRUE);

CREATE POLICY "users_read_public_notes" ON public.notes
    FOR SELECT USING (is_public = TRUE);

CREATE INDEX idx_notes_is_shared ON public.notes (is_shared);

DROP INDEX IF EXISTS idx_notes_owner_id;
CREATE INDEX idx_notes_owner_id_is_public_is_shared ON public.notes (owner_id, is_public, is_shared);
