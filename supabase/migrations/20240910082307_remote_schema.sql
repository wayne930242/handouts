create table "auth"."campaign_players" (
    "user_id" uuid not null,
    "campaign_id" uuid not null,
    "joined_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "role" character varying not null
);


create table "auth"."campaign_users" (
    "campaign_id" uuid not null,
    "user_id" uuid not null
);


alter table "auth"."campaign_users" enable row level security;

create table "auth"."chats" (
    "id" uuid not null default uuid_generate_v4(),
    "session_id" uuid not null,
    "user_id" uuid not null,
    "message" text not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "is_public" boolean not null default true,
    "handout_id" uuid
);


alter table "auth"."chats" enable row level security;

create table "auth"."user_doc_favorites" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "doc_id" uuid not null,
    "added_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "auth"."user_doc_favorites" enable row level security;

CREATE UNIQUE INDEX campaign_players_pkey ON auth.campaign_players USING btree (user_id, campaign_id);

CREATE UNIQUE INDEX campaign_users_pkey ON auth.campaign_users USING btree (campaign_id, user_id);

CREATE UNIQUE INDEX chat_pkey ON auth.chats USING btree (id);

CREATE INDEX idx_campaign_users_campaign_id ON auth.campaign_users USING btree (campaign_id);

CREATE INDEX idx_campaign_users_user_id ON auth.campaign_users USING btree (user_id);

CREATE INDEX idx_chat_session_id ON auth.chats USING btree (session_id);

CREATE INDEX idx_chat_user_id ON auth.chats USING btree (user_id);

CREATE INDEX idx_user_doc_favorites_doc_id ON auth.user_doc_favorites USING btree (doc_id);

CREATE INDEX idx_user_doc_favorites_user_id ON auth.user_doc_favorites USING btree (user_id);

CREATE UNIQUE INDEX user_doc_favorites_pkey ON auth.user_doc_favorites USING btree (id);

CREATE UNIQUE INDEX user_doc_favorites_user_id_doc_id_key ON auth.user_doc_favorites USING btree (user_id, doc_id);

alter table "auth"."campaign_players" add constraint "campaign_players_pkey" PRIMARY KEY using index "campaign_players_pkey";

alter table "auth"."campaign_users" add constraint "campaign_users_pkey" PRIMARY KEY using index "campaign_users_pkey";

alter table "auth"."chats" add constraint "chat_pkey" PRIMARY KEY using index "chat_pkey";

alter table "auth"."user_doc_favorites" add constraint "user_doc_favorites_pkey" PRIMARY KEY using index "user_doc_favorites_pkey";

alter table "auth"."campaign_players" add constraint "campaign_players_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "auth"."campaign_players" validate constraint "campaign_players_campaign_id_fkey";

alter table "auth"."campaign_players" add constraint "campaign_players_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "auth"."campaign_players" validate constraint "campaign_players_user_id_fkey";

alter table "auth"."campaign_players" add constraint "campaign_players_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "auth"."campaign_players" validate constraint "campaign_players_user_id_fkey1";

alter table "auth"."campaign_users" add constraint "campaign_users_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "auth"."campaign_users" validate constraint "campaign_users_campaign_id_fkey";

alter table "auth"."campaign_users" add constraint "campaign_users_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "auth"."campaign_users" validate constraint "campaign_users_user_id_fkey1";

alter table "auth"."chats" add constraint "chat_session_id_fkey" FOREIGN KEY (session_id) REFERENCES chat_sessions(id) not valid;

alter table "auth"."chats" validate constraint "chat_session_id_fkey";

alter table "auth"."chats" add constraint "chats_handout_id_fkey" FOREIGN KEY (handout_id) REFERENCES handouts(id) not valid;

alter table "auth"."chats" validate constraint "chats_handout_id_fkey";

alter table "auth"."chats" add constraint "chats_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "auth"."chats" validate constraint "chats_user_id_fkey";

alter table "auth"."user_doc_favorites" add constraint "user_doc_favorites_doc_id_fkey" FOREIGN KEY (doc_id) REFERENCES docs(id) ON DELETE CASCADE not valid;

alter table "auth"."user_doc_favorites" validate constraint "user_doc_favorites_doc_id_fkey";

alter table "auth"."user_doc_favorites" add constraint "user_doc_favorites_user_id_doc_id_key" UNIQUE using index "user_doc_favorites_user_id_doc_id_key";

alter table "auth"."user_doc_favorites" add constraint "user_doc_favorites_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "auth"."user_doc_favorites" validate constraint "user_doc_favorites_user_id_fkey1";

grant delete on table "auth"."campaign_players" to "anon";

grant insert on table "auth"."campaign_players" to "anon";

grant references on table "auth"."campaign_players" to "anon";

grant select on table "auth"."campaign_players" to "anon";

grant trigger on table "auth"."campaign_players" to "anon";

grant truncate on table "auth"."campaign_players" to "anon";

grant update on table "auth"."campaign_players" to "anon";

grant delete on table "auth"."campaign_players" to "authenticated";

grant insert on table "auth"."campaign_players" to "authenticated";

grant references on table "auth"."campaign_players" to "authenticated";

grant select on table "auth"."campaign_players" to "authenticated";

