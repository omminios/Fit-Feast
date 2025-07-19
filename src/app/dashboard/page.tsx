'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { pantryUtils, recipeUtils } from '@/lib/supabase-utils';
import { useRouter } from 'next/navigation';

interface PantryItem {
  id: string;
  status: string;
  ingredients: {
    id: string;
    name: string;
    category: string | null;
  };
}

interface Recipe {
  id: string;
  name: string;
  image_url: string | null;
  protein_g_per_serving: number;
  carbs_g_per_serving: number;
  fats_g_per_serving: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [makeableRecipes, setMakeableRecipes] = useState<Recipe[]>([]);
  const [nearMissRecipes, setNearMissRecipes] = useState<any[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pantry' | 'recipes' | 'saved'>('pantry');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [pantry, recipeSuggestions, saved] = await Promise.all([
        pantryUtils.getUserPantry(user.id),
        recipeUtils.getRecipeSuggestions(user.id),
        recipeUtils.getSavedRecipes(user.id),
      ]);
      const transformedPantry = (pantry || []).map(item => ({
        ...item,
        ingredients: Array.isArray(item.ingredients) ? item.ingredients[0] : item.ingredients,
      }));
      setPantryItems(transformedPantry);
      setMakeableRecipes(recipeSuggestions.makeableRecipes);
      setNearMissRecipes(recipeSuggestions.nearMissRecipes);
      setSavedRecipes(saved);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newIngredient.trim()) return;

    try {
      await pantryUtils.addToPantry(user.id, newIngredient.trim());
      setNewIngredient('');
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error adding ingredient:', error);
    }
  };

  const handleMarkAsUsed = async (pantryItemId: string) => {
    if (!user) return;

    try {
      await pantryUtils.markAsUsed(pantryItemId);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error marking ingredient as used:', error);
    }
  };

  const handleSaveRecipe = async (recipeId: string) => {
    if (!user) return;

    try {
      await recipeUtils.saveRecipe(user.id, recipeId);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your FitFeast dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FitFeast</h1>
              <p className="text-sm text-gray-600">Fuel your gains with smart meal planning</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pantry')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pantry'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pantry Power-Up
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recipes'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gainz-Fuel Recipes
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'saved'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Stacked Recipes
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'pantry' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Pantry</h2>
                
                {/* Add Ingredient Form */}
                <form onSubmit={handleAddIngredient} className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      placeholder="Add an ingredient (e.g., chicken breast, broccoli)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                </form>

                {/* Pantry Items List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pantryItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-900 capitalize">
                        {item.ingredients?.name || 'Unknown'}
                      </span>
                      <button
                        onClick={() => handleMarkAsUsed(item.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Mark Used
                      </button>
                    </div>
                  ))}
                </div>

                {pantryItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Your pantry is empty. Add some ingredients to get started!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'recipes' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recipes You Can Make ({makeableRecipes.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {makeableRecipes.map((recipe) => (
                  <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {recipe.image_url && (
                      <img
                        src={recipe.image_url}
                        alt={recipe.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{recipe.name}</h3>
                      
                      <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-blue-600">{recipe.protein_g_per_serving}g</div>
                          <div className="text-gray-500">Protein</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-orange-600">{recipe.carbs_g_per_serving}g</div>
                          <div className="text-gray-500">Carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-red-600">{recipe.fats_g_per_serving}g</div>
                          <div className="text-gray-500">Fats</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                        <span>Prep: {recipe.prep_time_minutes}m</span>
                        <span>Cook: {recipe.cook_time_minutes}m</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md text-sm hover:bg-green-700">
                          View Recipe
                        </button>
                        <button
                          onClick={() => handleSaveRecipe(recipe.id)}
                          className="bg-gray-200 text-gray-700 py-2 px-3 rounded-md text-sm hover:bg-gray-300"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {makeableRecipes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No recipes found for your current pantry. Add more ingredients to discover recipes!</p>
                </div>
              )}
              {/* Near-miss recipes */}
              <h2 className="text-xl font-semibold text-gray-900 mt-12 mb-4">
                Almost There! Buy 1-2 Ingredients to Make These ({nearMissRecipes.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearMissRecipes.map(({ recipe, missingIngredients }) => (
                  <div key={recipe.id} className="bg-yellow-50 rounded-lg shadow-md overflow-hidden border border-yellow-200">
                    {recipe.image_url && (
                      <img
                        src={recipe.image_url}
                        alt={recipe.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{recipe.name}</h3>
                      <div className="mb-2 text-sm text-gray-700">
                        <span className="font-medium">Missing Ingredients:</span>{' '}
                        {missingIngredients.map((ing: any, idx: number) => (
                          <span key={`${recipe.id}-${ing.id}`} className="inline-block bg-yellow-200 text-yellow-900 rounded px-2 py-1 mr-1">
                            {ing.name}
                            {idx < missingIngredients.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md text-sm hover:bg-green-700">
                          View Recipe
                        </button>
                        <button
                          onClick={() => handleSaveRecipe(recipe.id)}
                          className="bg-gray-200 text-gray-700 py-2 px-3 rounded-md text-sm hover:bg-gray-300"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {nearMissRecipes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No near-miss recipes found. Add more ingredients to unlock more recipes!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Saved Recipes ({savedRecipes.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((saved) => (
                  <div key={saved.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {saved.recipes.image_url && (
                      <img
                        src={saved.recipes.image_url}
                        alt={saved.recipes.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{saved.recipes.name}</h3>
                      
                      <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-blue-600">{saved.recipes.protein_g_per_serving}g</div>
                          <div className="text-gray-500">Protein</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-orange-600">{saved.recipes.carbs_g_per_serving}g</div>
                          <div className="text-gray-500">Carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-red-600">{saved.recipes.fats_g_per_serving}g</div>
                          <div className="text-gray-500">Fats</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                        <span>Prep: {saved.recipes.prep_time_minutes}m</span>
                        <span>Cook: {saved.recipes.cook_time_minutes}m</span>
                      </div>
                      
                      <button className="w-full bg-green-600 text-white py-2 px-3 rounded-md text-sm hover:bg-green-700">
                        View Recipe
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {savedRecipes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven't saved any recipes yet. Start exploring recipes to build your collection!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 