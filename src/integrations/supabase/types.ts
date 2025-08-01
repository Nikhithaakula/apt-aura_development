export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievement_requests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievement_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          media: string[] | null
          project_id: string | null
          startup_id: string | null
          tags: string[] | null
          type: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          media?: string[] | null
          project_id?: string | null
          startup_id?: string | null
          tags?: string[] | null
          type?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          media?: string[] | null
          project_id?: string | null
          startup_id?: string | null
          tags?: string[] | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_posts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_posts_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          field_of_interest: string | null
          full_name: string | null
          future_vision: string | null
          id: string
          interests: string[] | null
          location: string | null
          long_term_goals: string | null
          resume_url: string | null
          role: string | null
          short_term_goals: string | null
          skills: string[] | null
          skills_to_learn: string[] | null
          statement_of_purpose: string | null
          true_passion: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          field_of_interest?: string | null
          full_name?: string | null
          future_vision?: string | null
          id: string
          interests?: string[] | null
          location?: string | null
          long_term_goals?: string | null
          resume_url?: string | null
          role?: string | null
          short_term_goals?: string | null
          skills?: string[] | null
          skills_to_learn?: string[] | null
          statement_of_purpose?: string | null
          true_passion?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          field_of_interest?: string | null
          full_name?: string | null
          future_vision?: string | null
          id?: string
          interests?: string[] | null
          location?: string | null
          long_term_goals?: string | null
          resume_url?: string | null
          role?: string | null
          short_term_goals?: string | null
          skills?: string[] | null
          skills_to_learn?: string[] | null
          statement_of_purpose?: string | null
          true_passion?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      project_members: {
        Row: {
          admin_id: string | null
          applied_at: string | null
          id: string
          motivation: string | null
          profile_link: string | null
          project_id: string | null
          role_applied: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          admin_id?: string | null
          applied_at?: string | null
          id?: string
          motivation?: string | null
          profile_link?: string | null
          project_id?: string | null
          role_applied?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          admin_id?: string | null
          applied_at?: string | null
          id?: string
          motivation?: string | null
          profile_link?: string | null
          project_id?: string | null
          role_applied?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string | null
          created_at: string | null
          customsections: Json | null
          description: string | null
          duration: string | null
          goal: string | null
          id: string
          media: string[] | null
          owner_id: string | null
          requirements: string | null
          skills_needed: string[] | null
          status: string | null
          teams: Json | null
          tech_stack: string[] | null
          timeline: Json | null
          title: string
          tools: string[] | null
          work_mode: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          customsections?: Json | null
          description?: string | null
          duration?: string | null
          goal?: string | null
          id?: string
          media?: string[] | null
          owner_id?: string | null
          requirements?: string | null
          skills_needed?: string[] | null
          status?: string | null
          teams?: Json | null
          tech_stack?: string[] | null
          timeline?: Json | null
          title: string
          tools?: string[] | null
          work_mode?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          customsections?: Json | null
          description?: string | null
          duration?: string | null
          goal?: string | null
          id?: string
          media?: string[] | null
          owner_id?: string | null
          requirements?: string | null
          skills_needed?: string[] | null
          status?: string | null
          teams?: Json | null
          tech_stack?: string[] | null
          timeline?: Json | null
          title?: string
          tools?: string[] | null
          work_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_members: {
        Row: {
          admin_id: string | null
          applied_at: string | null
          id: string
          motivation: string | null
          profile_link: string | null
          role_applied: string | null
          startup_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          admin_id?: string | null
          applied_at?: string | null
          id?: string
          motivation?: string | null
          profile_link?: string | null
          role_applied?: string | null
          startup_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          admin_id?: string | null
          applied_at?: string | null
          id?: string
          motivation?: string | null
          profile_link?: string | null
          role_applied?: string | null
          startup_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "startup_members_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "startup_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      startups: {
        Row: {
          created_at: string | null
          customsections: Json | null
          description: string | null
          founded: string | null
          id: string
          location: string | null
          logo: string | null
          media: string[] | null
          mission: string | null
          name: string
          owner_id: string | null
          requirements: string | null
          sector: string | null
          stage: string | null
          status: string | null
          tagline: string | null
          team_size: number | null
          teams: Json | null
          tech_stack: string[] | null
          timeline: Json | null
          tools: string[] | null
          website: string | null
          work_mode: string | null
        }
        Insert: {
          created_at?: string | null
          customsections?: Json | null
          description?: string | null
          founded?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          media?: string[] | null
          mission?: string | null
          name: string
          owner_id?: string | null
          requirements?: string | null
          sector?: string | null
          stage?: string | null
          status?: string | null
          tagline?: string | null
          team_size?: number | null
          teams?: Json | null
          tech_stack?: string[] | null
          timeline?: Json | null
          tools?: string[] | null
          website?: string | null
          work_mode?: string | null
        }
        Update: {
          created_at?: string | null
          customsections?: Json | null
          description?: string | null
          founded?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          media?: string[] | null
          mission?: string | null
          name?: string
          owner_id?: string | null
          requirements?: string | null
          sector?: string | null
          stage?: string | null
          status?: string | null
          tagline?: string | null
          team_size?: number | null
          teams?: Json | null
          tech_stack?: string[] | null
          timeline?: Json | null
          tools?: string[] | null
          website?: string | null
          work_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "startups_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
