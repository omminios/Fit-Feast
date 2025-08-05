import React, { useState, useEffect } from 'react';
import { useCombobox } from 'downshift';
import { supabase } from '../lib/supabase';
import MacroDoughnutChart from './MacroDoughnutChart';

interface Ingredient {
  id: string;
  name: string;
  category: string | null;
  protein_per_100g: number;
  carbs_per_100g: number;
  fats_per_100g: number;
}

interface IngredientAutocompleteProps {
  onSelect: (ingredient: Ingredient, quantity: number, unit: string, expirationDate?: string) => void;
  placeholder?: string;
}

const IngredientAutocomplete: React.FC<IngredientAutocompleteProps> = ({ onSelect, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('piece');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [showExpirationDate, setShowExpirationDate] = useState(false);

  // Function to get appropriate units based on ingredient category and name
  const getAppropriateUnits = (ingredient: Ingredient) => {
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
    if (!inputValue) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    const handler = setTimeout(async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select('id, name, category, protein_per_100g, carbs_per_100g, fats_per_100g')
        .ilike('name', `%${inputValue}%`)
        .order('name')
        .limit(10);
      if (!error && data) {
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
      setLoading(false);
    }, 200); // debounce
    return () => clearTimeout(handler);
  }, [inputValue]);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox<Ingredient>({
    items: suggestions,
    inputValue,
    onInputValueChange: ({ inputValue }) => setInputValue(inputValue || ''),
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        setInputValue(selectedItem.name);
        setSelectedIngredient(selectedItem);
        // Set default unit based on ingredient type
        const appropriateUnits = getAppropriateUnits(selectedItem);
        setUnit(appropriateUnits[0].value);
      }
    },
    itemToString: (item) => (item ? item.name : ''),
  });

  const handleAddIngredient = () => {
    if (selectedIngredient) {
      onSelect(selectedIngredient, quantity, unit, showExpirationDate ? expirationDate : undefined);
      setSelectedIngredient(null);
      setInputValue('');
      setQuantity(1);
      setUnit('piece');
      setExpirationDate('');
      setShowExpirationDate(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder={placeholder || 'Type ingredient...'}
          {...getInputProps()}
          autoComplete="off"
        />
        <ul
          {...getMenuProps()}
          className={`absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-auto ${!isOpen ? 'hidden' : ''}`}
        >
          {isOpen && (
            loading ? (
              <li className="px-3 py-2 text-gray-500">Loading...</li>
            ) : suggestions.length === 0 ? (
              <li className="px-3 py-2 text-gray-500">No ingredients found</li>
            ) : (
              suggestions.map((item, index) => (
                <li
                  key={item.id}
                  {...getItemProps({ item, index })}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${highlightedIndex === index ? 'bg-gray-100' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <MacroDoughnutChart
                        data={{
                          protein: item.protein_per_100g,
                          carbs: item.carbs_per_100g,
                          fats: item.fats_per_100g
                        }}
                        size={50}
                        showLegend={false}
                        centerText={`${item.protein_per_100g}g`}
                      />
                    </div>
                  </div>
                  {item.category && (
                    <div className="text-xs text-gray-400 capitalize">{item.category}</div>
                  )}
                </li>
              ))
            )
          )}
        </ul>
      </div>

      {selectedIngredient && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-green-900">{selectedIngredient.name}</h4>
            <div className="flex items-center gap-2">
              <MacroDoughnutChart
                data={{
                  protein: selectedIngredient.protein_per_100g,
                  carbs: selectedIngredient.carbs_per_100g,
                  fats: selectedIngredient.fats_per_100g
                }}
                size={80}
                showLegend={false}
                centerText={`${selectedIngredient.protein_per_100g}g`}
              />
              <div className="text-xs text-gray-600">
                per 100g
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                {getAppropriateUnits(selectedIngredient).map((unitOption) => (
                  <option key={unitOption.value} value={unitOption.value}>
                    {unitOption.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Expiration Date Section */}
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="showExpirationDate"
                checked={showExpirationDate}
                onChange={(e) => setShowExpirationDate(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="showExpirationDate" className="text-sm font-medium text-gray-700">
                Add expiration date (recommended for fresh ingredients)
              </label>
            </div>
            
            {showExpirationDate && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This helps you use ingredients before they expire and reduce food waste!
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleAddIngredient}
            className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-md text-sm hover:bg-green-700"
          >
            Add to Pantry
          </button>
        </div>
      )}
    </div>
  );
};

export default IngredientAutocomplete; 