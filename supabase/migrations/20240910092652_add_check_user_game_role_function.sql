-- Create an RPC function to check if a user is a GM or player of a game
CREATE OR REPLACE FUNCTION public.check_user_game_role(p_user_id UUID, p_game_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    is_gm BOOLEAN;
    is_player BOOLEAN;
BEGIN
    -- Check if the user is the GM of the game
    SELECT (gm_id = p_user_id) INTO is_gm
    FROM games
    WHERE id = p_game_id;

    -- If the user is the GM, return true
    IF is_gm THEN
        RETURN TRUE;
    END IF;

    -- Check if the user is a player in the game
    SELECT EXISTS (
        SELECT 1
        FROM game_players
        WHERE game_id = p_game_id AND user_id = p_user_id
    ) INTO is_player;

    -- Return the result (true if the user is a player, false otherwise)
    RETURN is_player;
END;
$$;

-- Grant EXECUTE permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_user_game_role(UUID, UUID) TO authenticated;
