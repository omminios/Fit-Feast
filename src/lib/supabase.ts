import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          created_at?: string;
        };
      };
      ingredients: {
        Row: {
          id: string;
          name: string;
          category: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string | null;
        };
      };
      user_pantry_items: {
        Row: {
          id: string;
          user_id: string;
          ingredient_id: string;
          status: 'available' | 'used';
          added_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ingredient_id: string;
          status?: 'available' | 'used';
          added_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ingredient_id?: string;
          status?: 'available' | 'used';
          added_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          name: string;
          instructions: string;
          prep_time_minutes: number;
          cook_time_minutes: number;
          protein_g_per_serving: number;
          carbs_g_per_serving: number;
          fats_g_per_serving: number;
          servings: number;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          instructions: string;
          prep_time_minutes: number;
          cook_time_minutes: number;
          protein_g_per_serving: number;
          carbs_g_per_serving: number;
          fats_g_per_serving: number;
          servings: number;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          instructions?: string;
          prep_time_minutes?: number;
          cook_time_minutes?: number;
          protein_g_per_serving?: number;
          carbs_g_per_serving?: number;
          fats_g_per_serving?: number;
          servings?: number;
          image_url?: string | null;
          created_at?: string;
        };
      };
      recipe_ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          ingredient_id: string;
          quantity: string;
          unit: string | null;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          ingredient_id: string;
          quantity: string;
          unit?: string | null;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          ingredient_id?: string;
          quantity?: string;
          unit?: string | null;
        };
      };
      saved_recipes: {
        Row: {
          id: string;
          user_id: string;
          recipe_id: string;
          saved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipe_id: string;
          saved_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          recipe_id?: string;
          saved_at?: string;
        };
      };
    };
  };
} 