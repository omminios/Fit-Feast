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
    category TEXT, -- e.g., "Protein", "Vegetable", "Grain"
    protein_per_100g NUMERIC DEFAULT 0, -- grams of protein per 100g
    carbs_per_100g NUMERIC DEFAULT 0, -- grams of carbs per 100g
    fats_per_100g NUMERIC DEFAULT 0 -- grams of fats per 100g
);

-- User pantry items table
CREATE TABLE IF NOT EXISTS user_pantry_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity NUMERIC DEFAULT 1, -- amount of ingredient (e.g., 2 for 2 chicken breasts)
    unit TEXT DEFAULT 'piece', -- unit of measurement (e.g., "pieces", "grams", "cups")
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'used')),
    expiration_date DATE, -- optional expiration date for the ingredient
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

-- Insert common ingredients with macros (per 100g)
INSERT INTO ingredients (name, category, protein_per_100g, carbs_per_100g, fats_per_100g) VALUES
-- Proteins
('chicken breast', 'Protein', 31.0, 0.0, 3.6),
('ground beef (lean)', 'Protein', 26.0, 0.0, 15.0),
('ground beef (extra lean)', 'Protein', 27.0, 0.0, 8.0),
('salmon', 'Protein', 20.0, 0.0, 13.0),
('tuna', 'Protein', 30.0, 0.0, 1.0),
('eggs', 'Protein', 13.0, 1.1, 11.0),
('egg whites', 'Protein', 11.0, 0.7, 0.2),
('greek yogurt', 'Protein', 10.0, 3.6, 0.4),
('cottage cheese', 'Protein', 11.0, 3.4, 4.3),
('protein powder (whey)', 'Protein', 80.0, 8.0, 2.0),
('protein powder (casein)', 'Protein', 85.0, 4.0, 1.0),
('turkey breast', 'Protein', 29.0, 0.0, 1.0),
('pork chops', 'Protein', 25.0, 0.0, 15.0),
('tilapia', 'Protein', 26.0, 0.0, 2.0),
('shrimp', 'Protein', 24.0, 0.0, 0.3),
('cod', 'Protein', 18.0, 0.0, 0.7),
('lean beef steak', 'Protein', 26.0, 0.0, 8.0),
('lamb chops', 'Protein', 25.0, 0.0, 21.0),
('duck breast', 'Protein', 23.0, 0.0, 28.0),
('quail', 'Protein', 21.0, 0.0, 12.0),

-- Vegetables
('broccoli', 'Vegetable', 2.8, 7.0, 0.4),
('spinach', 'Vegetable', 2.9, 3.6, 0.4),
('kale', 'Vegetable', 4.3, 8.8, 0.9),
('bell peppers', 'Vegetable', 1.0, 6.0, 0.3),
('onions', 'Vegetable', 1.2, 9.0, 0.1),
('garlic', 'Vegetable', 6.4, 33.0, 0.5),
('carrots', 'Vegetable', 0.9, 10.0, 0.2),
('tomatoes', 'Vegetable', 0.9, 3.9, 0.2),
('cucumber', 'Vegetable', 0.7, 3.6, 0.1),
('zucchini', 'Vegetable', 1.2, 3.1, 0.3),
('cauliflower', 'Vegetable', 1.9, 5.0, 0.3),
('asparagus', 'Vegetable', 2.2, 3.9, 0.1),
('brussels sprouts', 'Vegetable', 3.4, 9.0, 0.3),
('green beans', 'Vegetable', 1.8, 7.0, 0.2),
('mushrooms', 'Vegetable', 3.1, 3.3, 0.3),
('sweet potato', 'Vegetable', 1.6, 20.0, 0.1),
('butternut squash', 'Vegetable', 1.0, 12.0, 0.1),
('pumpkin', 'Vegetable', 1.0, 6.5, 0.1),
('artichoke', 'Vegetable', 3.3, 11.0, 0.2),
('eggplant', 'Vegetable', 1.0, 6.0, 0.2),
('celery', 'Vegetable', 0.7, 3.0, 0.2),

