-- Migration file: 20240916_add_in_game_to_campaigns.sql

-- Add in_game column to campaigns table
ALTER TABLE public.campaigns ADD COLUMN in_game BOOLEAN DEFAULT FALSE;

-- Update existing campaigns
UPDATE public.campaigns SET in_game = FALSE;

-- Add comment to the new column
COMMENT ON COLUMN public.campaigns.in_game IS 'Indicates whether the campaign is currently in an active game';

-- Create an index on the new column for better query performance
CREATE INDEX idx_campaigns_in_game ON public.campaigns (in_game);


-- Recreate the function with updated logic
CREATE OR REPLACE FUNCTION public.import_campaign(
  p_campaign_data jsonb,
  p_game_id uuid DEFAULT NULL,
  p_target_campaign_id uuid DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_campaign_id uuid;
  v_chapter_id bigint;
  v_section_id bigint;
  v_handout_id uuid;
  v_chapter jsonb;
  v_section jsonb;
  v_handout jsonb;
  v_result jsonb;
  v_in_game boolean;
BEGIN
  -- Set in_game to true if game_id is provided
  v_in_game := p_game_id IS NOT NULL;

  -- Step 1: Check if game_id is provided and try to get the campaign_id from the games table
  IF p_game_id IS NOT NULL THEN
    SELECT campaign_id INTO v_campaign_id FROM games WHERE id = p_game_id;
  END IF;

  -- Step 2: If target_campaign_id is provided, use it as campaign_id
  IF p_target_campaign_id IS NOT NULL THEN
    v_campaign_id := p_target_campaign_id;
  END IF;

  -- Step 3: If a campaign_id is found, perform an UPDATE; otherwise, perform an INSERT
  IF v_campaign_id IS NOT NULL THEN
    -- Update existing campaign
    UPDATE campaigns
    SET 
      name = p_campaign_data->>'name',
      description = p_campaign_data->>'description',
      gm_id = (p_campaign_data->>'gm_id')::uuid,
      status = p_campaign_data->>'status',
      in_game = v_in_game
    WHERE id = v_campaign_id;
  ELSE
    -- Insert new campaign
    INSERT INTO campaigns (name, description, gm_id, status, in_game)
    VALUES (
      p_campaign_data->>'name',
      p_campaign_data->>'description',
      (p_campaign_data->>'gm_id')::uuid,
      p_campaign_data->>'status',
      v_in_game
    )
    RETURNING id INTO v_campaign_id;
  END IF;

  -- Step 4: If game_id is provided and the game is not already linked to a campaign, update the games table
  IF p_game_id IS NOT NULL AND v_campaign_id IS NOT NULL THEN
    UPDATE games
    SET campaign_id = v_campaign_id
    WHERE id = p_game_id AND campaign_id IS NULL;
  END IF;

  -- Step 5: Insert chapters, sections, and handouts (always insert new data)
  FOR v_chapter IN SELECT jsonb_array_elements(p_campaign_data->'chapters')
  LOOP
    INSERT INTO chapters (campaign_id, title)
    VALUES (v_campaign_id, v_chapter->>'title')
    RETURNING id INTO v_chapter_id;

    FOR v_section IN SELECT jsonb_array_elements(v_chapter->'sections')
    LOOP
      INSERT INTO sections (campaign_id, chapter_id, title)
      VALUES (v_campaign_id, v_chapter_id, v_section->>'title')
      RETURNING id INTO v_section_id;

      FOR v_handout IN SELECT jsonb_array_elements(v_section->'handouts')
      LOOP
        INSERT INTO handouts (campaign_id, section_id, title, content, is_public, type, owner_id, note)
        VALUES (
          v_campaign_id,
          v_section_id,
          v_handout->>'title',
          v_handout->>'content',
          false,
          v_handout->>'type',
          (v_handout->>'owner_id')::uuid,
          v_handout->>'note'
        )
        RETURNING id INTO v_handout_id;
      END LOOP;
    END LOOP;
  END LOOP;

  -- Step 6: Prepare the result
  SELECT jsonb_build_object(
    'id', v_campaign_id,
    'name', p_campaign_data->>'name',
    'description', p_campaign_data->>'description',
    'gm_id', p_campaign_data->>'gm_id',
    'status', p_campaign_data->>'status',
    'in_game', v_in_game,
    'chapters', p_campaign_data->'chapters'
  ) INTO v_result;

  RETURN v_result;
END;
$$;
