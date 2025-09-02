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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      client_addresses: {
        Row: {
          address_type: string
          city: string
          client_id: string
          complement: string | null
          country: string
          created_at: string
          id: string
          is_primary: boolean
          neighborhood: string | null
          number: string | null
          state: string
          street: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          address_type?: string
          city: string
          client_id: string
          complement?: string | null
          country?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          neighborhood?: string | null
          number?: string | null
          state: string
          street: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          address_type?: string
          city?: string
          client_id?: string
          complement?: string | null
          country?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          neighborhood?: string | null
          number?: string | null
          state?: string
          street?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_addresses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contacts: {
        Row: {
          client_id: string
          contact_type: string
          contact_value: string
          created_at: string
          description: string | null
          id: string
          is_primary: boolean
          is_whatsapp: boolean
          updated_at: string
        }
        Insert: {
          client_id: string
          contact_type: string
          contact_value: string
          created_at?: string
          description?: string | null
          id?: string
          is_primary?: boolean
          is_whatsapp?: boolean
          updated_at?: string
        }
        Update: {
          client_id?: string
          contact_type?: string
          contact_value?: string
          created_at?: string
          description?: string | null
          id?: string
          is_primary?: boolean
          is_whatsapp?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contracts: {
        Row: {
          client_id: string
          contract_number: string
          contract_type: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          responsible_team_member: string | null
          start_date: string
          status: string
          terms: string | null
          updated_at: string
          value: number | null
        }
        Insert: {
          client_id: string
          contract_number: string
          contract_type: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          responsible_team_member?: string | null
          start_date: string
          status?: string
          terms?: string | null
          updated_at?: string
          value?: number | null
        }
        Update: {
          client_id?: string
          contract_number?: string
          contract_type?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          responsible_team_member?: string | null
          start_date?: string
          status?: string
          terms?: string | null
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_equipment: {
        Row: {
          brand: string | null
          client_id: string
          created_at: string
          equipment_type: string
          id: string
          installation_date: string | null
          location: string | null
          model: string | null
          notes: string | null
          serial_number: string | null
          status: string
          updated_at: string
          warranty_expiry: string | null
        }
        Insert: {
          brand?: string | null
          client_id: string
          created_at?: string
          equipment_type: string
          id?: string
          installation_date?: string | null
          location?: string | null
          model?: string | null
          notes?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
          warranty_expiry?: string | null
        }
        Update: {
          brand?: string | null
          client_id?: string
          created_at?: string
          equipment_type?: string
          id?: string
          installation_date?: string | null
          location?: string | null
          model?: string | null
          notes?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
          warranty_expiry?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_equipment_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_persons: {
        Row: {
          client_id: string
          created_at: string
          department: string | null
          email: string | null
          id: string
          is_decision_maker: boolean
          is_primary: boolean
          mobile: string | null
          name: string
          notes: string | null
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          is_decision_maker?: boolean
          is_primary?: boolean
          mobile?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          is_decision_maker?: boolean
          is_primary?: boolean
          mobile?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_persons_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_type: string
          code: string
          company_name: string
          created_at: string
          document_number: string
          document_type: string
          id: string
          municipal_registration: string | null
          notes: string | null
          segment: string | null
          size: string | null
          state_registration: string | null
          status: string
          trade_name: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          client_type?: string
          code: string
          company_name: string
          created_at?: string
          document_number: string
          document_type: string
          id?: string
          municipal_registration?: string | null
          notes?: string | null
          segment?: string | null
          size?: string | null
          state_registration?: string | null
          status?: string
          trade_name?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          client_type?: string
          code?: string
          company_name?: string
          created_at?: string
          document_number?: string
          document_type?: string
          id?: string
          municipal_registration?: string | null
          notes?: string | null
          segment?: string | null
          size?: string | null
          state_registration?: string | null
          status?: string
          trade_name?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      monitoring_sessions: {
        Row: {
          browser: string | null
          created_at: string
          ended_at: string | null
          id: string
          platform: string | null
          session_id: string
          started_at: string
          status: string
          user_email: string
        }
        Insert: {
          browser?: string | null
          created_at?: string
          ended_at?: string | null
          id?: string
          platform?: string | null
          session_id: string
          started_at?: string
          status?: string
          user_email: string
        }
        Update: {
          browser?: string | null
          created_at?: string
          ended_at?: string | null
          id?: string
          platform?: string | null
          session_id?: string
          started_at?: string
          status?: string
          user_email?: string
        }
        Relationships: []
      }
      nps_responses: {
        Row: {
          created_at: string
          id: string
          nps_score: number | null
          problem_resolved: boolean
          satisfaction_level: number
          ticket_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nps_score?: number | null
          problem_resolved: boolean
          satisfaction_level: number
          ticket_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nps_score?: number | null
          problem_resolved?: boolean
          satisfaction_level?: number
          ticket_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_history: {
        Row: {
          billing_status: string | null
          client_feedback: string | null
          client_id: string
          cost: number | null
          created_at: string
          description: string
          duration_minutes: number | null
          equipment_serviced: string | null
          id: string
          internal_notes: string | null
          parts_used: string | null
          responsible_technician: string
          satisfaction_rating: number | null
          service_date: string
          service_type: string
          solution: string | null
          status: string
          ticket_id: string | null
          updated_at: string
        }
        Insert: {
          billing_status?: string | null
          client_feedback?: string | null
          client_id: string
          cost?: number | null
          created_at?: string
          description: string
          duration_minutes?: number | null
          equipment_serviced?: string | null
          id?: string
          internal_notes?: string | null
          parts_used?: string | null
          responsible_technician: string
          satisfaction_rating?: number | null
          service_date: string
          service_type: string
          solution?: string | null
          status?: string
          ticket_id?: string | null
          updated_at?: string
        }
        Update: {
          billing_status?: string | null
          client_feedback?: string | null
          client_id?: string
          cost?: number | null
          created_at?: string
          description?: string
          duration_minutes?: number | null
          equipment_serviced?: string | null
          id?: string
          internal_notes?: string | null
          parts_used?: string | null
          responsible_technician?: string
          satisfaction_rating?: number | null
          service_date?: string
          service_type?: string
          solution?: string | null
          status?: string
          ticket_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_clients: {
        Row: {
          client_id: string | null
          code: string
          created_at: string
          id: string
          name: string
          responsible_team_member: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          code: string
          created_at?: string
          id?: string
          name: string
          responsible_team_member: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          code?: string
          created_at?: string
          id?: string
          name?: string
          responsible_team_member?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_capacity: {
        Row: {
          actual_attendance: number
          coverage_percentage: number | null
          created_at: string
          date: string
          id: string
          total_capacity: number
          updated_at: string
        }
        Insert: {
          actual_attendance?: number
          coverage_percentage?: number | null
          created_at?: string
          date: string
          id?: string
          total_capacity: number
          updated_at?: string
        }
        Update: {
          actual_attendance?: number
          coverage_percentage?: number | null
          created_at?: string
          date?: string
          id?: string
          total_capacity?: number
          updated_at?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          conversion_reason: string | null
          converted_at: string | null
          created_at: string
          description: string | null
          id: string
          pipefy_card_id: string | null
          pipefy_sync_status: string | null
          priority: string
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          conversion_reason?: string | null
          converted_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          pipefy_card_id?: string | null
          pipefy_sync_status?: string | null
          priority?: string
          status?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          conversion_reason?: string | null
          converted_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          pipefy_card_id?: string | null
          pipefy_sync_status?: string | null
          priority?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