grant trigger on table "auth"."campaign_players" to "authenticated";

grant truncate on table "auth"."campaign_players" to "authenticated";

grant update on table "auth"."campaign_players" to "authenticated";

grant delete on table "auth"."campaign_players" to "service_role";

grant insert on table "auth"."campaign_players" to "service_role";

grant references on table "auth"."campaign_players" to "service_role";

grant select on table "auth"."campaign_players" to "service_role";

grant trigger on table "auth"."campaign_players" to "service_role";

grant truncate on table "auth"."campaign_players" to "service_role";

grant update on table "auth"."campaign_players" to "service_role";

grant delete on table "auth"."campaign_users" to "anon";

grant insert on table "auth"."campaign_users" to "anon";

grant references on table "auth"."campaign_users" to "anon";

grant select on table "auth"."campaign_users" to "anon";

grant trigger on table "auth"."campaign_users" to "anon";

grant truncate on table "auth"."campaign_users" to "anon";

grant update on table "auth"."campaign_users" to "anon";

grant delete on table "auth"."campaign_users" to "authenticated";

grant insert on table "auth"."campaign_users" to "authenticated";

grant references on table "auth"."campaign_users" to "authenticated";

grant select on table "auth"."campaign_users" to "authenticated";

grant trigger on table "auth"."campaign_users" to "authenticated";

grant truncate on table "auth"."campaign_users" to "authenticated";

grant update on table "auth"."campaign_users" to "authenticated";

grant delete on table "auth"."campaign_users" to "service_role";

grant insert on table "auth"."campaign_users" to "service_role";

grant references on table "auth"."campaign_users" to "service_role";

grant select on table "auth"."campaign_users" to "service_role";

grant trigger on table "auth"."campaign_users" to "service_role";

grant truncate on table "auth"."campaign_users" to "service_role";

grant update on table "auth"."campaign_users" to "service_role";

grant delete on table "auth"."chats" to "anon";

grant insert on table "auth"."chats" to "anon";

grant references on table "auth"."chats" to "anon";

grant select on table "auth"."chats" to "anon";

grant trigger on table "auth"."chats" to "anon";

grant truncate on table "auth"."chats" to "anon";

grant update on table "auth"."chats" to "anon";

grant delete on table "auth"."chats" to "authenticated";

grant insert on table "auth"."chats" to "authenticated";

grant references on table "auth"."chats" to "authenticated";

grant select on table "auth"."chats" to "authenticated";

grant trigger on table "auth"."chats" to "authenticated";

grant truncate on table "auth"."chats" to "authenticated";

grant update on table "auth"."chats" to "authenticated";

grant delete on table "auth"."chats" to "service_role";

grant insert on table "auth"."chats" to "service_role";

grant references on table "auth"."chats" to "service_role";

grant select on table "auth"."chats" to "service_role";

grant trigger on table "auth"."chats" to "service_role";

grant truncate on table "auth"."chats" to "service_role";

grant update on table "auth"."chats" to "service_role";

grant delete on table "auth"."user_doc_favorites" to "anon";

grant insert on table "auth"."user_doc_favorites" to "anon";

grant references on table "auth"."user_doc_favorites" to "anon";

grant select on table "auth"."user_doc_favorites" to "anon";

grant trigger on table "auth"."user_doc_favorites" to "anon";

grant truncate on table "auth"."user_doc_favorites" to "anon";

grant update on table "auth"."user_doc_favorites" to "anon";

grant delete on table "auth"."user_doc_favorites" to "authenticated";

grant insert on table "auth"."user_doc_favorites" to "authenticated";

grant references on table "auth"."user_doc_favorites" to "authenticated";

grant select on table "auth"."user_doc_favorites" to "authenticated";

grant trigger on table "auth"."user_doc_favorites" to "authenticated";

grant truncate on table "auth"."user_doc_favorites" to "authenticated";

grant update on table "auth"."user_doc_favorites" to "authenticated";

grant delete on table "auth"."user_doc_favorites" to "service_role";

grant insert on table "auth"."user_doc_favorites" to "service_role";

grant references on table "auth"."user_doc_favorites" to "service_role";

grant select on table "auth"."user_doc_favorites" to "service_role";

grant trigger on table "auth"."user_doc_favorites" to "service_role";

grant truncate on table "auth"."user_doc_favorites" to "service_role";

grant update on table "auth"."user_doc_favorites" to "service_role";

create policy "Users can delete their own doc favorites"
on "auth"."user_doc_favorites"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own doc favorites"
on "auth"."user_doc_favorites"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can view their own doc favorites"
on "auth"."user_doc_favorites"
as permissive
for select
to public
using ((auth.uid() = user_id));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_user_changes();

CREATE TRIGGER on_auth_user_deleted BEFORE DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION delete_profile_for_deleted_user();

CREATE TRIGGER on_auth_user_updated AFTER UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_user_changes();


create policy "Allow anonymous access to all files in images bucket"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'images'::text) AND (auth.role() = 'anon'::text)));


create policy "Allow upload for whitelisted users only"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'images'::text) AND (auth.uid() IN ( SELECT white_list_users.user_id
   FROM white_list_users))));



