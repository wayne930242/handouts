-- Create game_invitations table
CREATE TABLE public.game_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES public.profiles(id),
    is_used BOOLEAN DEFAULT FALSE
);

-- Add indexes
CREATE INDEX idx_game_invitations_game_id ON public.game_invitations(game_id);
CREATE INDEX idx_game_invitations_code ON public.game_invitations(code);

-- Add RLS policies
ALTER TABLE public.game_invitations ENABLE ROW LEVEL SECURITY;

-- Policy to allow insert for authenticated users who are the GM of the game
CREATE POLICY create_invitation ON public.game_invitations
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.games
            WHERE id = game_invitations.game_id AND gm_id = auth.uid()
        )
    );

-- Policy to allow read access for authenticated users
CREATE POLICY read_invitation ON public.game_invitations
    FOR SELECT TO authenticated
    USING (TRUE);

-- Policy to allow update for authenticated users who are the GM of the game
CREATE POLICY update_invitation ON public.game_invitations
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.games
            WHERE id = game_invitations.game_id AND gm_id = auth.uid()
        )
    );

-- Policy to allow delete for authenticated users who are the GM of the game
CREATE POLICY delete_invitation ON public.game_invitations
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.games
            WHERE id = game_invitations.game_id AND gm_id = auth.uid()
        )
    );

-- Create an RPC function to check if an invitation code is valid and not expired
CREATE OR REPLACE FUNCTION public.check_game_invitation(p_code VARCHAR)
RETURNS TABLE (
    is_valid BOOLEAN,
    game_id UUID
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN gi.id IS NOT NULL AND gi.expires_at > now() AND gi.is_used = FALSE 
            THEN TRUE 
            ELSE FALSE 
        END AS is_valid,
        gi.game_id
    FROM public.game_invitations gi
    WHERE gi.code = p_code;
    
    -- If the invitation is valid, mark it as used
    IF FOUND AND (is_valid = TRUE) THEN
        UPDATE public.game_invitations
        SET is_used = TRUE
        WHERE code = p_code;
    END IF;
END;
$$;

-- Grant EXECUTE permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_game_invitation(VARCHAR) TO authenticated;
