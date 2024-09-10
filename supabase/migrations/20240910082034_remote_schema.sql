

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."can_modify_chapter"("chapter_id" bigint) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM chapters c
    JOIN campaigns camp ON c.campaign_id = camp.id
    WHERE c.id = chapter_id
      AND (camp.gm_id = auth.uid())
  );
END;
$$;


ALTER FUNCTION "public"."can_modify_chapter"("chapter_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."can_modify_handout"("handout_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM handouts h
    JOIN sections s ON h.section_id = s.id
    JOIN chapters c ON s.chapter_id = c.id
    JOIN campaigns camp ON c.campaign_id = camp.id
    WHERE h.id = handout_id
      AND (camp.gm_id = auth.uid() OR h.owner_id = auth.uid())
  );
END;
$$;


ALTER FUNCTION "public"."can_modify_handout"("handout_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_campaign_passphrase"("campaign_id" "uuid", "input_passphrase" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    stored_passphrase TEXT;
    campaign_gm_id UUID;
    is_player BOOLEAN;
BEGIN
    -- 檢查用戶是否是 GM 或 player
    SELECT c.passphrase, c.gm_id, 
           EXISTS(SELECT 1 FROM campaign_players cp WHERE cp.campaign_id = c.id AND cp.user_id = auth.uid())
    INTO stored_passphrase, campaign_gm_id, is_player
    FROM campaigns c
    WHERE c.id = check_campaign_passphrase.campaign_id;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- 如果用戶是 GM，返回 true
    IF auth.uid() = campaign_gm_id THEN
        RETURN TRUE;
    END IF;

    -- 如果用戶是 player，返回 true
    IF is_player THEN
        RETURN TRUE;
    END IF;

    -- 對於其他用戶，檢查通關密語
    RETURN (COALESCE(stored_passphrase, '') = COALESCE(input_passphrase, ''))
           OR 
           (stored_passphrase IS NULL AND (input_passphrase IS NULL OR input_passphrase = ''));
END;
$$;


ALTER FUNCTION "public"."check_campaign_passphrase"("campaign_id" "uuid", "input_passphrase" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_campaign_passphrase_rpc"("campaign_id" "uuid", "input_passphrase" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN check_campaign_passphrase(campaign_id, input_passphrase);
END;
$$;


ALTER FUNCTION "public"."check_campaign_passphrase_rpc"("campaign_id" "uuid", "input_passphrase" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_doc_passphrase"("doc_id" "text", "input_passphrase" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    stored_passphrase TEXT;
    doc_owner_id UUID;
    is_player BOOLEAN;
BEGIN
    -- 檢查用戶是否是 owner 或 player
    SELECT d.passphrase, d.owner_id, 
           EXISTS(SELECT 1 FROM doc_players dp WHERE dp.doc_id = d.id AND dp.user_id = auth.uid())
    INTO stored_passphrase, doc_owner_id, is_player
    FROM docs d
    WHERE d.id = check_doc_passphrase.doc_id;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- 如果用戶是 owner，返回 true
    IF auth.uid() = doc_owner_id THEN
        RETURN TRUE;
    END IF;

    -- 如果用戶是 player，返回 true
    IF is_player THEN
        RETURN TRUE;
    END IF;

    -- 對於其他用戶，檢查通關密語
    RETURN (COALESCE(stored_passphrase, '') = COALESCE(input_passphrase, ''))
           OR 
           (stored_passphrase IS NULL AND (input_passphrase IS NULL OR input_passphrase = ''));
END;
$$;


ALTER FUNCTION "public"."check_doc_passphrase"("doc_id" "text", "input_passphrase" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_doc_passphrase"("doc_id" "uuid", "input_passphrase" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    stored_passphrase TEXT;
    doc_owner_id UUID;
    is_player BOOLEAN;
BEGIN
    -- 檢查用戶是否是 owner 或 player
    SELECT d.passphrase, d.owner_id, 
           EXISTS(SELECT 1 FROM doc_players dp WHERE dp.doc_id = d.id AND dp.user_id = auth.uid())
    INTO stored_passphrase, doc_owner_id, is_player
    FROM docs d
    WHERE d.id = check_doc_passphrase.doc_id;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- 如果用戶是 owner，返回 true
    IF auth.uid() = doc_owner_id THEN
        RETURN TRUE;
    END IF;

    -- 如果用戶是 player，返回 true
    IF is_player THEN
        RETURN TRUE;
    END IF;

    -- 對於其他用戶，檢查通關密語
    RETURN (COALESCE(stored_passphrase, '') = COALESCE(input_passphrase, ''))
           OR 
           (stored_passphrase IS NULL AND (input_passphrase IS NULL OR input_passphrase = ''));
END;
$$;


ALTER FUNCTION "public"."check_doc_passphrase"("doc_id" "uuid", "input_passphrase" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_doc_passphrase_rpc"("doc_id" "uuid", "input_passphrase" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$BEGIN
  RETURN check_doc_passphrase(doc_id, input_passphrase);
END;$$;


ALTER FUNCTION "public"."check_doc_passphrase_rpc"("doc_id" "uuid", "input_passphrase" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_campaign_owner"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    INSERT INTO public.campaign_players (campaign_id, user_id, role, joined_at)
    VALUES (NEW.id, NEW.gm_id, 'owner', CURRENT_TIMESTAMP);
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_campaign_owner"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_doc_owner"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    INSERT INTO public.doc_players (doc_id, user_id, role, joined_at)
    VALUES (NEW.id, NEW.owner_id, 'owner', CURRENT_TIMESTAMP);
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_doc_owner"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_profile_for_deleted_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  DELETE FROM public.profiles WHERE id = OLD.id;
  RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."delete_profile_for_deleted_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_encrypted_secret_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_purpose" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
    v_encrypted_value TEXT;
BEGIN
    SELECT encrypted_value INTO v_encrypted_value
    FROM encrypted_secrets
    WHERE purpose = p_purpose
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN v_encrypted_value;
END;$$;


ALTER FUNCTION "public"."get_encrypted_secret_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_purpose" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_campaign_limit"("user_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
DECLARE
  limit_value INTEGER;
BEGIN
  SELECT campaign_limit INTO limit_value
  FROM white_list_users
  WHERE user_id = $1;
  
  IF limit_value IS NULL THEN
    RETURN 1; -- 非白名單用戶默認限制為 1
  ELSE
    RETURN limit_value;
  END IF;
END;
$_$;


ALTER FUNCTION "public"."get_user_campaign_limit"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_user_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.profiles (id, email, created_at, updated_at)
        VALUES (NEW.id, NEW.email, NOW(), NOW());
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE public.profiles
        SET email = NEW.email,
            updated_at = NOW()
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_user_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_current_user_whitelisted"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  is_whitelisted BOOLEAN;
  current_user_id UUID;
BEGIN
  -- Get the UUID of the currently authenticated user
  current_user_id := auth.uid();
  
  -- Check if the current user is in the white_list_users table
  SELECT EXISTS (
    SELECT 1
    FROM white_list_users
    WHERE user_id = current_user_id
  ) INTO is_whitelisted;
  
  RETURN is_whitelisted;
END;
$$;


ALTER FUNCTION "public"."is_current_user_whitelisted"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."manage_subscription_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_user_id" "uuid", "p_plan_id" integer, "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone, "p_is_active" boolean, "p_is_auto_renew" boolean, "p_encrypted_token" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
    v_stored_encrypted_token TEXT;
BEGIN
    -- 使用基於哈希的函數獲取存儲的加密令牌
    v_stored_encrypted_token := get_encrypted_secret_992c1b1ea50838a94c0fd3b133c45f6ff808f786bc('subscription_management');

    -- 比較提供的加密令牌與存儲的加密令牌
    IF v_stored_encrypted_token IS NULL OR v_stored_encrypted_token != p_encrypted_token THEN
        RAISE EXCEPTION 'Invalid token';
    END IF;

    -- 更新訂閱信息
    INSERT INTO user_subscriptions (user_id, plan_id, start_date, end_date, is_active, is_auto_renew)
    VALUES (p_user_id, p_plan_id, p_start_date, p_end_date, p_is_active, p_is_auto_renew)
    ON CONFLICT (user_id) DO UPDATE
    SET plan_id = EXCLUDED.plan_id,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        is_active = EXCLUDED.is_active,
        is_auto_renew = EXCLUDED.is_auto_renew;

    RETURN TRUE;
END;$$;


ALTER FUNCTION "public"."manage_subscription_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_user_id" "uuid", "p_plan_id" integer, "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone, "p_is_active" boolean, "p_is_auto_renew" boolean, "p_encrypted_token" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_handout_campaign_id"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.campaign_id := (SELECT campaign_id FROM public.sections WHERE id = NEW.section_id);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_handout_campaign_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_section_campaign_id"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.campaign_id := (SELECT campaign_id FROM public.chapters WHERE id = NEW.chapter_id);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_section_campaign_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."store_encrypted_secret_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_purpose" "text", "p_encrypted_value" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    INSERT INTO encrypted_secrets (purpose, encrypted_value)
    VALUES (p_purpose, p_encrypted_value);
    RETURN TRUE;
END;$$;


ALTER FUNCTION "public"."store_encrypted_secret_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_purpose" "text", "p_encrypted_value" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."bundle_generators" (
    "bundle_id" "uuid" NOT NULL,
    "generator_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bundle_generators" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."campaign_docs" (
    "campaign_id" "uuid" NOT NULL,
    "doc_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."campaign_docs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."campaign_generators" (
    "campaign_id" "uuid" NOT NULL,
    "generator_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."campaign_generators" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."campaign_players" (
    "campaign_id" "uuid" NOT NULL,
    "joined_at" timestamp with time zone,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."campaign_players" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."campaigns" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "gm_id" "uuid",
    "name" character varying NOT NULL,
    "description" "text",
    "passphrase" character varying,
    "status" character varying NOT NULL,
    "banner_url" "text",
    "is_template" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."campaigns" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chapters" (
    "id" bigint NOT NULL,
    "title" character varying NOT NULL,
    "order_num" integer NOT NULL,
    "campaign_id" "uuid",
    "screen_id" "uuid"
);


ALTER TABLE "public"."chapters" OWNER TO "postgres";


ALTER TABLE "public"."chapters" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."chapters_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."chat_sessions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "title" "text",
    "status" "text" DEFAULT 'active'::"text",
    "game_id" "uuid"
);


ALTER TABLE "public"."chat_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chats" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "handout_id" "uuid",
    "is_public" boolean DEFAULT false NOT NULL,
    "message" "text" NOT NULL,
    "session_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."chats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."doc_blocks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "doc_id" "uuid",
    "order_num" integer,
    "title" character varying(255),
    "content" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."doc_blocks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."doc_generators" (
    "doc_id" "uuid" NOT NULL,
    "generator_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."doc_generators" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."doc_players" (
    "user_id" "uuid" NOT NULL,
    "doc_id" "uuid" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."doc_players" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."docs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "owner_id" "uuid",
    "content" "text",
    "passphrase" character varying(255),
    "is_public" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "title" character varying NOT NULL,
    "banner_url" "text",
    "description" "text",
    "type" character varying DEFAULT 'RULE'::character varying NOT NULL
);


ALTER TABLE "public"."docs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."encrypted_secrets" (
    "id" integer NOT NULL,
    "purpose" "text" NOT NULL,
    "encrypted_value" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."encrypted_secrets" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."encrypted_secrets_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."encrypted_secrets_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."encrypted_secrets_id_seq" OWNED BY "public"."encrypted_secrets"."id";



CREATE TABLE IF NOT EXISTS "public"."game_docs" (
    "game_id" "uuid" NOT NULL,
    "doc_id" "uuid" NOT NULL
);


ALTER TABLE "public"."game_docs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."game_players" (
    "game_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."game_players" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."games" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "gm_id" "uuid",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "banner_url" "text",
    "campaign_id" "uuid",
    "screen_id" "uuid"
);


ALTER TABLE "public"."games" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."generator_bundles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "type" character varying DEFAULT 'COMMON'::character varying NOT NULL,
    "is_public" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."generator_bundles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."generator_fields" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "generator_id" "uuid",
    "name" character varying(255) NOT NULL,
    "content" "jsonb" NOT NULL,
    "order_num" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "type" character varying DEFAULT 'TEXT'::character varying NOT NULL
);


ALTER TABLE "public"."generator_fields" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."generators" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "user_id" "uuid",
    "type" character varying DEFAULT 'RANDOM_TABLE'::character varying NOT NULL,
    "is_public" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."generators" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."handout_users" (
    "handout_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."handout_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."handouts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying NOT NULL,
    "content" "text",
    "is_public" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "section_id" bigint NOT NULL,
    "type" character varying,
    "owner_id" "uuid" NOT NULL,
    "note" "text",
    "order_num" integer NOT NULL,
    "campaign_id" "uuid",
    "screen_id" "uuid"
);


ALTER TABLE "public"."handouts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "owner_id" "uuid",
    "game_id" "uuid",
    "order_num" integer,
    "type" character varying(255),
    "content" "text",
    "is_public" boolean DEFAULT false,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "display_name" character varying,
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "email" character varying(255)
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."screen_generators" (
    "screen_id" "uuid" NOT NULL,
    "generator_id" "uuid" NOT NULL
);


ALTER TABLE "public"."screen_generators" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."screens" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."screens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sections" (
    "id" bigint NOT NULL,
    "title" character varying NOT NULL,
    "order_num" integer NOT NULL,
    "chapter_id" bigint NOT NULL,
    "campaign_id" "uuid",
    "screen_id" "uuid"
);


ALTER TABLE "public"."sections" OWNER TO "postgres";


ALTER TABLE "public"."sections" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."sections_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."subscription_plans" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "storage_limit" bigint,
    "campaign_limit" integer,
    "chapter_limit" integer,
    "section_limit" integer
);


ALTER TABLE "public"."subscription_plans" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."subscription_plans_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."subscription_plans_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."subscription_plans_id_seq" OWNED BY "public"."subscription_plans"."id";



CREATE TABLE IF NOT EXISTS "public"."user_campaign_favorites" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "campaign_id" "uuid" NOT NULL,
    "added_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."user_campaign_favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_doc_favorites" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "added_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "doc_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."user_doc_favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_game_favorites" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "game_id" "uuid",
    "added_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."user_game_favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_subscriptions" (
    "user_id" "uuid" NOT NULL,
    "plan_id" integer,
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone,
    "is_active" boolean DEFAULT true NOT NULL,
    "is_auto_renew" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."user_subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."white_list_users" (
    "user_id" "uuid" NOT NULL,
    "campaign_limit" integer DEFAULT 1 NOT NULL
);


ALTER TABLE "public"."white_list_users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."encrypted_secrets" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."encrypted_secrets_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."subscription_plans" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."subscription_plans_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."bundle_generators"
    ADD CONSTRAINT "bundle_generators_pkey" PRIMARY KEY ("bundle_id", "generator_id");



ALTER TABLE ONLY "public"."campaign_docs"
    ADD CONSTRAINT "campaign_docs_pkey" PRIMARY KEY ("campaign_id", "doc_id");



ALTER TABLE ONLY "public"."campaign_generators"
    ADD CONSTRAINT "campaign_generators_pkey" PRIMARY KEY ("campaign_id", "generator_id");



ALTER TABLE ONLY "public"."campaign_players"
    ADD CONSTRAINT "campaign_players_pkey" PRIMARY KEY ("campaign_id", "user_id");



ALTER TABLE ONLY "public"."campaigns"
    ADD CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chapters"
    ADD CONSTRAINT "chapters_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_sessions"
    ADD CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."doc_generators"
    ADD CONSTRAINT "doc_generators_pkey" PRIMARY KEY ("doc_id", "generator_id");



ALTER TABLE ONLY "public"."doc_players"
    ADD CONSTRAINT "doc_players_pkey" PRIMARY KEY ("user_id", "doc_id");



ALTER TABLE ONLY "public"."encrypted_secrets"
    ADD CONSTRAINT "encrypted_secrets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."game_docs"
    ADD CONSTRAINT "game_docs_pkey" PRIMARY KEY ("game_id", "doc_id");



ALTER TABLE ONLY "public"."game_players"
    ADD CONSTRAINT "game_players_pkey" PRIMARY KEY ("game_id", "user_id");



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."generator_bundles"
    ADD CONSTRAINT "generator_bundles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."generator_fields"
    ADD CONSTRAINT "generator_fields_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."generators"
    ADD CONSTRAINT "generators_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."handout_users"
    ADD CONSTRAINT "handout_users_pkey" PRIMARY KEY ("handout_id", "user_id");



ALTER TABLE ONLY "public"."handouts"
    ADD CONSTRAINT "handouts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."doc_blocks"
    ADD CONSTRAINT "rule_blocks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."docs"
    ADD CONSTRAINT "rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."screen_generators"
    ADD CONSTRAINT "screen_generators_pkey" PRIMARY KEY ("screen_id", "generator_id");



ALTER TABLE ONLY "public"."screens"
    ADD CONSTRAINT "screens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_plans"
    ADD CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_campaign_favorites"
    ADD CONSTRAINT "user_campaign_favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_campaign_favorites"
    ADD CONSTRAINT "user_campaign_favorites_user_id_campaign_id_key" UNIQUE ("user_id", "campaign_id");



ALTER TABLE ONLY "public"."user_doc_favorites"
    ADD CONSTRAINT "user_doc_favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_game_favorites"
    ADD CONSTRAINT "user_game_favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_game_favorites"
    ADD CONSTRAINT "user_game_favorites_user_id_game_id_key" UNIQUE ("user_id", "game_id");



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."white_list_users"
    ADD CONSTRAINT "white_list_users_pkey" PRIMARY KEY ("user_id");



CREATE INDEX "idx_bundle_generators_bundle_id" ON "public"."bundle_generators" USING "btree" ("bundle_id");



CREATE INDEX "idx_bundle_generators_generator_id" ON "public"."bundle_generators" USING "btree" ("generator_id");



CREATE INDEX "idx_campaign_docs_campaign_id" ON "public"."campaign_docs" USING "btree" ("campaign_id");



CREATE INDEX "idx_campaign_docs_doc_id" ON "public"."campaign_docs" USING "btree" ("doc_id");



CREATE INDEX "idx_campaign_generators_campaign_id" ON "public"."campaign_generators" USING "btree" ("campaign_id");



CREATE INDEX "idx_campaign_generators_generator_id" ON "public"."campaign_generators" USING "btree" ("generator_id");



CREATE INDEX "idx_chapters_order_num" ON "public"."chapters" USING "btree" ("order_num");



CREATE INDEX "idx_doc_generators_doc_id" ON "public"."doc_generators" USING "btree" ("doc_id");



CREATE INDEX "idx_doc_generators_generator_id" ON "public"."doc_generators" USING "btree" ("generator_id");



CREATE INDEX "idx_generator_fields_generator_id" ON "public"."generator_fields" USING "btree" ("generator_id");



CREATE INDEX "idx_generator_fields_order_num" ON "public"."generator_fields" USING "btree" ("order_num");



CREATE INDEX "idx_generators_user_id" ON "public"."generators" USING "btree" ("user_id");



CREATE INDEX "idx_handout_users" ON "public"."handout_users" USING "btree" ("handout_id");



CREATE INDEX "idx_rule_blocks_rule_id" ON "public"."doc_blocks" USING "btree" ("doc_id");



CREATE INDEX "idx_rules_owner_id" ON "public"."docs" USING "btree" ("owner_id");



CREATE INDEX "idx_sections_order_num" ON "public"."sections" USING "btree" ("order_num");



CREATE INDEX "idx_user_campaign_favorites_campaign_id" ON "public"."user_campaign_favorites" USING "btree" ("campaign_id");



CREATE INDEX "idx_user_campaign_favorites_user_id" ON "public"."user_campaign_favorites" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "campaign_owner_trigger" AFTER INSERT ON "public"."campaigns" FOR EACH ROW EXECUTE FUNCTION "public"."create_campaign_owner"();



CREATE OR REPLACE TRIGGER "doc_owner_trigger" AFTER INSERT ON "public"."docs" FOR EACH ROW EXECUTE FUNCTION "public"."create_doc_owner"();



CREATE OR REPLACE TRIGGER "set_handout_campaign_id_trigger" BEFORE INSERT ON "public"."handouts" FOR EACH ROW EXECUTE FUNCTION "public"."set_handout_campaign_id"();



CREATE OR REPLACE TRIGGER "set_section_campaign_id_trigger" BEFORE INSERT ON "public"."sections" FOR EACH ROW EXECUTE FUNCTION "public"."set_section_campaign_id"();



ALTER TABLE ONLY "public"."bundle_generators"
    ADD CONSTRAINT "bundle_generators_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "public"."generator_bundles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bundle_generators"
    ADD CONSTRAINT "bundle_generators_generator_id_fkey" FOREIGN KEY ("generator_id") REFERENCES "public"."generators"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."campaign_docs"
    ADD CONSTRAINT "campaign_docs_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."campaign_docs"
    ADD CONSTRAINT "campaign_docs_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."campaign_generators"
    ADD CONSTRAINT "campaign_generators_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."campaign_generators"
    ADD CONSTRAINT "campaign_generators_generator_id_fkey" FOREIGN KEY ("generator_id") REFERENCES "public"."generators"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."campaign_players"
    ADD CONSTRAINT "campaign_players_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id");



ALTER TABLE ONLY "public"."campaign_players"
    ADD CONSTRAINT "campaign_players_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."campaign_players"
    ADD CONSTRAINT "campaign_players_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."campaigns"
    ADD CONSTRAINT "campaigns_gm_id_fkey1" FOREIGN KEY ("gm_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chapters"
    ADD CONSTRAINT "chapters_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chapters"
    ADD CONSTRAINT "chapters_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id");



ALTER TABLE ONLY "public"."chat_sessions"
    ADD CONSTRAINT "chat_sessions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id");



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_handout_id_fkey" FOREIGN KEY ("handout_id") REFERENCES "public"."handouts"("id");



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id");



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."doc_blocks"
    ADD CONSTRAINT "doc_blocks_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."doc_generators"
    ADD CONSTRAINT "doc_generators_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."doc_generators"
    ADD CONSTRAINT "doc_generators_generator_id_fkey" FOREIGN KEY ("generator_id") REFERENCES "public"."generators"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."doc_players"
    ADD CONSTRAINT "doc_players_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id");



