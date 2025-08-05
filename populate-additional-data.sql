-- Additional Ingredients and Recipes for FitFeast
-- This script adds more ingredients and recipes to your existing database

-- Insert additional ingredients with macros (per 100g)
INSERT INTO ingredients (name, category, protein_per_100g, carbs_per_100g, fats_per_100g) VALUES
-- Additional Proteins
('ground beef (extra lean)', 'Protein', 27.0, 0.0, 8.0),
('egg whites', 'Protein', 11.0, 0.7, 0.2),
('protein powder (whey)', 'Protein', 80.0, 8.0, 2.0),
('protein powder (casein)', 'Protein', 85.0, 4.0, 1.0),
('tilapia', 'Protein', 26.0, 0.0, 2.0),
('shrimp', 'Protein', 24.0, 0.0, 0.3),
('cod', 'Protein', 18.0, 0.0, 0.7),
('lean beef steak', 'Protein', 26.0, 0.0, 8.0),
('lamb chops', 'Protein', 25.0, 0.0, 21.0),
('duck breast', 'Protein', 23.0, 0.0, 28.0),
('quail', 'Protein', 21.0, 0.0, 12.0),

-- Additional Vegetables
('brussels sprouts', 'Vegetable', 3.4, 9.0, 0.3),
('green beans', 'Vegetable', 1.8, 7.0, 0.2),
('mushrooms', 'Vegetable', 3.1, 3.3, 0.3),
('butternut squash', 'Vegetable', 1.0, 12.0, 0.1),
('pumpkin', 'Vegetable', 1.0, 6.5, 0.1),
('artichoke', 'Vegetable', 3.3, 11.0, 0.2),
('eggplant', 'Vegetable', 1.0, 6.0, 0.2),
('celery', 'Vegetable', 0.7, 3.0, 0.2),

-- Additional Grains
('pasta (whole wheat)', 'Grain', 13.0, 71.0, 2.5),
('pasta (white)', 'Grain', 12.0, 75.0, 1.1),
('potato', 'Grain', 2.0, 17.0, 0.1),
('barley', 'Grain', 12.0, 73.0, 2.3),
('bulgur wheat', 'Grain', 12.0, 76.0, 1.3),
('farro', 'Grain', 15.0, 71.0, 2.0),
('wild rice', 'Grain', 4.0, 21.0, 0.3),
('couscous', 'Grain', 12.0, 72.0, 0.6),
('polenta', 'Grain', 7.0, 84.0, 0.4),

-- Additional Fats
('nuts (almonds)', 'Fat', 21.0, 22.0, 50.0),
('nuts (walnuts)', 'Fat', 15.0, 14.0, 65.0),
('nuts (cashews)', 'Fat', 18.0, 30.0, 44.0),
('nuts (pistachios)', 'Fat', 20.0, 28.0, 45.0),
('tahini', 'Fat', 17.0, 18.0, 54.0),
('chia seeds', 'Fat', 17.0, 42.0, 31.0),
('flax seeds', 'Fat', 18.0, 29.0, 42.0),
('hemp seeds', 'Fat', 32.0, 9.0, 49.0),
('sunflower seeds', 'Fat', 21.0, 20.0, 51.0),
('pumpkin seeds', 'Fat', 19.0, 54.0, 19.0),

-- Additional Dairy
('milk (whole)', 'Dairy', 3.2, 4.8, 3.3),
('milk (skim)', 'Dairy', 3.4, 5.0, 0.1),
('cheese (cheddar)', 'Dairy', 25.0, 1.3, 33.0),
('cheese (mozzarella)', 'Dairy', 22.0, 2.2, 22.0),
('cheese (feta)', 'Dairy', 14.0, 4.1, 21.0),
('cheese (parmesan)', 'Dairy', 38.0, 4.1, 29.0),
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

-- Additional Seasonings
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

-- Insert additional recipes
INSERT INTO recipes (name, instructions, prep_time_minutes, cook_time_minutes, protein_g_per_serving, carbs_g_per_serving, fats_g_per_serving, servings, image_url) VALUES
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
),
(
    'Turkey and Quinoa Bowl',
    '1. Cook quinoa according to package\n2. Grill turkey breast until cooked through\n3. Steam broccoli and carrots\n4. Combine quinoa, turkey, and vegetables\n5. Season with herbs and olive oil',
    15,
    20,
    28,
    30,
    8,
    2,
    NULL
),
(
    'Salmon Protein Bowl',
    '1. Season salmon with herbs and lemon\n2. Bake at 400°F for 12-15 minutes\n3. Cook wild rice\n4. Steam asparagus\n5. Assemble bowl with rice, salmon, and asparagus',
    10,
    15,
    30,
    25,
    12,
    2,
    NULL
),
(
    'Greek Yogurt Protein Parfait',
    '1. Layer Greek yogurt in a glass\n2. Add protein granola and berries\n3. Drizzle with honey\n4. Repeat layers as desired',
    5,
    0,
    22,
    20,
    4,
    1,
    NULL
),
(
    'Chicken and Sweet Potato Bowl',
    '1. Season chicken breast with spices\n2. Grill chicken until cooked through\n3. Roast sweet potato cubes\n4. Steam green beans\n5. Combine all ingredients in a bowl',
    15,
    25,
    32,
    35,
    10,
    2,
    NULL
),
(
    'Protein Pancakes',
    '1. Mix protein powder with oats and egg whites\n2. Add milk and baking powder\n3. Cook on griddle until golden\n4. Serve with berries and honey',
    10,
    15,
    25,
    30,
    8,
    2,
    NULL
),
(
    'Tilapia with Roasted Vegetables',
    '1. Season tilapia with herbs and lemon\n2. Bake at 400°F for 15 minutes\n3. Roast mixed vegetables with olive oil\n4. Serve fish over vegetables',
    10,
    20,
    26,
    15,
    8,
    2,
    NULL
),
(
    'Protein Energy Balls',
    '1. Mix protein powder with dates and nuts\n2. Add chia seeds and honey\n3. Roll into balls\n4. Refrigerate for 30 minutes',
    15,
    0,
    8,
    12,
    6,
    8,
    NULL
),
(
    'Lean Beef and Quinoa Bowl',
    '1. Cook quinoa according to package\n2. Grill lean beef steak to desired doneness\n3. Steam broccoli and carrots\n4. Combine quinoa, beef, and vegetables\n5. Season with herbs and olive oil',
    15,
    20,
    35,
    30,
    15,
    2,
    NULL
),
(
    'Protein Overnight Oats',
    '1. Mix oats with protein powder and milk\n2. Add chia seeds and honey\n3. Refrigerate overnight\n4. Top with berries and nuts before serving',
    5,
    0,
    20,
    35,
    8,
    1,
    NULL
),
(
    'Shrimp and Vegetable Stir-Fry',
    '1. Stir-fry shrimp in hot oil\n2. Add mixed vegetables\n3. Season with soy sauce and garlic\n4. Serve over brown rice',
    10,
    12,
    24,
    25,
    6,
    2,
    NULL
)
ON CONFLICT DO NOTHING;

