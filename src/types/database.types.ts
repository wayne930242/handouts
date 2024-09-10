export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bundle_generators: {
        Row: {
          bundle_id: string
          created_at: string | null
          generator_id: string
        }
        Insert: {
          bundle_id: string
          created_at?: string | null
          generator_id: string
        }
        Update: {
          bundle_id?: string
          created_at?: string | null
          generator_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_generators_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "generator_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_generators_generator_id_fkey"
            columns: ["generator_id"]
            isOneToOne: false
            referencedRelation: "generators"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_docs: {
        Row: {
          campaign_id: string
          created_at: string | null
          doc_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          doc_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          doc_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_docs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_docs_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "docs"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_generators: {
        Row: {
          campaign_id: string
          created_at: string | null
          generator_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          generator_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          generator_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_generators_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_generators_generator_id_fkey"
            columns: ["generator_id"]
            isOneToOne: false
            referencedRelation: "generators"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_players: {
        Row: {
          campaign_id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          campaign_id: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          campaign_id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_players_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_players_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          gm_id: string | null
          id: string
          is_template: boolean
          name: string
          passphrase: string | null
          status: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          gm_id?: string | null
          id?: string
          is_template?: boolean
          name: string
          passphrase?: string | null
          status: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          gm_id?: string | null
          id?: string
          is_template?: boolean
          name?: string
          passphrase?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_gm_id_fkey1"
            columns: ["gm_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          campaign_id: string | null
          id: number
          order_num: number
          screen_id: string | null
          title: string
        }
        Insert: {
          campaign_id?: string | null
          id?: number
          order_num: number
          screen_id?: string | null
          title: string
        }
        Update: {
          campaign_id?: string | null
          id?: number
          order_num?: number
          screen_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapters_screen_id_fkey"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          game_id: string | null
          id: string
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string | null
          handout_id: string | null
          id: string
          is_public: boolean
          message: string
          session_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          handout_id?: string | null
          id?: string
          is_public?: boolean
          message: string
          session_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          handout_id?: string | null
          id?: string
          is_public?: boolean
          message?: string
          session_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_handout_id_fkey"
            columns: ["handout_id"]
            isOneToOne: false
            referencedRelation: "handouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doc_blocks: {
        Row: {
          content: string | null
          created_at: string | null
          doc_id: string | null
          id: string
          order_num: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          doc_id?: string | null
          id?: string
          order_num?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          doc_id?: string | null
          id?: string
          order_num?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doc_blocks_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "docs"
            referencedColumns: ["id"]
          },
        ]
      }
      doc_generators: {
        Row: {
          created_at: string | null
          doc_id: string
          generator_id: string
        }
        Insert: {
          created_at?: string | null
          doc_id: string
          generator_id: string
        }
        Update: {
          created_at?: string | null
          doc_id?: string
          generator_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doc_generators_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doc_generators_generator_id_fkey"
            columns: ["generator_id"]
            isOneToOne: false
            referencedRelation: "generators"
            referencedColumns: ["id"]
          },
        ]
      }
      doc_players: {
        Row: {
          doc_id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          doc_id: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          doc_id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doc_players_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doc_players_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      docs: {
        Row: {
          banner_url: string | null
          content: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          owner_id: string | null
          passphrase: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          owner_id?: string | null
          passphrase?: string | null
          title: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          owner_id?: string | null
          passphrase?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "docs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      encrypted_secrets: {
        Row: {
          created_at: string | null
          encrypted_value: string
          id: number
          purpose: string
        }
        Insert: {
          created_at?: string | null
          encrypted_value: string
          id?: number
          purpose: string
        }
        Update: {
          created_at?: string | null
          encrypted_value?: string
          id?: number
          purpose?: string
        }
        Relationships: []
      }
      game_docs: {
        Row: {
          doc_id: string
          game_id: string
        }
        Insert: {
          doc_id: string
          game_id: string
        }
        Update: {
          doc_id?: string
          game_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_docs_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_docs_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_invitations: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          expires_at: string
          game_id: string
          id: string
          is_used: boolean | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          expires_at: string
          game_id: string
          id?: string
          is_used?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string
          game_id?: string
          id?: string
          is_used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "game_invitations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_invitations_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_players: {
        Row: {
          game_id: string
          user_id: string
        }
        Insert: {
          game_id: string
          user_id: string
        }
        Update: {
          game_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_players_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          banner_url: string | null
          campaign_id: string | null
          created_at: string | null
          description: string | null
          gm_id: string | null
          id: string
          screen_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          campaign_id?: string | null
          created_at?: string | null
          description?: string | null
          gm_id?: string | null
          id?: string
          screen_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          campaign_id?: string | null
          created_at?: string | null
          description?: string | null
          gm_id?: string | null
          id?: string
          screen_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_gm_id_fkey"
            columns: ["gm_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_screen_id_fkey"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
        ]
      }
      generator_bundles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean
          name: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generator_bundles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generator_fields: {
        Row: {
          content: Json
          created_at: string | null
          generator_id: string | null
          id: string
          name: string
          order_num: number
          type: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          generator_id?: string | null
          id?: string
          name: string
          order_num: number
          type?: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          generator_id?: string | null
          id?: string
          name?: string
          order_num?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "generator_fields_generator_id_fkey"
            columns: ["generator_id"]
            isOneToOne: false
            referencedRelation: "generators"
            referencedColumns: ["id"]
          },
        ]
      }
      generators: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean
          name: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      handout_users: {
        Row: {
          handout_id: string
          user_id: string
        }
        Insert: {
          handout_id: string
          user_id: string
        }
        Update: {
          handout_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "handout_users_handout_id_fkey"
            columns: ["handout_id"]
            isOneToOne: false
            referencedRelation: "handouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "handout_users_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      handouts: {
        Row: {
          campaign_id: string | null
          content: string | null
          created_at: string | null
          id: string
          is_public: boolean | null
          note: string | null
          order_num: number
          owner_id: string
          screen_id: string | null
          section_id: number
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          note?: string | null
          order_num: number
          owner_id: string
          screen_id?: string | null
          section_id: number
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          note?: string | null
          order_num?: number
          owner_id?: string
          screen_id?: string | null
          section_id?: number
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "handouts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "handouts_owner_id_fkey1"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "handouts_screen_id_fkey"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "handouts_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string | null
          created_at: string | null
          game_id: string | null
          id: string
          is_public: boolean | null
          metadata: Json | null
          order_num: number | null
          owner_id: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          game_id?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          order_num?: number | null
          owner_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          game_id?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          order_num?: number | null
          owner_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      screen_generators: {
        Row: {
          generator_id: string
          screen_id: string
        }
        Insert: {
          generator_id: string
          screen_id: string
        }
        Update: {
          generator_id?: string
          screen_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "screen_generators_generator_id_fkey"
            columns: ["generator_id"]
            isOneToOne: false
            referencedRelation: "generators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "screen_generators_screen_id_fkey"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
        ]
      }
      screens: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sections: {
        Row: {
          campaign_id: string | null
          chapter_id: number
          id: number
          order_num: number
          screen_id: string | null
          title: string
        }
        Insert: {
          campaign_id?: string | null
          chapter_id: number
          id?: number
          order_num: number
          screen_id?: string | null
          title: string
        }
        Update: {
          campaign_id?: string | null
          chapter_id?: number
          id?: number
          order_num?: number
          screen_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_screen_id_fkey"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          campaign_limit: number | null
          chapter_limit: number | null
          id: number
          name: string
          section_limit: number | null
          storage_limit: number | null
        }
        Insert: {
          campaign_limit?: number | null
          chapter_limit?: number | null
          id?: number
          name: string
          section_limit?: number | null
          storage_limit?: number | null
        }
        Update: {
          campaign_limit?: number | null
          chapter_limit?: number | null
          id?: number
          name?: string
          section_limit?: number | null
          storage_limit?: number | null
        }
        Relationships: []
      }
      user_campaign_favorites: {
        Row: {
          added_at: string | null
          campaign_id: string
          id: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          campaign_id: string
          id?: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          campaign_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_campaign_favorites_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_campaign_favorites_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_doc_favorites: {
        Row: {
          added_at: string | null
          doc_id: string
          id: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          doc_id: string
          id?: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          doc_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_doc_favorites_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_doc_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_game_favorites: {
        Row: {
          added_at: string | null
          game_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          game_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          game_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_game_favorites_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_game_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          end_date: string | null
          is_active: boolean
          is_auto_renew: boolean
          plan_id: number | null
          start_date: string
          user_id: string
        }
        Insert: {
          end_date?: string | null
          is_active?: boolean
          is_auto_renew?: boolean
          plan_id?: number | null
          start_date: string
          user_id: string
        }
        Update: {
          end_date?: string | null
          is_active?: boolean
          is_auto_renew?: boolean
          plan_id?: number | null
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      white_list_users: {
        Row: {
          campaign_limit: number
          user_id: string
        }
        Insert: {
          campaign_limit?: number
          user_id: string
        }
        Update: {
          campaign_limit?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "white_list_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_modify_chapter: {
        Args: {
          chapter_id: number
        }
        Returns: boolean
      }
      can_modify_handout: {
        Args: {
          handout_id: string
        }
        Returns: boolean
      }
      check_campaign_passphrase: {
        Args: {
          campaign_id: string
          input_passphrase: string
        }
        Returns: boolean
      }
      check_campaign_passphrase_rpc: {
        Args: {
          campaign_id: string
          input_passphrase: string
        }
        Returns: boolean
      }
      check_doc_passphrase:
        | {
            Args: {
              doc_id: string
              input_passphrase: string
            }
            Returns: boolean
          }
        | {
            Args: {
              doc_id: string
              input_passphrase: string
            }
            Returns: boolean
          }
      check_doc_passphrase_rpc: {
        Args: {
          doc_id: string
          input_passphrase: string
        }
        Returns: boolean
      }
      check_game_invitation: {
        Args: {
          p_code: string
        }
        Returns: {
          is_valid: boolean
          game_id: string
        }[]
      }
      get_encrypted_secret_992c1b1ea50838a94c0fd3b133c45f6ff808f786: {
        Args: {
          p_purpose: string
        }
        Returns: string
      }
      get_user_campaign_limit: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      is_current_user_whitelisted: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      manage_subscription_992c1b1ea50838a94c0fd3b133c45f6ff808f786: {
        Args: {
          p_user_id: string
          p_plan_id: number
          p_start_date: string
          p_end_date: string
          p_is_active: boolean
          p_is_auto_renew: boolean
          p_encrypted_token: string
        }
        Returns: boolean
      }
      store_encrypted_secret_992c1b1ea50838a94c0fd3b133c45f6ff808f786: {
        Args: {
          p_purpose: string
          p_encrypted_value: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
