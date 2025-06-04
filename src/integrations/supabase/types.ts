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
      ambulance_bookings: {
        Row: {
          ambulance_type: string | null
          booking_time: string | null
          created_at: string
          destination: string | null
          driver_name: string | null
          id: string
          patient_name: string | null
          phone_number: string | null
          pickup_location: string | null
          report_id: string | null
          status: string | null
        }
        Insert: {
          ambulance_type?: string | null
          booking_time?: string | null
          created_at?: string
          destination?: string | null
          driver_name?: string | null
          id?: string
          patient_name?: string | null
          phone_number?: string | null
          pickup_location?: string | null
          report_id?: string | null
          status?: string | null
        }
        Update: {
          ambulance_type?: string | null
          booking_time?: string | null
          created_at?: string
          destination?: string | null
          driver_name?: string | null
          id?: string
          patient_name?: string | null
          phone_number?: string | null
          pickup_location?: string | null
          report_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ambulance_bookings_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      business_social_accounts: {
        Row: {
          account_handle: string | null
          account_url: string | null
          business_id: string
          created_at: string
          followers_count: number | null
          id: string
          is_active: boolean | null
          platform_id: string
          updated_at: string
        }
        Insert: {
          account_handle?: string | null
          account_url?: string | null
          business_id: string
          created_at?: string
          followers_count?: number | null
          id?: string
          is_active?: boolean | null
          platform_id: string
          updated_at?: string
        }
        Update: {
          account_handle?: string | null
          account_url?: string | null
          business_id?: string
          created_at?: string
          followers_count?: number | null
          id?: string
          is_active?: boolean | null
          platform_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_social_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_social_accounts_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "social_media_platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      call_records: {
        Row: {
          call_direction: string | null
          call_duration: number | null
          call_status: string | null
          call_time: string | null
          call_type: string | null
          created_at: string
          id: string
          notes: string | null
          patient_name: string | null
          phone_number: string | null
          report_id: string | null
        }
        Insert: {
          call_direction?: string | null
          call_duration?: number | null
          call_status?: string | null
          call_time?: string | null
          call_type?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          patient_name?: string | null
          phone_number?: string | null
          report_id?: string | null
        }
        Update: {
          call_direction?: string | null
          call_duration?: number | null
          call_status?: string | null
          call_time?: string | null
          call_type?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          patient_name?: string | null
          phone_number?: string | null
          report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_records_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          analysis_status: string | null
          context_data: Json | null
          file_path: string
          id: string
          name: string
          processed: boolean | null
          type: string
          uploaded_at: string
        }
        Insert: {
          analysis_status?: string | null
          context_data?: Json | null
          file_path: string
          id?: string
          name: string
          processed?: boolean | null
          type: string
          uploaded_at?: string
        }
        Update: {
          analysis_status?: string | null
          context_data?: Json | null
          file_path?: string
          id?: string
          name?: string
          processed?: boolean | null
          type?: string
          uploaded_at?: string
        }
        Relationships: []
      }
      social_media_analytics: {
        Row: {
          business_id: string
          created_at: string
          date: string
          followers_count: number | null
          id: string
          platform_id: string
          posts_count: number | null
          total_comments: number | null
          total_likes: number | null
          total_shares: number | null
          total_views: number | null
        }
        Insert: {
          business_id: string
          created_at?: string
          date: string
          followers_count?: number | null
          id?: string
          platform_id: string
          posts_count?: number | null
          total_comments?: number | null
          total_likes?: number | null
          total_shares?: number | null
          total_views?: number | null
        }
        Update: {
          business_id?: string
          created_at?: string
          date?: string
          followers_count?: number | null
          id?: string
          platform_id?: string
          posts_count?: number | null
          total_comments?: number | null
          total_likes?: number | null
          total_shares?: number | null
          total_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "social_media_analytics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_media_analytics_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "social_media_platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_platforms: {
        Row: {
          base_url: string | null
          created_at: string
          icon_name: string | null
          id: string
          name: string
        }
        Insert: {
          base_url?: string | null
          created_at?: string
          icon_name?: string | null
          id?: string
          name: string
        }
        Update: {
          base_url?: string | null
          created_at?: string
          icon_name?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      social_media_posts: {
        Row: {
          business_id: string
          comments_count: number | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number | null
          platform_id: string
          post_url: string | null
          published_at: string | null
          scheduled_at: string | null
          shares_count: number | null
          status: string
          title: string | null
          updated_at: string
          views_count: number | null
        }
        Insert: {
          business_id: string
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          platform_id: string
          post_url?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          shares_count?: number | null
          status?: string
          title?: string | null
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          business_id?: string
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          platform_id?: string
          post_url?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          shares_count?: number | null
          status?: string
          title?: string | null
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "social_media_posts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_media_posts_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "social_media_platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          created_at: string
          delivery_status: string | null
          id: string
          message_content: string | null
          message_type: string | null
          patient_name: string | null
          phone_number: string | null
          read_status: string | null
          report_id: string | null
          response: string | null
          sent_time: string | null
        }
        Insert: {
          created_at?: string
          delivery_status?: string | null
          id?: string
          message_content?: string | null
          message_type?: string | null
          patient_name?: string | null
          phone_number?: string | null
          read_status?: string | null
          report_id?: string | null
          response?: string | null
          sent_time?: string | null
        }
        Update: {
          created_at?: string
          delivery_status?: string | null
          id?: string
          message_content?: string | null
          message_type?: string | null
          patient_name?: string | null
          phone_number?: string | null
          read_status?: string | null
          report_id?: string | null
          response?: string | null
          sent_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
