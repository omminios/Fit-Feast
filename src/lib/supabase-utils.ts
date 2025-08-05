import { supabase } from './supabase';
import type { Database } from './supabase';

type User = Database['public']['Tables']['users']['Row'];
type Ingredient = Database['public']['Tables']['ingredients']['Row'];
type Recipe = Database['public']['Tables']['recipes']['Row'];
type UserPantryItem = Database['public']['Tables']['user_pantry_items']['Row'];

// Authentication utilities
export const authUtils = {
  // Sign up with email and password
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data;
  },

  // Get current user
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data;
  },
};

// Pantry utilities
export const pantryUtils = {
  // Get user's available pantry items
  async getUserPantry(userId: string) {
    const { data, error } = await supabase
      .from('user_pantry_items')
      .select(`
        id,
        status,
        quantity,
        unit,
        expiration_date,
        added_at,
        ingredients:ingredient_id (
          id,
          name,
          category,
          protein_per_100g,
          carbs_per_100g,
          fats_per_100g
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'available');
    
    if (error) throw error;
    return data;
  },

  // Add ingredient to pantry with quantity, unit, and optional expiration date
  async addToPantry(userId: string, ingredientName: string, quantity: number = 1, unit: string = 'piece', expirationDate?: string) {
    // First, find or create the ingredient
    let { data: ingredient, error: ingredientError } = await supabase
      .from('ingredients')
      .select('id')
      .eq('name', ingredientName.toLowerCase())
      .single();
    
    if (ingredientError && ingredientError.code !== 'PGRST116') {
      throw ingredientError;
    }
    
    // If ingredient doesn't exist, create it
    if (!ingredient) {
      const { data: newIngredient, error: createError } = await supabase
        .from('ingredients')
        .insert({ name: ingredientName.toLowerCase() })
        .select('id')
        .single();
      
      if (createError) throw createError;
      ingredient = newIngredient;
    }
    
    // Check if the user already has this ingredient in their pantry (used or available)
    const { data: existingPantryItem, error: pantryError } = await supabase
      .from('user_pantry_items')
      .select('id, status, quantity, unit, expiration_date')
      .eq('user_id', userId)
      .eq('ingredient_id', ingredient.id)
      .single();
    
    if (pantryError && pantryError.code !== 'PGRST116') {
      throw pantryError;
    }
    
    if (existingPantryItem) {
      if (existingPantryItem.status === 'used') {
        // Update status to available and update quantity/unit and expiration date
        const { data, error } = await supabase
          .from('user_pantry_items')
          .update({ 
            status: 'available',
            quantity: quantity,
            unit: unit,
            expiration_date: expirationDate || null
          })
          .eq('id', existingPantryItem.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        // Already available, update quantity and expiration date
        const { data, error } = await supabase
          .from('user_pantry_items')
          .update({ 
            quantity: existingPantryItem.quantity + quantity,
            unit: unit,
            expiration_date: expirationDate || existingPantryItem.expiration_date
          })
          .eq('id', existingPantryItem.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    }
    
    // Add to user's pantry
    const { data, error } = await supabase
      .from('user_pantry_items')
      .insert({
        user_id: userId,
        ingredient_id: ingredient.id,
        quantity: quantity,
        unit: unit,
        status: 'available',
        expiration_date: expirationDate || null,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update pantry item quantity
  async updatePantryItemQuantity(pantryItemId: string, quantity: number, unit: string) {
    const { data, error } = await supabase
      .from('user_pantry_items')
      .update({ quantity: quantity, unit: unit })
      .eq('id', pantryItemId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update pantry item expiration date
  async updatePantryItemExpiration(pantryItemId: string, expirationDate: string | null) {
    const { data, error } = await supabase
      .from('user_pantry_items')
      .update({ expiration_date: expirationDate })
      .eq('id', pantryItemId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Mark ingredient as used
  async markAsUsed(pantryItemId: string) {
    const { data, error } = await supabase
      .from('user_pantry_items')
      .update({ status: 'used' })
      .eq('id', pantryItemId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Remove ingredient from pantry
  async removeFromPantry(pantryItemId: string) {
    const { error } = await supabase
      .from('user_pantry_items')
      .delete()
      .eq('id', pantryItemId);
    
    if (error) throw error;
  },

  // Get ingredient macros
  async getIngredientMacros(ingredientId: string) {
    const { data, error } = await supabase
      .from('ingredients')
      .select('protein_per_100g, carbs_per_100g, fats_per_100g')
      .eq('id', ingredientId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Calculate total macros for a pantry item
  async calculatePantryItemMacros(pantryItemId: string) {
    const { data: pantryItem, error: pantryError } = await supabase
      .from('user_pantry_items')
      .select(`
        quantity,
        unit,
        ingredients:ingredient_id (
          protein_per_100g,
          carbs_per_100g,
          fats_per_100g
        )
      `)
      .eq('id', pantryItemId)
      .single();
    
    if (pantryError) throw pantryError;
    
    const ingredient = pantryItem.ingredients as any;
    const quantity = pantryItem.quantity;
    
    // For now, we'll assume the quantity is in grams for macro calculation
    // In a real app, you'd have conversion factors for different units
    const conversionFactor = quantity / 100; // assuming quantity is in grams
    
    return {
      protein: ingredient.protein_per_100g * conversionFactor,
      carbs: ingredient.carbs_per_100g * conversionFactor,
      fats: ingredient.fats_per_100g * conversionFactor,
    };
  },
};

// Recipe utilities
export const recipeUtils = {
  // Get recipes that can be made with user's pantry and those that are near-miss (missing 1-2 ingredients)
  async getRecipeSuggestions(userId: string) {
    // Get user's available ingredients
    const pantryItems = await pantryUtils.getUserPantry(userId);
    const userIngredientIds = pantryItems.map(item => (item.ingredients as any).id);

    // Get all recipes and their required ingredients
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          ingredient_id,
          quantity,
          unit,
          ingredients (
            id,
            name,
            protein_per_100g,
            carbs_per_100g,
            fats_per_100g
          )
        )
      `);
    if (error) throw error;

    const makeableRecipes = [];
    const nearMissRecipes = [];

    for (const recipe of recipes || []) {
      const requiredIngredients = (recipe.recipe_ingredients as any[]).map((ri: any) => ri.ingredient_id);
      const requiredIngredientObjs = (recipe.recipe_ingredients as any[]).map((ri: any) => ri.ingredients);
      const availableIngredients = requiredIngredients.filter((id: string) => userIngredientIds.includes(id));
      const missingIngredients = requiredIngredientObjs.filter((ing: any) => !userIngredientIds.includes(ing.id));
      const matchPercentage = availableIngredients.length / requiredIngredients.length;

      if (matchPercentage >= 0.8) {
        makeableRecipes.push(recipe);
      } else if (missingIngredients.length > 0 && missingIngredients.length <= 2) {
        nearMissRecipes.push({
          recipe,
          missingIngredients,
        });
      }
    }

    return { makeableRecipes, nearMissRecipes };
  },

  // Get recipe by ID
  async getRecipeById(recipeId: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          quantity,
          unit,
          ingredients (
            id,
            name,
            category,
            protein_per_100g,
            carbs_per_100g,
            fats_per_100g
          )
        )
      `)
      .eq('id', recipeId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Save recipe to user's collection
  async saveRecipe(userId: string, recipeId: string) {
    const { data, error } = await supabase
      .from('saved_recipes')
      .insert({
        user_id: userId,
        recipe_id: recipeId,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user's saved recipes
  async getSavedRecipes(userId: string) {
    const { data, error } = await supabase
      .from('saved_recipes')
      .select(`
        saved_at,
        recipes (
          id,
          name,
          image_url,
          protein_g_per_serving,
          carbs_g_per_serving,
          fats_g_per_serving,
          prep_time_minutes,
          cook_time_minutes
        )
      `)
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Remove recipe from saved collection
  async removeSavedRecipe(userId: string, recipeId: string) {
    const { error } = await supabase
      .from('saved_recipes')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);
    
    if (error) throw error;
  },
}; 