-- Insert recipe ingredients for the additional recipes
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

-- Turkey and Quinoa Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Turkey and Quinoa Bowl' AND i.name = 'quinoa';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'breast' FROM recipes r, ingredients i 
WHERE r.name = 'Turkey and Quinoa Bowl' AND i.name = 'turkey breast';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '2', 'cups' FROM recipes r, ingredients i 
WHERE r.name = 'Turkey and Quinoa Bowl' AND i.name = 'broccoli';

-- Salmon Protein Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'fillet' FROM recipes r, ingredients i 
WHERE r.name = 'Salmon Protein Bowl' AND i.name = 'salmon';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Salmon Protein Bowl' AND i.name = 'wild rice';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'bunch' FROM recipes r, ingredients i 
WHERE r.name = 'Salmon Protein Bowl' AND i.name = 'asparagus';

-- Greek Yogurt Protein Parfait
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Greek Yogurt Protein Parfait' AND i.name = 'greek yogurt';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1/4', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Greek Yogurt Protein Parfait' AND i.name = 'nuts (almonds)';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1/2', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Greek Yogurt Protein Parfait' AND i.name = 'berries (strawberries)';

-- Chicken and Sweet Potato Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'breast' FROM recipes r, ingredients i 
WHERE r.name = 'Chicken and Sweet Potato Bowl' AND i.name = 'chicken breast';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'medium' FROM recipes r, ingredients i 
WHERE r.name = 'Chicken and Sweet Potato Bowl' AND i.name = 'sweet potato';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Chicken and Sweet Potato Bowl' AND i.name = 'green beans';

-- Protein Pancakes
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'scoop' FROM recipes r, ingredients i 
WHERE r.name = 'Protein Pancakes' AND i.name = 'protein powder (whey)';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Protein Pancakes' AND i.name = 'oats';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '4', 'whites' FROM recipes r, ingredients i 
WHERE r.name = 'Protein Pancakes' AND i.name = 'egg whites';

-- Tilapia with Roasted Vegetables
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '2', 'fillets' FROM recipes r, ingredients i 
WHERE r.name = 'Tilapia with Roasted Vegetables' AND i.name = 'tilapia';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '2', 'cups' FROM recipes r, ingredients i 
WHERE r.name = 'Tilapia with Roasted Vegetables' AND i.name = 'bell peppers';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'tbsp' FROM recipes r, ingredients i 
WHERE r.name = 'Tilapia with Roasted Vegetables' AND i.name = 'olive oil';

-- Protein Energy Balls
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'scoop' FROM recipes r, ingredients i 
WHERE r.name = 'Protein Energy Balls' AND i.name = 'protein powder (whey)';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1/2', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Protein Energy Balls' AND i.name = 'nuts (almonds)';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '2', 'tbsp' FROM recipes r, ingredients i 
WHERE r.name = 'Protein Energy Balls' AND i.name = 'chia seeds';

-- Lean Beef and Quinoa Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Lean Beef and Quinoa Bowl' AND i.name = 'quinoa';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '8', 'oz' FROM recipes r, ingredients i 
WHERE r.name = 'Lean Beef and Quinoa Bowl' AND i.name = 'lean beef steak';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '2', 'cups' FROM recipes r, ingredients i 
WHERE r.name = 'Lean Beef and Quinoa Bowl' AND i.name = 'broccoli';

-- Protein Overnight Oats
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Protein Overnight Oats' AND i.name = 'oats';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'scoop' FROM recipes r, ingredients i 
WHERE r.name = 'Protein Overnight Oats' AND i.name = 'protein powder (whey)';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Protein Overnight Oats' AND i.name = 'milk (skim)';

-- Shrimp and Vegetable Stir-Fry
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '8', 'oz' FROM recipes r, ingredients i 
WHERE r.name = 'Shrimp and Vegetable Stir-Fry' AND i.name = 'shrimp';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '2', 'cups' FROM recipes r, ingredients i 
WHERE r.name = 'Shrimp and Vegetable Stir-Fry' AND i.name = 'bell peppers';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
SELECT r.id, i.id, '1', 'cup' FROM recipes r, ingredients i 
WHERE r.name = 'Shrimp and Vegetable Stir-Fry' AND i.name = 'brown rice'; 