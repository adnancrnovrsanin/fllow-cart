import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { ShoppingList, ListItem, ListOptimization } from '@/types/database';

interface ShoppingState {
  lists: ShoppingList[];
  currentList: ShoppingList | null;
  currentItems: ListItem[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchLists: () => Promise<void>;
  createList: (title: string) => Promise<ShoppingList | null>;
  updateList: (id: string, updates: Partial<ShoppingList>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  
  fetchListItems: (listId: string) => Promise<void>;
  addItem: (listId: string, item: Partial<ListItem>) => Promise<void>;
  updateItem: (id: string, updates: Partial<ListItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleItemTicked: (id: string) => Promise<void>;
  
  setCurrentList: (list: ShoppingList | null) => void;
  clearError: () => void;
}

export const useShoppingStore = create<ShoppingState>((set, get) => ({
  lists: [],
  currentList: null,
  currentItems: [],
  loading: false,
  error: null,

  fetchLists: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .in('status', ['active', 'template'])
        .order('updated_at', { ascending: false });

      if (error) throw error;
      set({ lists: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  createList: async (title: string) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('shopping_lists')
        .insert({
          user_id: user.id,
          list_title: title,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      
      const { lists } = get();
      set({ lists: [data, ...lists] });
      return data;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  updateList: async (id: string, updates: Partial<ShoppingList>) => {
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      const { lists, currentList } = get();
      const updatedLists = lists.map(list => 
        list.id === id ? { ...list, ...updates } : list
      );
      
      set({ 
        lists: updatedLists,
        currentList: currentList?.id === id ? { ...currentList, ...updates } : currentList
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteList: async (id: string) => {
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { lists } = get();
      set({ lists: lists.filter(list => list.id !== id) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  fetchListItems: async (listId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('list_items')
        .select('*')
        .eq('list_id', listId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      set({ currentItems: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (listId: string, item: Partial<ListItem>) => {
    try {
      const { currentItems } = get();
      const maxSortOrder = Math.max(...currentItems.map(i => i.sort_order), 0);

      const { data, error } = await supabase
        .from('list_items')
        .insert({
          list_id: listId,
          item_name: item.item_name || '',
          quantity: item.quantity || 1,
          unit: item.unit,
          category_user_defined: item.category_user_defined,
          notes_by_user: item.notes_by_user,
          preferred_store_name_user: item.preferred_store_name_user,
          target_price_per_unit_user: item.target_price_per_unit_user,
          sort_order: maxSortOrder + 1,
        })
        .select()
        .single();

      if (error) throw error;
      
      set({ currentItems: [...currentItems, data] });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateItem: async (id: string, updates: Partial<ListItem>) => {
    try {
      const { error } = await supabase
        .from('list_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      const { currentItems } = get();
      const updatedItems = currentItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      
      set({ currentItems: updatedItems });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteItem: async (id: string) => {
    try {
      const { error } = await supabase
        .from('list_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { currentItems } = get();
      set({ currentItems: currentItems.filter(item => item.id !== id) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  toggleItemTicked: async (id: string) => {
    try {
      const { currentItems } = get();
      const item = currentItems.find(i => i.id === id);
      if (!item) return;

      const { error } = await supabase
        .from('list_items')
        .update({ 
          is_ticked_off: !item.is_ticked_off,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      const updatedItems = currentItems.map(item => 
        item.id === id ? { ...item, is_ticked_off: !item.is_ticked_off } : item
      );
      
      set({ currentItems: updatedItems });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  setCurrentList: (list: ShoppingList | null) => {
    set({ currentList: list });
  },

  clearError: () => {
    set({ error: null });
  },
}));