ALTER TABLE ONLY "public"."doc_players"
    ADD CONSTRAINT "doc_players_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."docs"
    ADD CONSTRAINT "docs_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."game_docs"
    ADD CONSTRAINT "game_docs_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id");



ALTER TABLE ONLY "public"."game_docs"
    ADD CONSTRAINT "game_docs_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id");



ALTER TABLE ONLY "public"."game_players"
    ADD CONSTRAINT "game_players_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."game_players"
    ADD CONSTRAINT "game_players_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id");



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_gm_id_fkey" FOREIGN KEY ("gm_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id");



ALTER TABLE ONLY "public"."generator_bundles"
    ADD CONSTRAINT "generator_bundles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."generator_fields"
    ADD CONSTRAINT "generator_fields_generator_id_fkey" FOREIGN KEY ("generator_id") REFERENCES "public"."generators"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."generators"
    ADD CONSTRAINT "generators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."handout_users"
    ADD CONSTRAINT "handout_users_handout_id_fkey" FOREIGN KEY ("handout_id") REFERENCES "public"."handouts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."handout_users"
    ADD CONSTRAINT "handout_users_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."handouts"
    ADD CONSTRAINT "handouts_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."handouts"
    ADD CONSTRAINT "handouts_owner_id_fkey1" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."handouts"
    ADD CONSTRAINT "handouts_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id");



