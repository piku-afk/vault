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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          target: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active: boolean
          name: string
          target: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          target?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_name_fkey"
            columns: ["name"]
            isOneToOne: true
            referencedRelation: "savings_categories"
            referencedColumns: ["name"]
          },
        ]
      }
      mutual_fund_schemes: {
        Row: {
          category: string
          color: string
          created_at: string
          id: string
          is_active: boolean
          last_month_nav: number
          last_month_nav_date: string
          logo: string
          nav: number
          nav_date: string
          next_sip_date: string
          saving_category: string
          scheme_code: string
          scheme_name: string
          sip_amount: number
          sub_category: string
          updated_at: string
        }
        Insert: {
          category: string
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_month_nav: number
          last_month_nav_date: string
          logo: string
          nav: number
          nav_date: string
          next_sip_date?: string
          saving_category?: string
          scheme_code: string
          scheme_name: string
          sip_amount: number
          sub_category: string
          updated_at?: string
        }
        Update: {
          category?: string
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_month_nav?: number
          last_month_nav_date?: string
          logo?: string
          nav?: number
          nav_date?: string
          next_sip_date?: string
          saving_category?: string
          scheme_code?: string
          scheme_name?: string
          sip_amount?: number
          sub_category?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mutual_fund_category_fkey"
            columns: ["sub_category"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "mutual_fund_schemes_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "mutual_fund_schemes_saving_category_fkey"
            columns: ["saving_category"]
            isOneToOne: false
            referencedRelation: "savings_categories"
            referencedColumns: ["name"]
          },
        ]
      }
      savings_categories: {
        Row: {
          color: string
          created_at: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          icon?: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      sub_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      transaction_types: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          date: string
          id: string
          nav: number
          scheme_name: string
          transaction_type: string
          units: number
          updated_at: string
        }
        Insert: {
          amount: number
          date: string
          id?: string
          nav: number
          scheme_name: string
          transaction_type: string
          units: number
          updated_at?: string
        }
        Update: {
          amount?: number
          date?: string
          id?: string
          nav?: number
          scheme_name?: string
          transaction_type?: string
          units?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_fund_name_fkey"
            columns: ["scheme_name"]
            isOneToOne: false
            referencedRelation: "mutual_fund_schemes"
            referencedColumns: ["scheme_name"]
          },
          {
            foreignKeyName: "transaction_fund_name_fkey"
            columns: ["scheme_name"]
            isOneToOne: false
            referencedRelation: "mutual_fund_summary"
            referencedColumns: ["scheme_name"]
          },
          {
            foreignKeyName: "transaction_transaction_type_fkey"
            columns: ["transaction_type"]
            isOneToOne: false
            referencedRelation: "transaction_types"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Views: {
      goals_progress: {
        Row: {
          current: number | null
          icon: string | null
          is_complete: boolean | null
          name: string | null
          progress: number | null
          remaining: number | null
          sip_amount: number | null
          target: number | null
        }
        Relationships: [
          {
            foreignKeyName: "goal_name_fkey"
            columns: ["name"]
            isOneToOne: true
            referencedRelation: "savings_categories"
            referencedColumns: ["name"]
          },
        ]
      }
      mutual_fund_summary: {
        Row: {
          nav_diff_percentage: number | null
          net_current: number | null
          net_invested: number | null
          net_units: number | null
          returns: number | null
          returns_percentage: number | null
          saving_category: string | null
          scheme_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mutual_fund_schemes_saving_category_fkey"
            columns: ["saving_category"]
            isOneToOne: false
            referencedRelation: "savings_categories"
            referencedColumns: ["name"]
          },
        ]
      }
      saving_category_stats: {
        Row: {
          category: string | null
          next_sip_date: string | null
          sip_amount: number | null
          total_schemes: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_monthly_performers: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