-- Grains
('oats', 'Grain', 13.0, 68.0, 6.5),
('brown rice', 'Grain', 2.7, 23.0, 0.9),
('quinoa', 'Grain', 4.4, 22.0, 1.9),
('whole wheat bread', 'Grain', 13.0, 49.0, 4.2),
('pasta (whole wheat)', 'Grain', 13.0, 71.0, 2.5),
('pasta (white)', 'Grain', 12.0, 75.0, 1.1),
('sweet potato', 'Grain', 1.6, 20.0, 0.1),
('potato', 'Grain', 2.0, 17.0, 0.1),
('barley', 'Grain', 12.0, 73.0, 2.3),
('bulgur wheat', 'Grain', 12.0, 76.0, 1.3),
('farro', 'Grain', 15.0, 71.0, 2.0),
('wild rice', 'Grain', 4.0, 21.0, 0.3),
('couscous', 'Grain', 12.0, 72.0, 0.6),
('polenta', 'Grain', 7.0, 84.0, 0.4),

-- Fats
('olive oil', 'Fat', 0.0, 0.0, 100.0),
('coconut oil', 'Fat', 0.0, 0.0, 100.0),
('avocado', 'Fat', 2.0, 9.0, 15.0),
('nuts (almonds)', 'Fat', 21.0, 22.0, 50.0),
('nuts (walnuts)', 'Fat', 15.0, 14.0, 65.0),
('nuts (cashews)', 'Fat', 18.0, 30.0, 44.0),
('nuts (pistachios)', 'Fat', 20.0, 28.0, 45.0),
('peanut butter', 'Fat', 25.0, 20.0, 50.0),
('almond butter', 'Fat', 21.0, 19.0, 57.0),
('tahini', 'Fat', 17.0, 18.0, 54.0),
('chia seeds', 'Fat', 17.0, 42.0, 31.0),
('flax seeds', 'Fat', 18.0, 29.0, 42.0),
('hemp seeds', 'Fat', 32.0, 9.0, 49.0),
('sunflower seeds', 'Fat', 21.0, 20.0, 51.0),
('pumpkin seeds', 'Fat', 19.0, 54.0, 19.0),

-- Dairy
('milk (whole)', 'Dairy', 3.2, 4.8, 3.3),
('milk (skim)', 'Dairy', 3.4, 5.0, 0.1),
('cheese (cheddar)', 'Dairy', 25.0, 1.3, 33.0),
('cheese (mozzarella)', 'Dairy', 22.0, 2.2, 22.0),
('cheese (feta)', 'Dairy', 14.0, 4.1, 21.0),
('cheese (parmesan)', 'Dairy', 38.0, 4.1, 29.0),
('butter', 'Dairy', 0.9, 0.1, 81.0),
('cream cheese', 'Dairy', 6.0, 4.0, 34.0),
('sour cream', 'Dairy', 2.9, 3.0, 20.0),
('heavy cream', 'Dairy', 2.1, 2.8, 37.0),

-- Fruits
('banana', 'Fruit', 1.1, 23.0, 0.3),
('apple', 'Fruit', 0.3, 14.0, 0.2),
('orange', 'Fruit', 0.9, 12.0, 0.1),
('berries (strawberries)', 'Fruit', 0.7, 8.0, 0.3),
('berries (blueberries)', 'Fruit', 0.7, 14.0, 0.3),
('berries (raspberries)', 'Fruit', 1.2, 12.0, 0.7),
('pineapple', 'Fruit', 0.5, 13.0, 0.1),
('mango', 'Fruit', 0.8, 15.0, 0.4),
('peach', 'Fruit', 0.9, 10.0, 0.3),
('pear', 'Fruit', 0.4, 15.0, 0.1),
('grapes', 'Fruit', 0.6, 18.0, 0.2),
('kiwi', 'Fruit', 1.1, 15.0, 0.5),

