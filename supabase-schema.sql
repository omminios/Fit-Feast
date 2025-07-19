-- FitFeast Database Schema
-- This script creates all the necessary tables for the FitFeast application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingredients table (pre-populated with common ingredients)
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT -- e.g., "Protein", "Vegetable", "Grain"
);

-- User pantry items table
CREATE TABLE IF NOT EXISTS user_pantry_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'used')),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, ingredient_id)
);

-- Recipes table (pre-populated with curated fitness recipes)
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    instructions TEXT NOT NULL,
    prep_time_minutes INTEGER NOT NULL,
    cook_time_minutes INTEGER NOT NULL,
    protein_g_per_serving NUMERIC NOT NULL,
    carbs_g_per_serving NUMERIC NOT NULL,
    fats_g_per_serving NUMERIC NOT NULL,
    servings INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe ingredients join table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity TEXT NOT NULL, -- e.g., "2", "1 cup", "500g"
    unit TEXT -- e.g., "cups", "grams", "pieces"
);

-- Saved recipes table
CREATE TABLE IF NOT EXISTS saved_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, recipe_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_pantry_items_user_id ON user_pantry_items(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pantry_items_status ON user_pantry_items(status);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient_id ON recipe_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user_id ON saved_recipes(user_id);

-- Insert common ingredients
INSERT INTO ingredients (name, category) VALUES
-- Proteins
('chicken breast', 'Protein'),
('ground beef', 'Protein'),
('salmon', 'Protein'),
('tuna', 'Protein'),
('eggs', 'Protein'),
('greek yogurt', 'Protein'),
('cottage cheese', 'Protein'),
('protein powder', 'Protein'),
('turkey breast', 'Protein'),
('pork chops', 'Protein'),

-- Vegetables
('broccoli', 'Vegetable'),
('spinach', 'Vegetable'),
('kale', 'Vegetable'),
('bell peppers', 'Vegetable'),
('onions', 'Vegetable'),
('garlic', 'Vegetable'),
('carrots', 'Vegetable'),
('tomatoes', 'Vegetable'),
('cucumber', 'Vegetable'),
('zucchini', 'Vegetable'),
('cauliflower', 'Vegetable'),
('asparagus', 'Vegetable'),

-- Grains
('oats', 'Grain'),
('brown rice', 'Grain'),
('quinoa', 'Grain'),
('whole wheat bread', 'Grain'),
('pasta', 'Grain'),
('sweet potato', 'Grain'),

-- Fats
('olive oil', 'Fat'),
('coconut oil', 'Fat'),
('avocado', 'Fat'),
('nuts', 'Fat'),
('peanut butter', 'Fat'),
('almond butter', 'Fat'),

-- Dairy
('milk', 'Dairy'),
('cheese', 'Dairy'),
('butter', 'Dairy'),

-- Other
('salt', 'Seasoning'),
('black pepper', 'Seasoning'),
('herbs', 'Seasoning'),
('spices', 'Seasoning')
ON CONFLICT (name) DO NOTHING;

-- Insert sample recipes
INSERT INTO recipes (name, instructions, prep_time_minutes, cook_time_minutes, protein_g_per_serving, carbs_g_per_serving, fats_g_per_serving, servings, image_url) VALUES
(
    'High-Protein Chicken Bowl',
    '1. Season chicken breast with salt, pepper, and herbs\n2. Cook chicken in olive oil for 6-8 minutes per side\n3. Steam broccoli until tender\n4. Cook brown rice according to package\n5. Assemble bowl with rice, chicken, and broccoli\n6. Drizzle with olive oil and season to taste',
    10,
    20,
    35,
    45,
    12,
    2,
    NULL
),
(
    'Protein-Packed Oatmeal',
    '1. Cook oats with milk and water\n2. Stir in protein powder until smooth\n3. Top with nuts and berries\n4. Drizzle with honey if desired',
    5,
    10,
    25,
    40,
    8,
    1,
    NULL
),
(
    'Salmon with Roasted Vegetables',
    '1. Preheat oven to 400°F\n2. Season salmon with salt, pepper, and lemon\n3. Toss vegetables with olive oil and seasonings\n4. Roast salmon and vegetables for 15-20 minutes\n5. Serve hot with lemon wedges',
    15,
    20,
    30,
    20,
    15,
    2,
    NULL
),
(
    'Greek Yogurt Parfait',
    '1. Layer Greek yogurt in a glass\n2. Add berries and nuts\n3. Drizzle with honey\n4. Repeat layers as desired',
    5,
    0,
    20,
    25,
    5,
    1,
    NULL
),
(
    'Quinoa Protein Bowl',
    '1. Cook quinoa according to package\n2. Grill or pan-sear chicken breast\n3. Steam vegetables\n4. Combine quinoa, chicken, and vegetables\n5. Season with herbs and olive oil',
    15,
    25,
    28,
    35,
    10,
    2,
    NULL
)
ON CONFLICT DO NOTHING;

-- Insert recipe ingredients for the sample recipes
-- High-Protein Chicken Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'breast' FROM recipes r, ingredients i 
WHERE r.name = 'High-Protein Chicken Bowl' AND i.name = 'chicken breast';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'High-Protein Chicken Bowl' AND i.name = 'brown rice';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '2', 'cups' FROM recipes r, ingredients i 
WHERE r.name = 'High-Protein Chicken Bowl' AND i.name = 'broccoli';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '2', 'tbsp' FROM recipes r, ingredients i 
WHERE r.name = 'High-Protein Chicken Bowl' AND i.name = 'olive oil';

-- Protein-Packed Oatmeal
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Protein-Packed Oatmeal' AND i.name = 'oats';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'scoop' FROM recipes r, ingredients i 
WHERE r.name = 'Protein-Packed Oatmeal' AND i.name = 'protein powder';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Protein-Packed Oatmeal' AND i.name = 'milk';

-- Salmon with Roasted Vegetables
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '2', 'fillets' FROM recipes r, ingredients i 
WHERE r.name = 'Salmon with Roasted Vegetables' AND i.name = 'salmon';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '2', 'cups' FROM recipes r, ingredients i 
WHERE r.name = 'Salmon with Roasted Vegetables' AND i.name = 'broccoli';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'tbsp' FROM recipes r, ingredients i 
WHERE r.name = 'Salmon with Roasted Vegetables' AND i.name = 'olive oil';

-- Greek Yogurt Parfait
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Greek Yogurt Parfait' AND i.name = 'greek yogurt';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1/4', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Greek Yogurt Parfait' AND i.name = 'nuts';

-- Quinoa Protein Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Quinoa Protein Bowl' AND i.name = 'quinoa';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'breast' FROM recipes r, ingredients i 
WHERE r.name = 'Quinoa Protein Bowl' AND i.name = 'chicken breast';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '2', 'cups' FROM recipes r, ingredients i 
WHERE r.name = 'Quinoa Protein Bowl' AND i.name = 'broccoli';

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- User pantry items policies
CREATE POLICY "Users can view own pantry items" ON user_pantry_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pantry items" ON user_pantry_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pantry items" ON user_pantry_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pantry items" ON user_pantry_items
    FOR DELETE USING (auth.uid() = user_id);

-- Saved recipes policies
CREATE POLICY "Users can view own saved recipes" ON saved_recipes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved recipes" ON saved_recipes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved recipes" ON saved_recipes
    FOR DELETE USING (auth.uid() = user_id);

-- Public read access for ingredients and recipes
CREATE POLICY "Anyone can view ingredients" ON ingredients
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view recipes" ON recipes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view recipe ingredients" ON recipe_ingredients
    FOR SELECT USING (true); 