# Business Rules - Categories & Group Categories

## Overview
Simplified business rules for managing categories and group categories.

## Category Rules

### Creation
- Categories are independent entities with a name
- Name required, 2-50 characters, unique across all categories
- Error: `CATEGORY_NAME_REQUIRED`, `CATEGORY_NAME_TOO_SHORT`, `CATEGORY_NAME_TOO_LONG`, `CATEGORY_NAME_DUPLICATE`

### Independence
- Categories can exist independently or belong to group categories
- No requirement to belong to any group category
- Error: `CATEGORY_INDEPENDENCE_VIOLATION`

### Updates
- Name changes must maintain uniqueness
- Cannot update to duplicate name
- Error: `CATEGORY_UPDATE_FAILED`, `CATEGORY_NAME_DUPLICATE`

### Deletion with Warnings
- Warn user about all affected entities before deletion
- Check for products using the category
- Warn about removal from products and group categories
- Require user confirmation
- Error: `CATEGORY_HAS_PRODUCTS`, `CATEGORY_DELETE_FAILED`, `USER_CANCELLED_DELETION`

### Deletion Confirmation
- Show affected products count
- Show affected group categories count
- Require explicit user confirmation
- Error: `DELETION_NOT_CONFIRMED`, `USER_CANCELLED_DELETION`

## Group Category Rules

### Creation
- Group categories are independent entities with a name
- Name required, 3-100 characters, unique across all group categories
- Error: `GROUP_CATEGORY_NAME_REQUIRED`, `GROUP_CATEGORY_NAME_TOO_SHORT`, `GROUP_CATEGORY_NAME_TOO_LONG`, `GROUP_CATEGORY_NAME_DUPLICATE`

### Independence
- Group categories can contain categories but are not required to
- No minimum requirement for number of categories
- Error: `GROUP_CATEGORY_INDEPENDENCE_VIOLATION`

### Updates
- Name changes must maintain uniqueness
- Cannot update to duplicate name
- Error: `GROUP_CATEGORY_UPDATE_FAILED`, `GROUP_CATEGORY_NAME_DUPLICATE`

### Deletion
- Can delete without any restrictions
- Categories within become standalone
- Error: `GROUP_CATEGORY_DELETE_FAILED`

## Relationship Rules

### Optional Category-Group Relationship
- Categories can optionally belong to group categories
- Categories can belong to multiple group categories
- Relationship is optional, not required
- Error: `RELATIONSHIP_VIOLATION`

### Category Deletion Cascade
- When category is deleted, remove from all group categories
- Find all group categories containing the category
- Remove category from each group category's list
- Error: `CATEGORY_CASCADE_REMOVAL_FAILED`, `GROUP_CATEGORY_UPDATE_FAILED`

### Product-Category Relationship
- Products can have categories (independent of group categories)
- Categories must exist before product assignment
- Error: `PRODUCT_CATEGORY_REQUIRED`, `CATEGORY_NOT_FOUND`

### Category Deletion Impact on Products
- When category is deleted, remove from all products
- Find all products using the category
- Remove category from each product's list
- Error: `PRODUCT_CATEGORY_REMOVAL_FAILED`, `PRODUCT_UPDATE_FAILED`

## Data Validation

### Name Validation
- Trim whitespace from names
- Convert to lowercase for uniqueness checks
- Allow alphanumeric characters, spaces, hyphens, underscores
- Error: `INVALID_NAME_FORMAT`, `NAME_CONTAINS_INVALID_CHARS`

### ID Validation
- IDs must be valid MongoDB ObjectIds
- Handle invalid ID formats gracefully
- Error: `INVALID_ID_FORMAT`, `ID_NOT_FOUND`

## Security

### Access Control
- Admin users can manage all categories and group categories
- Regular users can only view categories
- API endpoints require authentication
- Error: `INSUFFICIENT_PERMISSIONS`, `UNAUTHORIZED_ACCESS`

## Error Handling

### Error Response Format
- Return standardized error codes
- Provide meaningful error messages
- Error: `ERROR_FORMAT_INVALID`

## Warning System

### Category Deletion Warnings
- Display warning message with affected products count
- Display warning message with affected group categories count
- Show specific names if count is small
- Require user confirmation to proceed
- Error: `WARNING_DISPLAY_FAILED`, `USER_CANCELLED_DELETION`

### Warning Message Format
- Include category name being deleted
- Include number of affected products and group categories
- Provide option to cancel or proceed
- Use clear, non-technical language
- Error: `WARNING_MESSAGE_INVALID`

## Warning Flow

1. User requests category deletion
2. System checks affected entities (products, group categories)
3. Display warning message with counts and names
4. User confirms or cancels
5. If confirmed: Execute deletion with cascade removal
   If cancelled: Abort deletion

## Warning Message Example

```
⚠️ Category Deletion Warning

You are about to delete "Electronics"

This will affect:
• 3 products: iPhone 13, Samsung Galaxy, MacBook Pro
• 1 group category: Mobile Devices

Are you sure you want to proceed?

[Cancel] [Delete Category]
```

## Deletion Process

1. Check Dependencies: Find all products and group categories using the category
2. Display Warnings: Show affected entities with counts and names
3. User Confirmation: Require explicit confirmation
4. Cascade Removal: Remove category from all products and group categories
5. Delete Category: Finally delete the category itself

Categories can belong to group categories, and when deleted, categories are removed from all group categories and products with proper user warnings.
