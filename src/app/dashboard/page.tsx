'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { pantryUtils, recipeUtils } from '@/lib/supabase-utils';
import { useRouter } from 'next/navigation';
import IngredientAutocomplete from '@/components/IngredientAutocomplete';
import MacroDoughnutChart from '@/components/MacroDoughnutChart';

interface PantryItem {
  id: string;
  status: string;
  quantity: number;
  unit: string;
  expiration_date: string | null;
  ingredients: {
    id: string;
    name: string;
    category: string | null;
    protein_per_100g: number;
    carbs_per_100g: number;
    fats_per_100g: number;
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pantry' | 'recipes' | 'saved'>('pantry');

  // Function to get appropriate units based on ingredient category and name
  const getAppropriateUnits = (ingredient: any) => {
    const { category, name } = ingredient;
    
    // Protein-based units
    if (category === 'Protein') {
      if (name.includes('breast') || name.includes('steak') || name.includes('chop')) {
        return [
          { value: 'piece', label: 'piece(s)' },
          { value: 'oz', label: 'oz' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'lb', label: 'lb' }
        ];
      }
      if (name.includes('ground') || name.includes('mince')) {
        return [
          { value: 'oz', label: 'oz' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'lb', label: 'lb' },
          { value: 'cup', label: 'cup(s)' }
        ];
      }
      if (name.includes('fish') || name.includes('salmon') || name.includes('tuna') || name.includes('tilapia') || name.includes('cod')) {
        return [
          { value: 'fillet', label: 'fillet(s)' },
          { value: 'oz', label: 'oz' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'piece', label: 'piece(s)' }
        ];
      }
      if (name.includes('shrimp') || name.includes('prawn')) {
        return [
          { value: 'piece', label: 'piece(s)' },
          { value: 'oz', label: 'oz' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'cup', label: 'cup(s)' }
        ];
      }
      if (name.includes('egg')) {
        return [
          { value: 'piece', label: 'piece(s)' },
          { value: 'whites', label: 'white(s)' },
          { value: 'yolks', label: 'yolk(s)' }
        ];
      }
      if (name.includes('protein powder')) {
        return [
          { value: 'scoop', label: 'scoop(s)' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'oz', label: 'oz' }
        ];
      }
      // Default protein units
      return [
        { value: 'oz', label: 'oz' },
        { value: 'gram', label: 'gram(s)' },
        { value: 'lb', label: 'lb' },
        { value: 'piece', label: 'piece(s)' }
      ];
    }

    // Vegetable-based units
    if (category === 'Vegetable') {
      if (name.includes('leafy') || name.includes('spinach') || name.includes('kale') || name.includes('lettuce')) {
        return [
          { value: 'cup', label: 'cup(s)' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'oz', label: 'oz' },
          { value: 'handful', label: 'handful(s)' }
        ];
      }
      if (name.includes('pepper') || name.includes('tomato') || name.includes('cucumber') || name.includes('zucchini')) {
        return [
          { value: 'piece', label: 'piece(s)' },
          { value: 'cup', label: 'cup(s)' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'oz', label: 'oz' }
        ];
      }
      if (name.includes('onion') || name.includes('garlic')) {
        return [
          { value: 'piece', label: 'piece(s)' },
          { value: 'clove', label: 'clove(s)' },
          { value: 'cup', label: 'cup(s)' },
          { value: 'gram', label: 'gram(s)' }
        ];
      }
      // Default vegetable units
      return [
        { value: 'cup', label: 'cup(s)' },
        { value: 'piece', label: 'piece(s)' },
        { value: 'gram', label: 'gram(s)' },
        { value: 'oz', label: 'oz' }
      ];
    }

    // Grain-based units
    if (category === 'Grain') {
      if (name.includes('rice') || name.includes('quinoa') || name.includes('oats') || name.includes('pasta')) {
        return [
          { value: 'cup', label: 'cup(s)' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'oz', label: 'oz' },
          { value: 'tbsp', label: 'tbsp' }
        ];
      }
      if (name.includes('bread')) {
        return [
          { value: 'slice', label: 'slice(s)' },
          { value: 'piece', label: 'piece(s)' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'oz', label: 'oz' }
        ];
      }
      // Default grain units
      return [
        { value: 'cup', label: 'cup(s)' },
        { value: 'gram', label: 'gram(s)' },
        { value: 'oz', label: 'oz' },
        { value: 'tbsp', label: 'tbsp' }
      ];
    }

    // Fat-based units
    if (category === 'Fat') {
      if (name.includes('oil')) {
        return [
          { value: 'tbsp', label: 'tbsp' },
          { value: 'tsp', label: 'tsp' },
          { value: 'ml', label: 'ml' },
          { value: 'cup', label: 'cup(s)' }
        ];
      }
      if (name.includes('nut') || name.includes('seed')) {
        return [
          { value: 'cup', label: 'cup(s)' },
          { value: 'tbsp', label: 'tbsp' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'oz', label: 'oz' }
        ];
      }
      if (name.includes('butter') || name.includes('peanut') || name.includes('almond')) {
        return [
          { value: 'tbsp', label: 'tbsp' },
          { value: 'tsp', label: 'tsp' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'oz', label: 'oz' }
        ];
      }
      // Default fat units
      return [
        { value: 'tbsp', label: 'tbsp' },
        { value: 'tsp', label: 'tsp' },
        { value: 'gram', label: 'gram(s)' },
        { value: 'oz', label: 'oz' }
      ];
    }

    // Dairy-based units
    if (category === 'Dairy') {
      if (name.includes('milk')) {
        return [
          { value: 'cup', label: 'cup(s)' },
          { value: 'ml', label: 'ml' },
          { value: 'oz', label: 'oz' },
          { value: 'tbsp', label: 'tbsp' }
        ];
      }
      if (name.includes('cheese')) {
        return [
          { value: 'oz', label: 'oz' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'cup', label: 'cup(s)' },
          { value: 'slice', label: 'slice(s)' }
        ];
      }
      if (name.includes('yogurt')) {
        return [
          { value: 'cup', label: 'cup(s)' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'oz', label: 'oz' },
          { value: 'tbsp', label: 'tbsp' }
        ];
      }
      // Default dairy units
      return [
        { value: 'cup', label: 'cup(s)' },
        { value: 'gram', label: 'gram(s)' },
        { value: 'oz', label: 'oz' },
        { value: 'tbsp', label: 'tbsp' }
      ];
    }

    // Fruit-based units
    if (category === 'Fruit') {
      if (name.includes('berry')) {
        return [
          { value: 'cup', label: 'cup(s)' },
          { value: 'gram', label: 'gram(s)' },
          { value: 'oz', label: 'oz' },
          { value: 'piece', label: 'piece(s)' }
        ];
      }
      // Default fruit units
      return [
        { value: 'piece', label: 'piece(s)' },
        { value: 'cup', label: 'cup(s)' },
        { value: 'gram', label: 'gram(s)' },
        { value: 'oz', label: 'oz' }
      ];
    }

    // Seasoning-based units
    if (category === 'Seasoning') {
      return [
        { value: 'tsp', label: 'tsp' },
        { value: 'tbsp', label: 'tbsp' },
        { value: 'gram', label: 'gram(s)' },
        { value: 'pinch', label: 'pinch(es)' }
      ];
    }

    // Default units for any other category
    return [
      { value: 'piece', label: 'piece(s)' },
      { value: 'cup', label: 'cup(s)' },
      { value: 'gram', label: 'gram(s)' },
      { value: 'oz', label: 'oz' },
      { value: 'tbsp', label: 'tbsp' },
      { value: 'tsp', label: 'tsp' }
    ];
  };

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

  const handleAddIngredient = async (ingredient: any, quantity: number, unit: string, expirationDate?: string) => {
    if (!user) return;

    try {
      await pantryUtils.addToPantry(user.id, ingredient.name, quantity, unit, expirationDate);
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

  const handleUpdateQuantity = async (pantryItemId: string, quantity: number, unit: string) => {
    if (!user) return;

    try {
      await pantryUtils.updatePantryItemQuantity(pantryItemId, quantity, unit);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating ingredient quantity:', error);
    }
  };

  const handleUpdateExpiration = async (pantryItemId: string, expirationDate: string | null) => {
    if (!user) return;

    try {
      await pantryUtils.updatePantryItemExpiration(pantryItemId, expirationDate);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating ingredient expiration date:', error);
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
                <div className="mb-6">
                  <IngredientAutocomplete
                    onSelect={handleAddIngredient}
                    placeholder="Add an ingredient (e.g., chicken breast, broccoli)"
                  />
                </div>

                {/* Pantry Items List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pantryItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 capitalize">
                            {item.ingredients?.name || 'Unknown'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.quantity} {item.unit}
                          </p>
                          {/* Expiration Date Display */}
                          {item.expiration_date && (
                            <div className="mt-1">
                              {(() => {
                                const today = new Date();
                                const expirationDate = new Date(item.expiration_date);
                                const daysUntilExpiry = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                
                                let statusClass = '';
                                let statusText = '';
                                
                                if (daysUntilExpiry < 0) {
                                  statusClass = 'text-red-600 bg-red-50';
                                  statusText = `Expired ${Math.abs(daysUntilExpiry)} days ago`;
                                } else if (daysUntilExpiry <= 3) {
                                  statusClass = 'text-orange-600 bg-orange-50';
                                  statusText = `Expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`;
                                } else if (daysUntilExpiry <= 7) {
                                  statusClass = 'text-yellow-600 bg-yellow-50';
                                  statusText = `Expires in ${daysUntilExpiry} days`;
                                } else {
                                  statusClass = 'text-green-600 bg-green-50';
                                  statusText = `Expires in ${daysUntilExpiry} days`;
                                }
                                
                                return (
                                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${statusClass}`}>
                                    {statusText}
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleMarkAsUsed(item.id)}
                          className="text-sm text-red-600 hover:text-red-800 ml-2"
                        >
                          Mark Used
                        </button>
                      </div>
                      
                      {/* Macros Display */}
                      <div className="mb-3">
                        <MacroDoughnutChart
                          data={{
                            protein: parseFloat(((item.ingredients?.protein_per_100g || 0) * item.quantity / 100).toFixed(1)),
                            carbs: parseFloat(((item.ingredients?.carbs_per_100g || 0) * item.quantity / 100).toFixed(1)),
                            fats: parseFloat(((item.ingredients?.fats_per_100g || 0) * item.quantity / 100).toFixed(1))
                          }}
                          size={100}
                          showLegend={true}
                          centerText={`${((item.ingredients?.protein_per_100g || 0) * item.quantity / 100).toFixed(1)}g`}
                        />
                      </div>
                      
                      {/* Quantity Update */}
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseFloat(e.target.value) || 1;
                            handleUpdateQuantity(item.id, newQuantity, item.unit);
                          }}
                          className="flex-1 border rounded px-2 py-1 text-sm"
                        />
                        <select
                          value={item.unit}
                          onChange={(e) => handleUpdateQuantity(item.id, item.quantity, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          {getAppropriateUnits(item.ingredients).map((unitOption) => (
                            <option key={unitOption.value} value={unitOption.value}>
                              {unitOption.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Expiration Date Update */}
                      <div className="mt-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Expiration Date</label>
                        <input
                          type="date"
                          value={item.expiration_date || ''}
                          onChange={(e) => handleUpdateExpiration(item.id, e.target.value || null)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full border rounded px-2 py-1 text-xs"
                          placeholder="Optional"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {item.expiration_date ? 'Click to edit' : 'Add expiration date to reduce waste'}
                        </p>
                      </div>
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
                      
                      <div className="mb-3">
                        <MacroDoughnutChart
                          data={{
                            protein: recipe.protein_g_per_serving,
                            carbs: recipe.carbs_g_per_serving,
                            fats: recipe.fats_g_per_serving
                          }}
                          size={120}
                          showLegend={true}
                          centerText={`${recipe.protein_g_per_serving}g`}
                        />
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
                      
                      <div className="mb-3">
                        <MacroDoughnutChart
                          data={{
                            protein: recipe.protein_g_per_serving,
                            carbs: recipe.carbs_g_per_serving,
                            fats: recipe.fats_g_per_serving
                          }}
                          size={100}
                          showLegend={true}
                          centerText={`${recipe.protein_g_per_serving}g`}
                        />
                      </div>
                      
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
                      
                      <div className="mb-3">
                        <MacroDoughnutChart
                          data={{
                            protein: saved.recipes.protein_g_per_serving,
                            carbs: saved.recipes.carbs_g_per_serving,
                            fats: saved.recipes.fats_g_per_serving
                          }}
                          size={120}
                          showLegend={true}
                          centerText={`${saved.recipes.protein_g_per_serving}g`}
                        />
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