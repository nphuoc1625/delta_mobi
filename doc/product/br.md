# Business Rules - Products

## Overview
Business rules for managing products in the DeltaMobi system.

## Product Rules

### Creation
- Products are independent entities with name, category, price, and image
- Name required, 1-200 characters, unique across all products
- Category required, must be valid category name
- Price required, must be positive number (0.01 or greater)
- Image required, must be valid URL or file path
- Error: `PRODUCT_NAME_REQUIRED`, `PRODUCT_NAME_TOO_SHORT`, `PRODUCT_NAME_TOO_LONG`, `PRODUCT_NAME_DUPLICATE`, `PRODUCT_CATEGORY_REQUIRED`, `PRODUCT_PRICE_REQUIRED`, `PRODUCT_PRICE_INVALID`, `PRODUCT_IMAGE_REQUIRED`

### Independence
- Products can exist independently
- No required relationship with other entities
- Products can be created without categories (though category is required field)
- Error: `PRODUCT_INDEPENDENCE_VIOLATION`

### Updates
- Name changes must maintain uniqueness
- Cannot update to duplicate name
- Price must remain positive number
- Category must be valid
- Error: `PRODUCT_UPDATE_FAILED`, `PRODUCT_NAME_DUPLICATE`, `PRODUCT_PRICE_INVALID`, `PRODUCT_CATEGORY_INVALID`

### Deletion
- Can delete products without restrictions
- Deletion is permanent and irreversible
- No cascade effects on other entities
- Error: `PRODUCT_DELETE_FAILED`

## Relationship Rules

### Product-Category Relationship
- Products must have a category
- Category must be a valid category name
- Products can belong to only one category
- Error: `PRODUCT_CATEGORY_REQUIRED`, `PRODUCT_CATEGORY_INVALID`

### Product Independence
- Products are independent of other products
- No parent-child relationships between products
- No dependencies on other product entities
- Error: `PRODUCT_RELATIONSHIP_VIOLATION`

## Data Validation

### Name Validation
- Trim whitespace from names
- Convert to lowercase for uniqueness checks
- Allow alphanumeric characters, spaces, hyphens, underscores
- Error: `INVALID_NAME_FORMAT`, `NAME_CONTAINS_INVALID_CHARS`

### Price Validation
- Must be positive number (0.01 or greater)
- Maximum price limit of 999,999.99
- Support 2 decimal places
- Error: `PRICE_MUST_BE_POSITIVE`, `PRICE_TOO_HIGH`, `INVALID_PRICE_FORMAT`

### Category Validation
- Must be non-empty string
- Must be valid category name from allowed list
- Case-insensitive matching
- Error: `CATEGORY_REQUIRED`, `CATEGORY_INVALID`, `CATEGORY_NOT_FOUND`

### Image Validation
- Must be non-empty string
- Must be valid URL or file path
- Support common image formats (jpg, png, svg, webp)
- Error: `IMAGE_REQUIRED`, `IMAGE_INVALID_FORMAT`, `IMAGE_URL_INVALID`

### ID Validation
- IDs must be valid MongoDB ObjectIds
- Handle invalid ID formats gracefully
- Error: `INVALID_ID_FORMAT`, `ID_NOT_FOUND`

## Security

### Access Control
- Admin users can manage all products (create, edit, delete)
- Regular users can only view products
- API endpoints require authentication for admin operations
- Error: `INSUFFICIENT_PERMISSIONS`, `UNAUTHORIZED_ACCESS`

## Error Handling

### Error Response Format
- Return standardized error codes
- Provide meaningful error messages
- Include field-specific validation errors
- Error: `ERROR_FORMAT_INVALID`

## Search and Filtering

### Search Rules
- Search by product name (case-insensitive)
- Search by category name (case-insensitive)
- Support partial matching
- Return relevant results ordered by relevance
- Error: `SEARCH_FAILED`, `INVALID_SEARCH_PARAMS`

### Filtering Rules
- Filter by category (exact match)
- Filter by price range (min/max)
- Support multiple filters simultaneously
- Error: `FILTER_FAILED`, `INVALID_FILTER_PARAMS`

### Sorting Rules
- Sort by name (ascending/descending)
- Sort by price (ascending/descending)
- Sort by creation date (newest/oldest)
- Default sort by name ascending
- Error: `SORT_FAILED`, `INVALID_SORT_PARAMS`

## Pagination

### Pagination Rules
- Default page size of 10 products
- Maximum page size of 100 products
- Support custom page sizes
- Return pagination metadata
- Error: `PAGINATION_FAILED`, `INVALID_PAGE_PARAMS`

## Data Integrity

### Uniqueness Constraints
- Product names must be unique across all products
- Case-insensitive uniqueness checking
- Trim whitespace for uniqueness validation
- Error: `PRODUCT_NAME_DUPLICATE`

### Referential Integrity
- Product categories must reference valid categories
- Validate category existence before product creation/update
- Error: `CATEGORY_NOT_FOUND`, `INVALID_CATEGORY_REFERENCE`

## Performance

### Query Optimization
- Index on product name for search performance
- Index on category for filtering performance
- Index on price for sorting and filtering
- Index on creation date for sorting
- Error: `QUERY_PERFORMANCE_ISSUE`

## Process Steps

### Product Creation Process
1. Validate input data (name, category, price, image)
2. Check name uniqueness
3. Validate category exists
4. Create product in database
5. Return created product

### Product Update Process
1. Validate product exists
2. Validate input data
3. Check name uniqueness (if name changed)
4. Validate category exists (if category changed)
5. Update product in database
6. Return updated product

### Product Deletion Process
1. Validate product exists
2. Delete product from database
3. Return success confirmation

### Product Search Process
1. Parse search parameters
2. Build database query
3. Apply filters and sorting
4. Apply pagination
5. Execute query
6. Return paginated results

# Product Feature Business Rules

- The product listing page must display a category filter that supports multi-select.
- The filter must use the current list of categories from the database.
- When multiple categories are selected, the product list should show products matching any of the selected categories.
- If no category is selected, all products are shown.
- The filter UI must allow users to clear all selected categories at once.

This structure ensures consistent, comprehensive product business rules across the project, Sir! 