ALTER TABLE ONLY "public"."handouts"
    ADD CONSTRAINT "handouts_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id");



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."screen_generators"
    ADD CONSTRAINT "screen_generators_generator_id_fkey" FOREIGN KEY ("generator_id") REFERENCES "public"."generators"("id");



ALTER TABLE ONLY "public"."screen_generators"
    ADD CONSTRAINT "screen_generators_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id");



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_campaign_favorites"
    ADD CONSTRAINT "user_campaign_favorites_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_campaign_favorites"
    ADD CONSTRAINT "user_campaign_favorites_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_doc_favorites"
    ADD CONSTRAINT "user_doc_favorites_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id");



ALTER TABLE ONLY "public"."user_doc_favorites"
    ADD CONSTRAINT "user_doc_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."user_game_favorites"
    ADD CONSTRAINT "user_game_favorites_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id");



ALTER TABLE ONLY "public"."user_game_favorites"
    ADD CONSTRAINT "user_game_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id");



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."white_list_users"
    ADD CONSTRAINT "white_list_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



CREATE POLICY "Allow GM to delete handouts" ON "public"."handouts" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM (("public"."sections"
     JOIN "public"."chapters" ON (("sections"."chapter_id" = "chapters"."id")))
     JOIN "public"."campaigns" ON (("chapters"."campaign_id" = "campaigns"."id")))
  WHERE (("sections"."id" = "handouts"."section_id") AND ("campaigns"."gm_id" = "auth"."uid"())))));



