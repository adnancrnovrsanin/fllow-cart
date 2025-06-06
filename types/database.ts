export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      shopping_lists: {
        Row: {
          id: string;
          user_id: string;
          list_title: string;
          status: 'active' | 'template' | 'archived';
          is_currently_optimized: boolean;
          last_optimization_id: string | null;
          last_used_as_checklist_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          list_title: string;
          status?: 'active' | 'template' | 'archived';
          is_currently_optimized?: boolean;
          last_optimization_id?: string | null;
          last_used_as_checklist_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          list_title?: string;
          status?: 'active' | 'template' | 'archived';
          is_currently_optimized?: boolean;
          last_optimization_id?: string | null;
          last_used_as_checklist_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      list_items: {
        Row: {
          id: string;
          list_id: string;
          item_name: string;
          quantity: number;
          unit: string | null;
          category_user_defined: string | null;
          notes_by_user: string | null;
          preferred_store_name_user: string | null;
          target_price_per_unit_user: number | null;
          optimized_price_per_unit: number | null;
          optimized_store_name: string | null;
          is_ticked_off: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          list_id: string;
          item_name: string;
          quantity?: number;
          unit?: string | null;
          category_user_defined?: string | null;
          notes_by_user?: string | null;
          preferred_store_name_user?: string | null;
          target_price_per_unit_user?: number | null;
          optimized_price_per_unit?: number | null;
          optimized_store_name?: string | null;
          is_ticked_off?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          list_id?: string;
          item_name?: string;
          quantity?: number;
          unit?: string | null;
          category_user_defined?: string | null;
          notes_by_user?: string | null;
          preferred_store_name_user?: string | null;
          target_price_per_unit_user?: number | null;
          optimized_price_per_unit?: number | null;
          optimized_store_name?: string | null;
          is_ticked_off?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      list_optimizations: {
        Row: {
          id: string;
          list_id: string;
          optimization_status: 'settings_defined' | 'in_progress' | 'completed' | 'accepted' | 'rejected' | 'failed';
          calculated_potential_savings: number | null;
          optimization_started_at: string;
          optimization_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          list_id: string;
          optimization_status?: 'settings_defined' | 'in_progress' | 'completed' | 'accepted' | 'rejected' | 'failed';
          calculated_potential_savings?: number | null;
          optimization_started_at?: string;
          optimization_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          list_id?: string;
          optimization_status?: 'settings_defined' | 'in_progress' | 'completed' | 'accepted' | 'rejected' | 'failed';
          calculated_potential_savings?: number | null;
          optimization_started_at?: string;
          optimization_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type ShoppingList = Database['public']['Tables']['shopping_lists']['Row'];
export type ListItem = Database['public']['Tables']['list_items']['Row'];
export type ListOptimization = Database['public']['Tables']['list_optimizations']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];