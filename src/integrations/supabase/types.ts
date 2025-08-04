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
      market_request_upvotes: {
        Row: {
          created_at: string | null
          id: string
          request_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          request_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          request_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_request_upvotes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "market_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_request_upvotes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "market_requests_with_votes"
            referencedColumns: ["id"]
          },
        ]
      }
      market_requests: {
        Row: {
          category: string
          close_date: string
          created_at: string
          description: string
          id: string
          market_id: string | null
          question: string
          rejection_reason: string | null
          requested_by: string
          status: string
        }
        Insert: {
          category: string
          close_date: string
          created_at?: string
          description: string
          id?: string
          market_id?: string | null
          question: string
          rejection_reason?: string | null
          requested_by: string
          status?: string
        }
        Update: {
          category?: string
          close_date?: string
          created_at?: string
          description?: string
          id?: string
          market_id?: string | null
          question?: string
          rejection_reason?: string | null
          requested_by?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_requests_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      markets: {
        Row: {
          category: string
          close_date: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          liquidity: number
          no_price: number
          question: string
          status: string
          updated_at: string
          volume: number
          yes_price: number
        }
        Insert: {
          category: string
          close_date: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          liquidity?: number
          no_price?: number
          question: string
          status?: string
          updated_at?: string
          volume?: number
          yes_price?: number
        }
        Update: {
          category?: string
          close_date?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          liquidity?: number
          no_price?: number
          question?: string
          status?: string
          updated_at?: string
          volume?: number
          yes_price?: number
        }
        Relationships: []
      }
      positions: {
        Row: {
          average_price: number
          created_at: string
          id: string
          market_id: string
          position: string
          shares: number
          updated_at: string
          user_id: string
        }
        Insert: {
          average_price: number
          created_at?: string
          id?: string
          market_id: string
          position: string
          shares: number
          updated_at?: string
          user_id: string
        }
        Update: {
          average_price?: number
          created_at?: string
          id?: string
          market_id?: string
          position?: string
          shares?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          id: string
          market_id: string
          no_price: number
          timestamp: string
          yes_price: number
        }
        Insert: {
          id?: string
          market_id: string
          no_price: number
          timestamp?: string
          yes_price: number
        }
        Update: {
          id?: string
          market_id?: string
          no_price?: number
          timestamp?: string
          yes_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "price_history_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
          username: string | null
          wallet_balance: number
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          updated_at?: string
          username?: string | null
          wallet_balance?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
          username?: string | null
          wallet_balance?: number
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          coins_spent: number
          id: string
          redeemed_at: string
          status: string
          user_id: string
          voucher_id: string
        }
        Insert: {
          coins_spent: number
          id?: string
          redeemed_at?: string
          status?: string
          user_id: string
          voucher_id: string
        }
        Update: {
          coins_spent?: number
          id?: string
          redeemed_at?: string
          status?: string
          user_id?: string
          voucher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_voucher_id_fkey"
            columns: ["voucher_id"]
            isOneToOne: false
            referencedRelation: "vouchers"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          balance: number
          created_at: string
          id: string
          market_id: string
          position: string | null
          price: number | null
          shares: number | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance: number
          created_at?: string
          id?: string
          market_id: string
          position?: string | null
          price?: number | null
          shares?: number | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance?: number
          created_at?: string
          id?: string
          market_id?: string
          position?: string | null
          price?: number | null
          shares?: number | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      vouchers: {
        Row: {
          available_quantity: number
          brand_name: string
          coin_cost: number
          created_at: string
          description: string
          id: string
          image_url: string | null
        }
        Insert: {
          available_quantity?: number
          brand_name: string
          coin_cost: number
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
        }
        Update: {
          available_quantity?: number
          brand_name?: string
          coin_cost?: number
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      market_requests_with_votes: {
        Row: {
          category: string | null
          close_date: string | null
          created_at: string | null
          description: string | null
          has_user_upvoted: boolean | null
          id: string | null
          market_id: string | null
          question: string | null
          rejection_reason: string | null
          requested_by: string | null
          status: string | null
          upvotes_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_requests_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
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
