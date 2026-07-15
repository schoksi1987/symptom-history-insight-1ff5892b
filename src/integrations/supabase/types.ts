export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      clinical_news: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          metadata: Json | null
          published_date: string | null
          relevance_score: number | null
          source: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          published_date?: string | null
          relevance_score?: number | null
          source?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          published_date?: string | null
          relevance_score?: number | null
          source?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cohorts: {
        Row: {
          avg_risk: number
          centroid: Json
          description: string | null
          id: number
          label: string
          model_version: string
          outcome_summary: Json
          size: number
          top_features: Json
          updated_at: string
        }
        Insert: {
          avg_risk?: number
          centroid?: Json
          description?: string | null
          id: number
          label: string
          model_version?: string
          outcome_summary?: Json
          size?: number
          top_features?: Json
          updated_at?: string
        }
        Update: {
          avg_risk?: number
          centroid?: Json
          description?: string | null
          id?: number
          label?: string
          model_version?: string
          outcome_summary?: Json
          size?: number
          top_features?: Json
          updated_at?: string
        }
        Relationships: []
      }
      email_processors: {
        Row: {
          created_at: string
          email_address: string
          id: string
          is_active: boolean | null
          patient_id: string
        }
        Insert: {
          created_at?: string
          email_address: string
          id?: string
          is_active?: boolean | null
          patient_id: string
        }
        Update: {
          created_at?: string
          email_address?: string
          id?: string
          is_active?: boolean | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_processors_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      patient_cohort_assignments: {
        Row: {
          cohort_id: number
          computed_at: string
          distance: number
          id: string
          patient_id: string
        }
        Insert: {
          cohort_id: number
          computed_at?: string
          distance: number
          id?: string
          patient_id: string
        }
        Update: {
          cohort_id?: number
          computed_at?: string
          distance?: number
          id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_cohort_assignments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_notes: {
        Row: {
          ai_summary: string | null
          analysis_status: string | null
          attachments: Json | null
          confidence_score: number | null
          created_at: string
          diabetes_insights: Json | null
          email_from: string | null
          email_subject: string | null
          id: string
          identified_symptoms: Json | null
          metadata: Json | null
          note_text: string
          note_type: string | null
          patient_id: string
          source: string | null
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          analysis_status?: string | null
          attachments?: Json | null
          confidence_score?: number | null
          created_at?: string
          diabetes_insights?: Json | null
          email_from?: string | null
          email_subject?: string | null
          id?: string
          identified_symptoms?: Json | null
          metadata?: Json | null
          note_text: string
          note_type?: string | null
          patient_id: string
          source?: string | null
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          analysis_status?: string | null
          attachments?: Json | null
          confidence_score?: number | null
          created_at?: string
          diabetes_insights?: Json | null
          email_from?: string | null
          email_subject?: string | null
          id?: string
          identified_symptoms?: Json | null
          metadata?: Json | null
          note_text?: string
          note_type?: string | null
          patient_id?: string
          source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      patient_risk_scores: {
        Row: {
          computed_at: string
          contributions: Json
          created_at: string
          features: Json
          id: string
          model_version: string
          patient_id: string
          probability: number
          score: number
        }
        Insert: {
          computed_at?: string
          contributions?: Json
          created_at?: string
          features?: Json
          id?: string
          model_version?: string
          patient_id: string
          probability: number
          score: number
        }
        Update: {
          computed_at?: string
          contributions?: Json
          created_at?: string
          features?: Json
          id?: string
          model_version?: string
          patient_id?: string
          probability?: number
          score?: number
        }
        Relationships: []
      }
      patient_similarity_analysis: {
        Row: {
          analysis_date: string | null
          created_at: string
          id: string
          matching_factors: Json | null
          news_references: string[] | null
          patient_id: string
          peer_finding_references: string[] | null
          risk_insights: Json | null
          similar_patient_profile: Json | null
          similarity_score: number | null
          statistical_references: string[] | null
        }
        Insert: {
          analysis_date?: string | null
          created_at?: string
          id?: string
          matching_factors?: Json | null
          news_references?: string[] | null
          patient_id: string
          peer_finding_references?: string[] | null
          risk_insights?: Json | null
          similar_patient_profile?: Json | null
          similarity_score?: number | null
          statistical_references?: string[] | null
        }
        Update: {
          analysis_date?: string | null
          created_at?: string
          id?: string
          matching_factors?: Json | null
          news_references?: string[] | null
          patient_id?: string
          peer_finding_references?: string[] | null
          risk_insights?: Json | null
          similar_patient_profile?: Json | null
          similarity_score?: number | null
          statistical_references?: string[] | null
        }
        Relationships: []
      }
      patient_symptoms: {
        Row: {
          created_at: string
          first_reported: string | null
          frequency: string | null
          id: string
          last_reported: string | null
          metadata: Json | null
          note_id: string | null
          patient_id: string
          severity: string | null
          source: string | null
          symptom_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_reported?: string | null
          frequency?: string | null
          id?: string
          last_reported?: string | null
          metadata?: Json | null
          note_id?: string | null
          patient_id: string
          severity?: string | null
          source?: string | null
          symptom_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_reported?: string | null
          frequency?: string | null
          id?: string
          last_reported?: string | null
          metadata?: Json | null
          note_id?: string | null
          patient_id?: string
          severity?: string | null
          source?: string | null
          symptom_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_symptoms_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "patient_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_symptoms_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      peer_findings: {
        Row: {
          clinical_context: string | null
          created_at: string
          finding_description: string
          finding_title: string
          id: string
          outcome_data: Json | null
          patient_demographics: Json | null
          physician_id: string | null
          publication_date: string | null
          updated_at: string
          verification_status: string | null
        }
        Insert: {
          clinical_context?: string | null
          created_at?: string
          finding_description: string
          finding_title: string
          id?: string
          outcome_data?: Json | null
          patient_demographics?: Json | null
          physician_id?: string | null
          publication_date?: string | null
          updated_at?: string
          verification_status?: string | null
        }
        Update: {
          clinical_context?: string | null
          created_at?: string
          finding_description?: string
          finding_title?: string
          id?: string
          outcome_data?: Json | null
          patient_demographics?: Json | null
          physician_id?: string | null
          publication_date?: string | null
          updated_at?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      population_metrics: {
        Row: {
          created_at: string
          data: Json
          id: string
          metric_key: string
          snapshot_date: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          metric_key: string
          snapshot_date?: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          metric_key?: string
          snapshot_date?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      statistical_trends: {
        Row: {
          confidence_level: number | null
          created_at: string
          data_points: Json
          id: string
          population_size: number | null
          source: string | null
          time_period: string | null
          trend_category: string | null
          trend_name: string
          updated_at: string
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string
          data_points: Json
          id?: string
          population_size?: number | null
          source?: string | null
          time_period?: string | null
          trend_category?: string | null
          trend_name: string
          updated_at?: string
        }
        Update: {
          confidence_level?: number | null
          created_at?: string
          data_points?: Json
          id?: string
          population_size?: number | null
          source?: string | null
          time_period?: string | null
          trend_category?: string | null
          trend_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      symptom_forecasts: {
        Row: {
          anomaly: boolean
          computed_at: string
          forecast: Json
          history: Json
          id: string
          patient_id: string
          symptom_name: string
          trend: string
        }
        Insert: {
          anomaly?: boolean
          computed_at?: string
          forecast?: Json
          history?: Json
          id?: string
          patient_id: string
          symptom_name: string
          trend?: string
        }
        Update: {
          anomaly?: boolean
          computed_at?: string
          forecast?: Json
          history?: Json
          id?: string
          patient_id?: string
          symptom_name?: string
          trend?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "clinician" | "user"
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
    Enums: {
      app_role: ["admin", "clinician", "user"],
    },
  },
} as const
