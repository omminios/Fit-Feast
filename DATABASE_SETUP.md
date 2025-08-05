# FitFeast Database Setup Guide

This guide explains how to set up and populate your FitFeast database with the new features including macros and quantity tracking.

## Prerequisites

- You have an existing Supabase project with the basic tables already created
- You have access to your Supabase SQL editor

## Step 1: Run the Migration Script

First, run the migration script to add the new columns to your existing tables:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `migrate-existing-schema.sql`
4. Run the script

This script will:
- Add `protein_per_100g`, `carbs_per_100g`, and `fats_per_100g` columns to the `ingredients` table
- Add `quantity` and `unit` columns to the `user_pantry_items` table
- Update existing ingredients with macro data

## Step 2: Populate Additional Data

After running the migration, you can populate your database with additional ingredients and recipes:

1. In the SQL Editor, copy and paste the contents of `populate-additional-data.sql`
2. Run the script

This script will add:
- 50+ additional ingredients with accurate macro data
- 15 new high-protein recipes
- Recipe ingredients for all new recipes

## New Features Added

### 1. Ingredient Macros
- All ingredients now have protein, carbs, and fats per 100g
- Macros are displayed in the ingredient autocomplete
- Pantry items show calculated macros based on quantity

### 2. Quantity Tracking
- Users can specify quantity and unit when adding ingredients
- Pantry items display current quantity and unit
- Users can update quantities directly from the pantry view

### 3. Enhanced Ingredient Database
- 80+ ingredients with accurate macro data
- Popular fitness-focused ingredients
- Categorized by type (Protein, Vegetable, Grain, etc.)

### 4. More Recipes
- 20 total recipes (5 original + 15 new)
- All recipes are high-protein and fitness-focused
- Detailed instructions and macro information

## Popular Ingredients Added

### Proteins
- Various cuts of beef (lean, extra lean, steak)
- Different types of fish (tilapia, cod, shrimp)
- Protein powders (whey, casein)
- Egg whites
- Various poultry options

### Vegetables
- Brussels sprouts, green beans, mushrooms
- Butternut squash, pumpkin, artichoke
- Eggplant, celery

### Grains
- Different pasta types (whole wheat, white)
- Barley, bulgur wheat, farro
- Wild rice, couscous, polenta

### Fats & Nuts
- Various nuts (almonds, walnuts, cashews, pistachios)
- Seeds (chia, flax, hemp, sunflower, pumpkin)
- Nut butters and tahini

### Dairy
- Different milk types (whole, skim)
- Various cheeses (cheddar, mozzarella, feta, parmesan)
- Cream cheese, sour cream, heavy cream

### Fruits
- Common fruits (banana, apple, orange)
- Various berries (strawberries, blueberries, raspberries)
- Tropical fruits (pineapple, mango, kiwi)

### Seasonings
- Various herbs and spices
- Sweeteners (honey, maple syrup, agave)
- Condiments (soy sauce, hot sauce, mustard, etc.)

## Recipe Categories

The new recipes include:
- **Breakfast**: Protein pancakes, overnight oats, egg white omelettes
- **Salads**: Tuna protein salad, cottage cheese bowls
- **Bowls**: Various protein bowls with grains and vegetables
- **Stir-fries**: Lean beef and shrimp stir-fries
- **Snacks**: Protein energy balls, smoothie bowls

## Frontend Updates

The frontend has been updated to support:
- Enhanced ingredient autocomplete with macro display
- Quantity and unit selection when adding ingredients
- Macro calculation and display for pantry items
- Quantity editing directly in the pantry view

## Troubleshooting

If you encounter any issues:

1. **Column already exists error**: This is normal if you've run the migration before. The `IF NOT EXISTS` clause will handle this.

2. **Ingredient not found**: Some ingredients might not exist in your database. The scripts use `ON CONFLICT DO NOTHING` to handle this gracefully.

3. **Recipe ingredients not linking**: Make sure all ingredients exist before running the recipe population script.

## Next Steps

After running these scripts, your FitFeast application will have:
- A comprehensive ingredient database with macros
- Quantity tracking for pantry items
- More recipe options for users
- Enhanced user experience with macro information

You can now test the new features in your application! 