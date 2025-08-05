-- Migration to add expiration_date column to user_pantry_items table
-- Run this script if you have an existing database without the expiration_date column

-- Add expiration_date column to user_pantry_items table
ALTER TABLE user_pantry_items 
ADD COLUMN IF NOT EXISTS expiration_date DATE;

-- Add comment to the column
COMMENT ON COLUMN user_pantry_items.expiration_date IS 'Optional expiration date for the ingredient to help reduce food waste'; 