# Macro Doughnut Chart Feature

## Overview

The macro doughnut chart feature provides a visual representation of protein, carbs, and fats using hollow circular charts with the legend positioned next to the chart. This creates a cleaner, more modern look while maintaining clear macro information display.

## Features

### Visual Design
- **Hollow Doughnut Charts**: Clean circular charts with hollow centers
- **Center Information**: Displays key macro information in the center (e.g., protein grams)
- **Side-by-Side Legend**: Legend positioned next to the chart, not below
- **Color-Coded Slices**: 
  - 🔵 Blue: Protein
  - 🟡 Orange: Carbs  
  - 🔴 Red: Fats
- **Detailed Legend**: Shows exact gram amounts for each macro

### Implementation Locations

#### 1. Pantry Items
- **Location**: Pantry Power-Up tab
- **Size**: 100px diameter
- **Center Text**: Shows protein grams for the specific quantity
- **Legend**: Full legend with gram amounts
- **Data**: Calculated based on ingredient quantity and per-100g macros

#### 2. Recipe Cards
- **Location**: Gainz-Fuel Recipes tab
- **Size**: 120px diameter
- **Center Text**: Shows protein grams per serving
- **Legend**: Full legend with gram amounts
- **Data**: Per-serving macro information

#### 3. Near-Miss Recipes
- **Location**: "Almost There!" section
- **Size**: 100px diameter
- **Center Text**: Shows protein grams per serving
- **Legend**: Full legend with gram amounts
- **Data**: Per-serving macro information

#### 4. Saved Recipes
- **Location**: My Stacked Recipes tab
- **Size**: 120px diameter
- **Center Text**: Shows protein grams per serving
- **Legend**: Full legend with gram amounts
- **Data**: Per-serving macro information

#### 5. Ingredient Selection
- **Location**: Ingredient autocomplete dropdown and selection form
- **Size**: 50px (dropdown), 80px (selection form)
- **Center Text**: Shows protein grams per 100g
- **Legend**: No legend in dropdown, minimal in selection form
- **Data**: Per-100g macro information

## Technical Implementation

### Component Structure
```typescript
interface MacroData {
  protein: number;
  carbs: number;
  fats: number;
}

interface MacroDoughnutChartProps {
  data: MacroData;
  size?: number;
  showLegend?: boolean;
  className?: string;
  centerText?: string;
}
```

### Key Features
- **SVG-based**: Pure SVG implementation for crisp rendering
- **Hollow Center**: 60% inner radius creates doughnut effect
- **Flexible Layout**: Legend positioned next to chart
- **Customizable**: Optional legend, customizable size and center text
- **Responsive**: Scales with size prop

### Color Scheme
- **Protein**: Blue (#3B82F6) - Represents strength and muscle building
- **Carbs**: Orange (#F59E0B) - Represents energy and fuel
- **Fats**: Red (#EF4444) - Represents essential nutrients

## Benefits

### User Experience
1. **Clean Design**: Hollow charts look more modern and less cluttered
2. **Clear Information**: Center text highlights key macro (protein)
3. **Comprehensive Legend**: Side-by-side legend shows all macro details
4. **Space Efficient**: Better use of horizontal space
5. **Consistent Design**: Unified visual language across the app

### Fitness Focus
1. **Protein Emphasis**: Center text highlights protein content
2. **Quick Assessment**: Visual representation allows instant macro evaluation
3. **Detailed Information**: Legend provides exact gram amounts
4. **Goal Tracking**: Easy to see if recipes align with macro goals

## Usage Examples

### For Ingredients
- **High Protein**: Large blue slice with high center number (chicken breast, protein powder)
- **High Carb**: Large orange slice with lower center number (rice, oats, bread)
- **High Fat**: Large red slice with lower center number (nuts, oils, avocado)
- **Balanced**: Even distribution across all three colors

### For Recipes
- **Protein-Focused**: Large blue slice with high center number (chicken bowls, protein shakes)
- **Energy-Focused**: Large orange slice with lower center number (oatmeal, pasta dishes)
- **Balanced Meals**: Even distribution with moderate center number (complete meals)

## Layout Benefits

### Side-by-Side Design
- **Better Space Usage**: Horizontal layout is more efficient
- **Clearer Information**: Legend doesn't interfere with chart
- **Professional Look**: More polished appearance
- **Mobile Friendly**: Better responsive behavior

### Center Text Strategy
- **Protein Focus**: Most fitness users prioritize protein
- **Quick Reference**: Instant protein content visibility
- **Consistent Metric**: Same metric across all charts
- **Clean Display**: Avoids cluttered center text

## Future Enhancements

Potential improvements:
- **Interactive Charts**: Click to see detailed breakdown
- **Animation**: Smooth transitions when data changes
- **Customization**: User-selectable center text metric
- **Comparison Mode**: Side-by-side chart comparison
- **Trend Analysis**: Historical macro tracking visualization
- **Hover Effects**: Detailed tooltips on hover 