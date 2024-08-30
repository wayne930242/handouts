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
      campaign_users: {
        Row: {
          campaign_id: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_users_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          description: string | null
          gm_id: string | null
          id: string
          name: string
          passphrase: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          gm_id?: string | null
          id?: string
          name: string
          passphrase?: string | null
          status: string
        }
        Update: {
          created_at?: string
          description?: string | null
          gm_id?: string | null
          id?: string
          name?: string
          passphrase?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_gm_id_fkey"
            columns: ["gm_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          campaign_id: string
          id: number
          order_num: number
          title: string
        }
        Insert: {
          campaign_id: string
          id?: number
          order_num: number
          title: string
        }
        Update: {
          campaign_id?: string
          id?: number
          order_num?: number
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
        ]
      }
      chat_sessions: {
        Row: {
          campaign_id: string
          created_at: string | null
          id: string
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          id?: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          id?: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
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
            foreignKeyName: "chat_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_handout_id_fkey"
            columns: ["handout_id"]
            isOneToOne: false
            referencedRelation: "handouts"
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
            foreignKeyName: "handout_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      handouts: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_public: boolean | null
          note: string | null
          order_num: number
          owner_id: string
          section_id: number | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          note?: string | null
          order_num: number
          owner_id: string
          section_id?: number | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          note?: string | null
          order_num?: number
          owner_id?: string
          section_id?: number | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "handouts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
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
      rule_blocks: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          order_num: number | null
          rule_id: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          order_num?: number | null
          rule_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          order_num?: number | null
          rule_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rule_blocks_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "rules"
            referencedColumns: ["id"]
          },
        ]
      }
      rules: {
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
          updated_at?: string | null
        }
        Relationships: []
      }
      sections: {
        Row: {
          chapter_id: number | null
          id: number
          order_num: number
          title: string
        }
        Insert: {
          chapter_id?: number | null
          id?: number
          order_num: number
          title: string
        }
        Update: {
          chapter_id?: number | null
          id?: number
          order_num?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
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
      user_chats: {
        Row: {
          chat_id: string
          user_id: string
        }
        Insert: {
          chat_id: string
          user_id: string
        }
        Update: {
          chat_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_chats_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      check_rule_passphrase: {
        Args: {
          rule_id: string
          input_passphrase: string
        }
        Returns: boolean
      }
      check_rule_passphrase_rpc: {
        Args: {
          rule_id: string
          input_passphrase: string
        }
        Returns: boolean
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
