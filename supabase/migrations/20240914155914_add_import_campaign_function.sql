CREATE OR REPLACE FUNCTION public.import_campaign(
  p_campaign_data jsonb,
  p_game_id uuid DEFAULT NULL
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
BEGIN
  -- Insert campaign
  INSERT INTO campaigns (name, description, gm_id, status)
  VALUES (
    p_campaign_data->>'name',
    p_campaign_data->>'description',
    (p_campaign_data->>'gm_id')::uuid,
    p_campaign_data->>'status'
  )
  RETURNING id INTO v_campaign_id;

  -- Update game if game_id is provided
  IF p_game_id IS NOT NULL THEN
    UPDATE games SET campaign_id = v_campaign_id WHERE id = p_game_id;
  END IF;

  -- Insert chapters, sections, and handouts
  FOR v_chapter IN SELECT jsonb_array_elements(p_campaign_data->'chapters')
  LOOP
    INSERT INTO chapters (campaign_id, title, order_num)
    VALUES (v_campaign_id, v_chapter->>'title', (v_chapter->>'order_num')::int)
    RETURNING id INTO v_chapter_id;

    FOR v_section IN SELECT jsonb_array_elements(v_chapter->'sections')
    LOOP
      INSERT INTO sections (campaign_id, chapter_id, title, order_num)
      VALUES (v_campaign_id, v_chapter_id, v_section->>'title', (v_section->>'order_num')::int)
      RETURNING id INTO v_section_id;

      FOR v_handout IN SELECT jsonb_array_elements(v_section->'handouts')
      LOOP
        INSERT INTO handouts (campaign_id, section_id, title, content, is_public, type, owner_id, note, order_num)
        VALUES (
          v_campaign_id,
          v_section_id,
          v_handout->>'title',
          v_handout->>'content',
          false,
          v_handout->>'type',
          (v_handout->>'owner_id')::uuid,
          v_handout->>'note',
          (v_handout->>'order_num')::int
        )
        RETURNING id INTO v_handout_id;
      END LOOP;
    END LOOP;
  END LOOP;

  -- Prepare result
  SELECT jsonb_build_object(
    'id', v_campaign_id,
    'name', p_campaign_data->>'name',
    'description', p_campaign_data->>'description',
    'gm_id', p_campaign_data->>'gm_id',
    'status', p_campaign_data->>'status',
    'chapters', p_campaign_data->'chapters'
  ) INTO v_result;

  RETURN v_result;
END;
$$;