-- Other
('salt', 'Seasoning', 0.0, 0.0, 0.0),
('black pepper', 'Seasoning', 10.0, 64.0, 3.3),
('herbs (basil)', 'Seasoning', 3.2, 2.6, 0.6),
('herbs (oregano)', 'Seasoning', 9.0, 69.0, 4.3),
('spices (cinnamon)', 'Seasoning', 3.9, 81.0, 1.2),
('spices (turmeric)', 'Seasoning', 8.0, 65.0, 10.0),
('honey', 'Seasoning', 0.3, 82.0, 0.0),
('maple syrup', 'Seasoning', 0.0, 67.0, 0.0),
('agave nectar', 'Seasoning', 0.0, 76.0, 0.0),
('soy sauce', 'Seasoning', 8.0, 4.0, 0.0),
('hot sauce', 'Seasoning', 1.3, 1.8, 0.0),
('mustard', 'Seasoning', 6.0, 5.0, 4.0),
('ketchup', 'Seasoning', 1.2, 29.0, 0.2),
('mayonnaise', 'Seasoning', 1.0, 0.6, 75.0)
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
),
(
    'Tuna Protein Salad',
    '1. Mix canned tuna with Greek yogurt\n2. Add diced celery and onion\n3. Season with salt, pepper, and herbs\n4. Serve on whole wheat bread or with crackers',
    10,
    0,
    25,
    15,
    8,
    2,
    NULL
),
(
    'Egg White Omelette',
    '1. Whisk egg whites with a splash of milk\n2. Cook in non-stick pan over medium heat\n3. Add spinach and mushrooms\n4. Fold and serve hot',
    5,
    8,
    20,
    5,
    2,
    1,
    NULL
),
(
    'Protein Smoothie Bowl',
    '1. Blend protein powder with frozen berries and banana\n2. Add almond milk for desired consistency\n3. Top with granola, nuts, and fresh fruit\n4. Drizzle with honey',
    8,
    0,
    30,
    35,
    12,
    1,
    NULL
),
(
    'Lean Beef Stir-Fry',
    '1. Slice beef into thin strips\n2. Stir-fry beef in hot oil until browned\n3. Add mixed vegetables\n4. Season with soy sauce and garlic\n5. Serve over brown rice',
    15,
    12,
    32,
    25,
    18,
    2,
    NULL
),
(
    'Cottage Cheese Protein Bowl',
    '1. Mix cottage cheese with berries\n2. Add a drizzle of honey\n3. Top with nuts and seeds\n4. Serve immediately',
    5,
    0,
    18,
    15,
    6,
    1,
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
WHERE r.name = 'Protein-Packed Oatmeal' AND i.name = 'protein powder (whey)';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Protein-Packed Oatmeal' AND i.name = 'milk (skim)';

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
WHERE r.name = 'Greek Yogurt Parfait' AND i.name = 'nuts (almonds)';

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

-- Tuna Protein Salad
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'can' FROM recipes r, ingredients i 
WHERE r.name = 'Tuna Protein Salad' AND i.name = 'tuna';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1/2', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Tuna Protein Salad' AND i.name = 'greek yogurt';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'stalk' FROM recipes r, ingredients i 
WHERE r.name = 'Tuna Protein Salad' AND i.name = 'celery';

-- Egg White Omelette
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '6', 'whites' FROM recipes r, ingredients i 
WHERE r.name = 'Egg White Omelette' AND i.name = 'egg whites';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Egg White Omelette' AND i.name = 'spinach';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1/2', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Egg White Omelette' AND i.name = 'mushrooms';

-- Protein Smoothie Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'scoop' FROM recipes r, ingredients i 
WHERE r.name = 'Protein Smoothie Bowl' AND i.name = 'protein powder (whey)';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Protein Smoothie Bowl' AND i.name = 'berries (strawberries)';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'banana' FROM recipes r, ingredients i 
WHERE r.name = 'Protein Smoothie Bowl' AND i.name = 'banana';

-- Lean Beef Stir-Fry
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '8', 'oz' FROM recipes r, ingredients i 
WHERE r.name = 'Lean Beef Stir-Fry' AND i.name = 'lean beef steak';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '2', 'cups' FROM recipes r, ingredients i 
WHERE r.name = 'Lean Beef Stir-Fry' AND i.name = 'bell peppers';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Lean Beef Stir-Fry' AND i.name = 'brown rice';

-- Cottage Cheese Protein Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Cottage Cheese Protein Bowl' AND i.name = 'cottage cheese';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1/2', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Cottage Cheese Protein Bowl' AND i.name = 'berries (blueberries)';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'tbsp' FROM recipes r, ingredients i 
WHERE r.name = 'Cottage Cheese Protein Bowl' AND i.name = 'honey';

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