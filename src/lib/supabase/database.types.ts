export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: { extensions?: Json; operationName?: string; query?: string; variables?: Json };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      achievement_categories: {
        Row: {
          created_at: string;
          id: string;
          name: NonNullable<Json>;
          sort_order: number;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          name: NonNullable<Json>;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: NonNullable<Json>;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      achievement_skills: {
        Row: {
          achievement_id: string;
          skill_id: string;
        };
        ComputedFields: never;
        Insert: {
          achievement_id: string;
          skill_id: string;
        };
        Update: {
          achievement_id?: string;
          skill_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "achievement_skills_achievement_id_fkey";
            columns: ["achievement_id"];
            isOneToOne: false;
            referencedRelation: "achievements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "achievement_skills_skill_id_fkey";
            columns: ["skill_id"];
            isOneToOne: false;
            referencedRelation: "skills";
            referencedColumns: ["id"];
          },
        ];
      };
      achievements: {
        Row: {
          category_id: string | null;
          created_at: string;
          credential_id: string | null;
          credential_url: string | null;
          deleted_at: string | null;
          description: NonNullable<Json>;
          expires_at: string | null;
          id: string;
          image_path: string | null;
          issued_at: string;
          issuer: string;
          sort_order: number | null;
          status: Database["public"]["Enums"]["publication_status"];
          title: NonNullable<Json>;
          type: Database["public"]["Enums"]["achievement_type"];
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          category_id?: string | null;
          created_at?: string;
          credential_id?: string | null;
          credential_url?: string | null;
          deleted_at?: string | null;
          description?: NonNullable<Json>;
          expires_at?: string | null;
          id?: string;
          image_path?: string | null;
          issued_at: string;
          issuer: string;
          sort_order?: number | null;
          status?: Database["public"]["Enums"]["publication_status"];
          title: NonNullable<Json>;
          type: Database["public"]["Enums"]["achievement_type"];
          updated_at?: string;
        };
        Update: {
          category_id?: string | null;
          created_at?: string;
          credential_id?: string | null;
          credential_url?: string | null;
          deleted_at?: string | null;
          description?: NonNullable<Json>;
          expires_at?: string | null;
          id?: string;
          image_path?: string | null;
          issued_at?: string;
          issuer?: string;
          sort_order?: number | null;
          status?: Database["public"]["Enums"]["publication_status"];
          title?: NonNullable<Json>;
          type?: Database["public"]["Enums"]["achievement_type"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "achievements_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "achievement_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_users: {
        Row: {
          created_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          archived_at: string | null;
          created_at: string;
          email: string;
          id: string;
          is_read: boolean;
          message: string;
          name: string;
          visitor_hash: string | null;
        };
        ComputedFields: never;
        Insert: {
          archived_at?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          is_read?: boolean;
          message: string;
          name: string;
          visitor_hash?: string | null;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          is_read?: boolean;
          message?: string;
          name?: string;
          visitor_hash?: string | null;
        };
        Relationships: [];
      };
      educations: {
        Row: {
          created_at: string;
          degree: NonNullable<Json>;
          deleted_at: string | null;
          end_date: string | null;
          id: string;
          institution: string;
          logo_path: string | null;
          notes: NonNullable<Json>;
          sort_order: number | null;
          start_date: string;
          status: Database["public"]["Enums"]["publication_status"];
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          degree: NonNullable<Json>;
          deleted_at?: string | null;
          end_date?: string | null;
          id?: string;
          institution: string;
          logo_path?: string | null;
          notes?: NonNullable<Json>;
          sort_order?: number | null;
          start_date: string;
          status?: Database["public"]["Enums"]["publication_status"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          degree?: NonNullable<Json>;
          deleted_at?: string | null;
          end_date?: string | null;
          id?: string;
          institution?: string;
          logo_path?: string | null;
          notes?: NonNullable<Json>;
          sort_order?: number | null;
          start_date?: string;
          status?: Database["public"]["Enums"]["publication_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      experience_skills: {
        Row: {
          experience_id: string;
          skill_id: string;
        };
        ComputedFields: never;
        Insert: {
          experience_id: string;
          skill_id: string;
        };
        Update: {
          experience_id?: string;
          skill_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "experience_skills_experience_id_fkey";
            columns: ["experience_id"];
            isOneToOne: false;
            referencedRelation: "experiences";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "experience_skills_skill_id_fkey";
            columns: ["skill_id"];
            isOneToOne: false;
            referencedRelation: "skills";
            referencedColumns: ["id"];
          },
        ];
      };
      experiences: {
        Row: {
          company: string;
          created_at: string;
          deleted_at: string | null;
          end_date: string | null;
          id: string;
          impact: NonNullable<Json>;
          learnings: NonNullable<Json>;
          logo_path: string | null;
          position: NonNullable<Json>;
          responsibilities: NonNullable<Json>;
          sort_order: number | null;
          start_date: string;
          status: Database["public"]["Enums"]["publication_status"];
          type: Database["public"]["Enums"]["experience_type"];
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          company: string;
          created_at?: string;
          deleted_at?: string | null;
          end_date?: string | null;
          id?: string;
          impact?: NonNullable<Json>;
          learnings?: NonNullable<Json>;
          logo_path?: string | null;
          position: NonNullable<Json>;
          responsibilities?: NonNullable<Json>;
          sort_order?: number | null;
          start_date: string;
          status?: Database["public"]["Enums"]["publication_status"];
          type: Database["public"]["Enums"]["experience_type"];
          updated_at?: string;
        };
        Update: {
          company?: string;
          created_at?: string;
          deleted_at?: string | null;
          end_date?: string | null;
          id?: string;
          impact?: NonNullable<Json>;
          learnings?: NonNullable<Json>;
          logo_path?: string | null;
          position?: NonNullable<Json>;
          responsibilities?: NonNullable<Json>;
          sort_order?: number | null;
          start_date?: string;
          status?: Database["public"]["Enums"]["publication_status"];
          type?: Database["public"]["Enums"]["experience_type"];
          updated_at?: string;
        };
        Relationships: [];
      };
      github_snapshot: {
        Row: {
          data: NonNullable<Json>;
          fetched_at: string;
          id: number;
        };
        ComputedFields: never;
        Insert: {
          data: NonNullable<Json>;
          fetched_at?: string;
          id?: number;
        };
        Update: {
          data?: NonNullable<Json>;
          fetched_at?: string;
          id?: number;
        };
        Relationships: [];
      };
      page_views: {
        Row: {
          created_at: string;
          id: number;
          locale: string;
          path: string;
          referrer_host: string | null;
          visitor_hash: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: never;
          locale: string;
          path: string;
          referrer_host?: string | null;
          visitor_hash: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          locale?: string;
          path?: string;
          referrer_host?: string | null;
          visitor_hash?: string;
        };
        Relationships: [];
      };
      project_categories: {
        Row: {
          created_at: string;
          id: string;
          name: NonNullable<Json>;
          sort_order: number;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          name: NonNullable<Json>;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: NonNullable<Json>;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_images: {
        Row: {
          alt: NonNullable<Json>;
          created_at: string;
          id: string;
          orientation: Database["public"]["Enums"]["image_orientation"];
          path: string;
          project_id: string;
          sort_order: number;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          alt?: NonNullable<Json>;
          created_at?: string;
          id?: string;
          orientation?: Database["public"]["Enums"]["image_orientation"];
          path: string;
          project_id: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          alt?: NonNullable<Json>;
          created_at?: string;
          id?: string;
          orientation?: Database["public"]["Enums"]["image_orientation"];
          path?: string;
          project_id?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      project_skills: {
        Row: {
          project_id: string;
          skill_id: string;
        };
        ComputedFields: never;
        Insert: {
          project_id: string;
          skill_id: string;
        };
        Update: {
          project_id?: string;
          skill_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_skills_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_skills_skill_id_fkey";
            columns: ["skill_id"];
            isOneToOne: false;
            referencedRelation: "skills";
            referencedColumns: ["id"];
          },
        ];
      };
      project_types: {
        Row: {
          created_at: string;
          id: string;
          name: NonNullable<Json>;
          sort_order: number;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          name: NonNullable<Json>;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: NonNullable<Json>;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          app_store_url: string | null;
          category_id: string;
          challenges: NonNullable<Json>;
          created_at: string;
          deleted_at: string | null;
          demo_url: string | null;
          ended_at: string | null;
          features: NonNullable<Json>;
          id: string;
          is_featured: boolean;
          overview: NonNullable<Json>;
          play_store_url: string | null;
          problem: NonNullable<Json>;
          project_status: Database["public"]["Enums"]["project_status"];
          repo_url: string | null;
          slug: string;
          solution: NonNullable<Json>;
          sort_order: number | null;
          started_at: string;
          status: Database["public"]["Enums"]["publication_status"];
          summary: NonNullable<Json>;
          thumbnail_path: string | null;
          title: NonNullable<Json>;
          type_id: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          app_store_url?: string | null;
          category_id: string;
          challenges?: NonNullable<Json>;
          created_at?: string;
          deleted_at?: string | null;
          demo_url?: string | null;
          ended_at?: string | null;
          features?: NonNullable<Json>;
          id?: string;
          is_featured?: boolean;
          overview?: NonNullable<Json>;
          play_store_url?: string | null;
          problem?: NonNullable<Json>;
          project_status?: Database["public"]["Enums"]["project_status"];
          repo_url?: string | null;
          slug: string;
          solution?: NonNullable<Json>;
          sort_order?: number | null;
          started_at: string;
          status?: Database["public"]["Enums"]["publication_status"];
          summary?: NonNullable<Json>;
          thumbnail_path?: string | null;
          title: NonNullable<Json>;
          type_id: string;
          updated_at?: string;
        };
        Update: {
          app_store_url?: string | null;
          category_id?: string;
          challenges?: NonNullable<Json>;
          created_at?: string;
          deleted_at?: string | null;
          demo_url?: string | null;
          ended_at?: string | null;
          features?: NonNullable<Json>;
          id?: string;
          is_featured?: boolean;
          overview?: NonNullable<Json>;
          play_store_url?: string | null;
          problem?: NonNullable<Json>;
          project_status?: Database["public"]["Enums"]["project_status"];
          repo_url?: string | null;
          slug?: string;
          solution?: NonNullable<Json>;
          sort_order?: number | null;
          started_at?: string;
          status?: Database["public"]["Enums"]["publication_status"];
          summary?: NonNullable<Json>;
          thumbnail_path?: string | null;
          title?: NonNullable<Json>;
          type_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "project_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_type_id_fkey";
            columns: ["type_id"];
            isOneToOne: false;
            referencedRelation: "project_types";
            referencedColumns: ["id"];
          },
        ];
      };
      site_settings: {
        Row: {
          created_at: string;
          cv_en_path: string | null;
          cv_id_path: string | null;
          full_intro: NonNullable<Json>;
          github_username: string | null;
          headline: NonNullable<Json>;
          id: number;
          name: string;
          photo_path: string | null;
          roles: NonNullable<Json>;
          seo_description: NonNullable<Json>;
          seo_title: NonNullable<Json>;
          short_intro: NonNullable<Json>;
          social_links: NonNullable<Json>;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          cv_en_path?: string | null;
          cv_id_path?: string | null;
          full_intro?: NonNullable<Json>;
          github_username?: string | null;
          headline?: NonNullable<Json>;
          id?: number;
          name: string;
          photo_path?: string | null;
          roles?: NonNullable<Json>;
          seo_description?: NonNullable<Json>;
          seo_title?: NonNullable<Json>;
          short_intro?: NonNullable<Json>;
          social_links?: NonNullable<Json>;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          cv_en_path?: string | null;
          cv_id_path?: string | null;
          full_intro?: NonNullable<Json>;
          github_username?: string | null;
          headline?: NonNullable<Json>;
          id?: number;
          name?: string;
          photo_path?: string | null;
          roles?: NonNullable<Json>;
          seo_description?: NonNullable<Json>;
          seo_title?: NonNullable<Json>;
          short_intro?: NonNullable<Json>;
          social_links?: NonNullable<Json>;
          updated_at?: string;
        };
        Relationships: [];
      };
      skill_categories: {
        Row: {
          created_at: string;
          id: string;
          name: NonNullable<Json>;
          sort_order: number;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          name: NonNullable<Json>;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: NonNullable<Json>;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          category_id: string;
          created_at: string;
          deleted_at: string | null;
          icon_slug: string;
          id: string;
          name: string;
          sort_order: number | null;
          status: Database["public"]["Enums"]["publication_status"];
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          category_id: string;
          created_at?: string;
          deleted_at?: string | null;
          icon_slug: string;
          id?: string;
          name: string;
          sort_order?: number | null;
          status?: Database["public"]["Enums"]["publication_status"];
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          deleted_at?: string | null;
          icon_slug?: string;
          id?: string;
          name?: string;
          sort_order?: number | null;
          status?: Database["public"]["Enums"]["publication_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "skill_categories";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      daily_visitor_stats: {
        Args: { days?: number };
        Returns: {
          day: string;
          views: number;
          visitors: number;
        }[];
      };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_localized_text: { Args: { value: Json }; Returns: boolean };
      record_page_view: {
        Args: {
          view_locale: string;
          view_path: string;
          view_referrer_host: string;
          view_visitor_hash: string;
        };
        Returns: undefined;
      };
      submit_contact_message: {
        Args: {
          max_per_hour?: number;
          message_body: string;
          sender_email: string;
          sender_hash: string;
          sender_name: string;
        };
        Returns: string;
      };
    };
    Enums: {
      achievement_type: "certificate" | "award";
      experience_type: "full_time" | "internship" | "freelance" | "contract";
      image_orientation: "portrait" | "landscape";
      project_status: "completed" | "in_progress" | "archived";
      publication_status: "draft" | "published";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      achievement_type: ["certificate", "award"],
      experience_type: ["full_time", "internship", "freelance", "contract"],
      image_orientation: ["portrait", "landscape"],
      project_status: ["completed", "in_progress", "archived"],
      publication_status: ["draft", "published"],
    },
  },
} as const;
