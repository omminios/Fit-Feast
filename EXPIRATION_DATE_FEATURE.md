# Expiration Date Feature

## Overview

The expiration date feature helps users reduce food waste by tracking when ingredients will expire. This feature is optional but highly recommended for fresh ingredients.

## How to Use

### Adding Ingredients with Expiration Dates

1. **Navigate to Pantry Power-Up**: Go to your dashboard and click on the "Pantry Power-Up" tab
2. **Add an Ingredient**: Use the ingredient autocomplete to search for and select an ingredient
3. **Set Quantity and Unit**: Enter the quantity and select the appropriate unit
4. **Add Expiration Date**: 
   - Check the "Add expiration date" checkbox
   - Select a date from the date picker
   - The date picker will only allow future dates
5. **Add to Pantry**: Click "Add to Pantry" to save the ingredient

### Visual Indicators

The app provides visual indicators for expiration status:

- **🟢 Green**: Expires in more than 7 days
- **🟡 Yellow**: Expires in 4-7 days  
- **🟠 Orange**: Expires in 1-3 days
- **🔴 Red**: Expired (shows days since expiration)

### Editing Expiration Dates

For existing pantry items:

1. **Find the Item**: Locate the ingredient in your pantry list
2. **Edit Expiration Date**: Use the date input field below the quantity/unit fields
3. **Save Changes**: The changes are automatically saved when you modify the date

### Benefits

- **Reduce Food Waste**: Know when ingredients will expire and use them first
- **Smart Meal Planning**: Prioritize ingredients that are expiring soon
- **Cost Savings**: Avoid throwing away expired food
- **Better Organization**: Keep track of fresh ingredients

## Technical Implementation

### Database Schema

The `user_pantry_items` table includes an optional `expiration_date` field:

```sql
expiration_date DATE, -- optional expiration date for the ingredient
```

### API Functions

- `addToPantry()`: Now accepts an optional `expirationDate` parameter
- `updatePantryItemExpiration()`: New function to update expiration dates
- `getUserPantry()`: Returns expiration dates with pantry items

### UI Components

- **IngredientAutocomplete**: Enhanced with expiration date input
- **Pantry Item Cards**: Display expiration status with color-coded indicators
- **Date Inputs**: Allow editing expiration dates for existing items

## Migration

If you have an existing database, run the migration script:

```sql
-- Run add-expiration-date-migration.sql in your Supabase SQL editor
ALTER TABLE user_pantry_items 
ADD COLUMN IF NOT EXISTS expiration_date DATE;
```

## Best Practices

1. **Add Expiration Dates**: Especially for fresh produce, dairy, and meat
2. **Regular Updates**: Update expiration dates when you add more of the same ingredient
3. **Use Soon-to-Expire Items**: Prioritize recipes that use ingredients expiring soon
4. **Check Regularly**: Review your pantry weekly to avoid waste

## Future Enhancements

Potential future features:
- Automatic notifications for expiring items
- Recipe suggestions based on expiring ingredients
- Bulk expiration date updates
- Integration with grocery shopping lists 