CREATE POLICY "Allow GM to insert handouts" ON "public"."handouts" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM (("public"."sections"
     JOIN "public"."chapters" ON (("sections"."chapter_id" = "chapters"."id")))
     JOIN "public"."campaigns" ON (("chapters"."campaign_id" = "campaigns"."id")))
  WHERE (("sections"."id" = "handouts"."section_id") AND ("campaigns"."gm_id" = "auth"."uid"())))));



CREATE POLICY "Allow GM to update handouts" ON "public"."handouts" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM (("public"."sections"
     JOIN "public"."chapters" ON (("sections"."chapter_id" = "chapters"."id")))
     JOIN "public"."campaigns" ON (("chapters"."campaign_id" = "campaigns"."id")))
  WHERE (("sections"."id" = "handouts"."section_id") AND ("campaigns"."gm_id" = "auth"."uid"())))));



CREATE POLICY "Allow GM to view all handouts" ON "public"."handouts" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (("public"."sections"
     JOIN "public"."chapters" ON (("sections"."chapter_id" = "chapters"."id")))
     JOIN "public"."campaigns" ON (("chapters"."campaign_id" = "campaigns"."id")))
  WHERE (("sections"."id" = "handouts"."section_id") AND ("campaigns"."gm_id" = "auth"."uid"())))));



