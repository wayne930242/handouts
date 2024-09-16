CREATE OR REPLACE FUNCTION public.import_campaign_by_id(
  p_campaign_id uuid,
  p_game_id uuid DEFAULT NULL,
  p_target_campaign_id uuid DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_campaign_data jsonb;
BEGIN
  -- Step 1: Retrieve the campaign data from the `campaigns`, `chapters`, `sections`, and `handouts` tables
  SELECT jsonb_build_object(
    'name', c.name,
    'description', c.description,
    'gm_id', c.gm_id::text,
    'status', c.status,
    'chapters', (
      SELECT jsonb_agg(jsonb_build_object(
        'title', ch.title,
        'sections', (
          SELECT jsonb_agg(jsonb_build_object(
            'title', s.title,
            'handouts', (
              SELECT jsonb_agg(jsonb_build_object(
                'title', h.title,
                'content', h.content,
                'type', h.type,
                'owner_id', h.owner_id::text,
                'note', h.note
              ))
              FROM handouts h
              WHERE h.section_id = s.id
            )
          ))
          FROM sections s
          WHERE s.chapter_id = ch.id
        )
      ))
      FROM chapters ch
      WHERE ch.campaign_id = c.id
    )
  ) INTO v_campaign_data
  FROM campaigns c
  WHERE c.id = p_campaign_id;

  -- Step 2: Call the existing `import_campaign` function
  RETURN public.import_campaign(v_campaign_data, p_game_id, p_target_campaign_id);
END;
$$;

GRANT ALL ON FUNCTION "public"."import_campaign_by_id"("p_campaign_id" uuid, "p_game_id" uuid, "p_target_campaign_id" uuid) TO "anon";
GRANT ALL ON FUNCTION "public"."import_campaign_by_id"("p_campaign_id" uuid, "p_game_id" uuid, "p_target_campaign_id" uuid) TO "authenticated";
GRANT ALL ON FUNCTION "public"."import_campaign_by_id"("p_campaign_id" uuid, "p_game_id" uuid, "p_target_campaign_id" uuid) TO "service_role";
