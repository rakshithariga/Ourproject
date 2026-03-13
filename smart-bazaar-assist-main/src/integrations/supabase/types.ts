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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      billing_counters: {
        Row: {
          counter_number: number
          customers_in_queue: number
          id: number
          status: string
          updated_at: string
          wait_time_minutes: number
        }
        Insert: {
          counter_number: number
          customers_in_queue?: number
          id?: number
          status?: string
          updated_at?: string
          wait_time_minutes?: number
        }
        Update: {
          counter_number?: number
          customers_in_queue?: number
          id?: number
          status?: string
          updated_at?: string
          wait_time_minutes?: number
        }
        Relationships: []
      }
      billing_history: {
        Row: {
          bill_number: string
          created_at: string
          customer_email: string
          customer_profile_id: string | null
          gst: number
          id: string
          items: Json
          payment_method: string | null
          pdf_sent: boolean | null
          subtotal: number
          total: number
        }
        Insert: {
          bill_number: string
          created_at?: string
          customer_email: string
          customer_profile_id?: string | null
          gst: number
          id?: string
          items: Json
          payment_method?: string | null
          pdf_sent?: boolean | null
          subtotal: number
          total: number
        }
        Update: {
          bill_number?: string
          created_at?: string
          customer_email?: string
          customer_profile_id?: string | null
          gst?: number
          id?: string
          items?: Json
          payment_method?: string | null
          pdf_sent?: boolean | null
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "billing_history_customer_profile_id_fkey"
            columns: ["customer_profile_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          account_status: string | null
          admin_notes: string | null
          created_at: string
          custom_tags: string[] | null
          email: string
          full_name: string | null
          id: string
          last_visit_at: string | null
          membership_tier: string | null
          phone_number: string | null
          profile_completed: boolean | null
          total_lifetime_value: number | null
          updated_at: string
          user_id: string
          visit_count: number | null
        }
        Insert: {
          account_status?: string | null
          admin_notes?: string | null
          created_at?: string
          custom_tags?: string[] | null
          email: string
          full_name?: string | null
          id?: string
          last_visit_at?: string | null
          membership_tier?: string | null
          phone_number?: string | null
          profile_completed?: boolean | null
          total_lifetime_value?: number | null
          updated_at?: string
          user_id: string
          visit_count?: number | null
        }
        Update: {
          account_status?: string | null
          admin_notes?: string | null
          created_at?: string
          custom_tags?: string[] | null
          email?: string
          full_name?: string | null
          id?: string
          last_visit_at?: string | null
          membership_tier?: string | null
          phone_number?: string | null
          profile_completed?: boolean | null
          total_lifetime_value?: number | null
          updated_at?: string
          user_id?: string
          visit_count?: number | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          id: string
          message: string | null
          rating: number
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          rating: number
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          rating?: number
        }
        Relationships: []
      }
      help_requests: {
        Row: {
          aisle_location: string | null
          assigned_to: string | null
          created_at: string
          customer_identifier: string
          id: string
          message: string | null
          product_name: string | null
          request_type: string
          resolved_at: string | null
          status: string
        }
        Insert: {
          aisle_location?: string | null
          assigned_to?: string | null
          created_at?: string
          customer_identifier: string
          id?: string
          message?: string | null
          product_name?: string | null
          request_type: string
          resolved_at?: string | null
          status?: string
        }
        Update: {
          aisle_location?: string | null
          assigned_to?: string | null
          created_at?: string
          customer_identifier?: string
          id?: string
          message?: string | null
          product_name?: string | null
          request_type?: string
          resolved_at?: string | null
          status?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          aisle: string
          brand: string
          category: string
          created_at: string
          expiry_date: string
          id: string
          image: string
          name: string
          offer: string | null
          original_price: number | null
          price: number
          stock: number
          updated_at: string
        }
        Insert: {
          aisle: string
          brand: string
          category: string
          created_at?: string
          expiry_date: string
          id?: string
          image: string
          name: string
          offer?: string | null
          original_price?: number | null
          price: number
          stock?: number
          updated_at?: string
        }
        Update: {
          aisle?: string
          brand?: string
          category?: string
          created_at?: string
          expiry_date?: string
          id?: string
          image?: string
          name?: string
          offer?: string | null
          original_price?: number | null
          price?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      session_members: {
        Row: {
          id: string
          joined_at: string
          member_name: string
          session_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          member_name: string
          session_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          member_name?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_members_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "shopping_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_cart_items: {
        Row: {
          added_at: string
          added_by: string
          id: string
          is_checked: boolean
          product_id: string
          product_image: string | null
          product_name: string
          product_price: number
          quantity: number
          session_id: string
        }
        Insert: {
          added_at?: string
          added_by: string
          id?: string
          is_checked?: boolean
          product_id: string
          product_image?: string | null
          product_name: string
          product_price: number
          quantity?: number
          session_id: string
        }
        Update: {
          added_at?: string
          added_by?: string
          id?: string
          is_checked?: boolean
          product_id?: string
          product_image?: string | null
          product_name?: string
          product_price?: number
          quantity?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_cart_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "shopping_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_sessions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          session_code: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          session_code: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          session_code?: string
        }
        Relationships: []
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