CREATE POLICY "Allow public access to public handouts" ON "public"."handouts" FOR SELECT USING (("is_public" = true));



CREATE POLICY "Owners have full access" ON "public"."docs" USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Permit Everyone Can Select Docs" ON "public"."docs" FOR SELECT USING (true);



CREATE POLICY "Users can delete their own campaign favorites" ON "public"."user_campaign_favorites" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own campaign favorites" ON "public"."user_campaign_favorites" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own campaign favorites" ON "public"."user_campaign_favorites" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."campaigns" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_sessions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "delete_policy" ON "public"."campaigns" FOR DELETE USING (("auth"."uid"() = "gm_id"));



ALTER TABLE "public"."docs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."handouts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "insert_policy" ON "public"."campaigns" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "select_policy" ON "public"."campaigns" FOR SELECT USING (true);



CREATE POLICY "update_policy" ON "public"."campaigns" FOR UPDATE USING (("auth"."uid"() = "gm_id"));



ALTER TABLE "public"."user_campaign_favorites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_subscriptions" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chapters";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."doc_blocks";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."docs";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."handouts";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."notes";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."sections";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
































































































































































































GRANT ALL ON FUNCTION "public"."can_modify_chapter"("chapter_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."can_modify_chapter"("chapter_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."can_modify_chapter"("chapter_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."can_modify_handout"("handout_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."can_modify_handout"("handout_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."can_modify_handout"("handout_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_campaign_passphrase"("campaign_id" "uuid", "input_passphrase" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_campaign_passphrase"("campaign_id" "uuid", "input_passphrase" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_campaign_passphrase"("campaign_id" "uuid", "input_passphrase" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_campaign_passphrase_rpc"("campaign_id" "uuid", "input_passphrase" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_campaign_passphrase_rpc"("campaign_id" "uuid", "input_passphrase" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_campaign_passphrase_rpc"("campaign_id" "uuid", "input_passphrase" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_doc_passphrase"("doc_id" "text", "input_passphrase" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_doc_passphrase"("doc_id" "text", "input_passphrase" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_doc_passphrase"("doc_id" "text", "input_passphrase" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_doc_passphrase"("doc_id" "uuid", "input_passphrase" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_doc_passphrase"("doc_id" "uuid", "input_passphrase" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_doc_passphrase"("doc_id" "uuid", "input_passphrase" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_doc_passphrase_rpc"("doc_id" "uuid", "input_passphrase" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_doc_passphrase_rpc"("doc_id" "uuid", "input_passphrase" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_doc_passphrase_rpc"("doc_id" "uuid", "input_passphrase" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_campaign_owner"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_campaign_owner"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_campaign_owner"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_doc_owner"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_doc_owner"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_doc_owner"() TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_profile_for_deleted_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_profile_for_deleted_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_profile_for_deleted_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_encrypted_secret_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_purpose" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_encrypted_secret_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_purpose" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_encrypted_secret_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_purpose" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_campaign_limit"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_campaign_limit"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_campaign_limit"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_user_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_user_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_user_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_current_user_whitelisted"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_current_user_whitelisted"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_current_user_whitelisted"() TO "service_role";



GRANT ALL ON FUNCTION "public"."manage_subscription_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_user_id" "uuid", "p_plan_id" integer, "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone, "p_is_active" boolean, "p_is_auto_renew" boolean, "p_encrypted_token" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."manage_subscription_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_user_id" "uuid", "p_plan_id" integer, "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone, "p_is_active" boolean, "p_is_auto_renew" boolean, "p_encrypted_token" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."manage_subscription_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_user_id" "uuid", "p_plan_id" integer, "p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone, "p_is_active" boolean, "p_is_auto_renew" boolean, "p_encrypted_token" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_handout_campaign_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_handout_campaign_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_handout_campaign_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_section_campaign_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_section_campaign_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_section_campaign_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."store_encrypted_secret_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_purpose" "text", "p_encrypted_value" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."store_encrypted_secret_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_purpose" "text", "p_encrypted_value" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."store_encrypted_secret_992c1b1ea50838a94c0fd3b133c45f6ff808f786"("p_purpose" "text", "p_encrypted_value" "text") TO "service_role";





















GRANT ALL ON TABLE "public"."bundle_generators" TO "anon";
GRANT ALL ON TABLE "public"."bundle_generators" TO "authenticated";
GRANT ALL ON TABLE "public"."bundle_generators" TO "service_role";



GRANT ALL ON TABLE "public"."campaign_docs" TO "anon";
GRANT ALL ON TABLE "public"."campaign_docs" TO "authenticated";
GRANT ALL ON TABLE "public"."campaign_docs" TO "service_role";



GRANT ALL ON TABLE "public"."campaign_generators" TO "anon";
GRANT ALL ON TABLE "public"."campaign_generators" TO "authenticated";
GRANT ALL ON TABLE "public"."campaign_generators" TO "service_role";



GRANT ALL ON TABLE "public"."campaign_players" TO "anon";
GRANT ALL ON TABLE "public"."campaign_players" TO "authenticated";
GRANT ALL ON TABLE "public"."campaign_players" TO "service_role";



GRANT ALL ON TABLE "public"."campaigns" TO "anon";
GRANT ALL ON TABLE "public"."campaigns" TO "authenticated";
GRANT ALL ON TABLE "public"."campaigns" TO "service_role";



GRANT ALL ON TABLE "public"."chapters" TO "anon";
GRANT ALL ON TABLE "public"."chapters" TO "authenticated";
GRANT ALL ON TABLE "public"."chapters" TO "service_role";



GRANT ALL ON SEQUENCE "public"."chapters_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."chapters_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."chapters_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."chat_sessions" TO "anon";
GRANT ALL ON TABLE "public"."chat_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."chats" TO "anon";
GRANT ALL ON TABLE "public"."chats" TO "authenticated";
GRANT ALL ON TABLE "public"."chats" TO "service_role";



GRANT ALL ON TABLE "public"."doc_blocks" TO "anon";
GRANT ALL ON TABLE "public"."doc_blocks" TO "authenticated";
GRANT ALL ON TABLE "public"."doc_blocks" TO "service_role";



GRANT ALL ON TABLE "public"."doc_generators" TO "anon";
GRANT ALL ON TABLE "public"."doc_generators" TO "authenticated";
GRANT ALL ON TABLE "public"."doc_generators" TO "service_role";



GRANT ALL ON TABLE "public"."doc_players" TO "anon";
GRANT ALL ON TABLE "public"."doc_players" TO "authenticated";
GRANT ALL ON TABLE "public"."doc_players" TO "service_role";



GRANT ALL ON TABLE "public"."docs" TO "anon";
GRANT ALL ON TABLE "public"."docs" TO "authenticated";
GRANT ALL ON TABLE "public"."docs" TO "service_role";



GRANT ALL ON TABLE "public"."encrypted_secrets" TO "anon";
GRANT ALL ON TABLE "public"."encrypted_secrets" TO "authenticated";
GRANT ALL ON TABLE "public"."encrypted_secrets" TO "service_role";



GRANT ALL ON SEQUENCE "public"."encrypted_secrets_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."encrypted_secrets_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."encrypted_secrets_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."game_docs" TO "anon";
GRANT ALL ON TABLE "public"."game_docs" TO "authenticated";
GRANT ALL ON TABLE "public"."game_docs" TO "service_role";



GRANT ALL ON TABLE "public"."game_players" TO "anon";
GRANT ALL ON TABLE "public"."game_players" TO "authenticated";
GRANT ALL ON TABLE "public"."game_players" TO "service_role";



GRANT ALL ON TABLE "public"."games" TO "anon";
GRANT ALL ON TABLE "public"."games" TO "authenticated";
GRANT ALL ON TABLE "public"."games" TO "service_role";



GRANT ALL ON TABLE "public"."generator_bundles" TO "anon";
GRANT ALL ON TABLE "public"."generator_bundles" TO "authenticated";
GRANT ALL ON TABLE "public"."generator_bundles" TO "service_role";



GRANT ALL ON TABLE "public"."generator_fields" TO "anon";
GRANT ALL ON TABLE "public"."generator_fields" TO "authenticated";
GRANT ALL ON TABLE "public"."generator_fields" TO "service_role";



GRANT ALL ON TABLE "public"."generators" TO "anon";
GRANT ALL ON TABLE "public"."generators" TO "authenticated";
GRANT ALL ON TABLE "public"."generators" TO "service_role";



GRANT ALL ON TABLE "public"."handout_users" TO "anon";
GRANT ALL ON TABLE "public"."handout_users" TO "authenticated";
GRANT ALL ON TABLE "public"."handout_users" TO "service_role";



GRANT ALL ON TABLE "public"."handouts" TO "anon";
GRANT ALL ON TABLE "public"."handouts" TO "authenticated";
GRANT ALL ON TABLE "public"."handouts" TO "service_role";



GRANT ALL ON TABLE "public"."notes" TO "anon";
GRANT ALL ON TABLE "public"."notes" TO "authenticated";
GRANT ALL ON TABLE "public"."notes" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."screen_generators" TO "anon";
GRANT ALL ON TABLE "public"."screen_generators" TO "authenticated";
GRANT ALL ON TABLE "public"."screen_generators" TO "service_role";



GRANT ALL ON TABLE "public"."screens" TO "anon";
GRANT ALL ON TABLE "public"."screens" TO "authenticated";
GRANT ALL ON TABLE "public"."screens" TO "service_role";



GRANT ALL ON TABLE "public"."sections" TO "anon";
GRANT ALL ON TABLE "public"."sections" TO "authenticated";
GRANT ALL ON TABLE "public"."sections" TO "service_role";



GRANT ALL ON SEQUENCE "public"."sections_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."sections_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."sections_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."subscription_plans" TO "anon";
GRANT ALL ON TABLE "public"."subscription_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription_plans" TO "service_role";



GRANT ALL ON SEQUENCE "public"."subscription_plans_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."subscription_plans_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."subscription_plans_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_campaign_favorites" TO "anon";
GRANT ALL ON TABLE "public"."user_campaign_favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."user_campaign_favorites" TO "service_role";



GRANT ALL ON TABLE "public"."user_doc_favorites" TO "anon";
GRANT ALL ON TABLE "public"."user_doc_favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."user_doc_favorites" TO "service_role";



GRANT ALL ON TABLE "public"."user_game_favorites" TO "anon";
GRANT ALL ON TABLE "public"."user_game_favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."user_game_favorites" TO "service_role";



GRANT ALL ON TABLE "public"."user_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."user_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."white_list_users" TO "anon";
GRANT ALL ON TABLE "public"."white_list_users" TO "authenticated";
GRANT ALL ON TABLE "public"."white_list_users" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
