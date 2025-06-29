# API Documentation - Categories & Group Categories

## Base URL
```
/api
```

## Authentication
All endpoints require authentication. Include authorization header:
```
Authorization: Bearer <token>
```

---

## Category Endpoints

### GET /api/categories
Fetch all categories with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search by name
- `sort` (optional): Sort field (name, createdAt) (default: createdAt)
- `order` (optional): Sort order (asc, desc) (default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "60f7c2b5e1d2c8a1b8e4d456",
        "name": "Headphones",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Access denied"
  }
}
```

### POST /api/categories
Create a new category.

**Request Body:**
```json
{
  "name": "Headphones"
}
```

**Validation:**
- `name`: Required, 2-50 characters, unique across all categories
- `name`: Trimmed whitespace, alphanumeric characters, spaces, hyphens, underscores only

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7c2b5e1d2c8a1b8e4d456",
    "name": "Headphones",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": {
    "code": "CATEGORY_NAME_REQUIRED",
    "message": "Category name is required"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "CATEGORY_NAME_DUPLICATE",
    "message": "Category name already exists"
  }
}
```

### PATCH /api/categories/:id
Update an existing category.

**Request Body:**
```json
{
  "name": "Updated Headphones"
}
```

**Validation:**
- `id`: Valid MongoDB ObjectId
- `name`: 2-50 characters, unique across all categories

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7c2b5e1d2c8a1b8e4d456",
    "name": "Updated Headphones",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z"
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_ID_FORMAT",
    "message": "Invalid category ID format"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "ID_NOT_FOUND",
    "message": "Category not found"
  }
}
```

### DELETE /api/categories/:id
Delete a category with warnings.

**Response (Before Deletion):**
```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "60f7c2b5e1d2c8a1b8e4d456",
      "name": "Headphones"
    },
    "warnings": {
      "affectedProducts": 3,
      "affectedGroupCategories": 1,
      "productNames": ["iPhone 13", "Samsung Galaxy", "MacBook Pro"],
      "groupCategoryNames": ["Mobile Devices"]
    }
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": {
    "code": "CATEGORY_HAS_PRODUCTS",
    "message": "Cannot delete category with associated products"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "USER_CANCELLED_DELETION",
    "message": "Category deletion cancelled by user"
  }
}
```

---

## Group Category Endpoints

### GET /api/group-categories
Fetch all group categories with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search by name
- `sort` (optional): Sort field (name, createdAt) (default: createdAt)
- `order` (optional): Sort order (asc, desc) (default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "groupCategories": [
      {
        "_id": "60f7c2b5e1d2c8a1b8e4d789",
        "name": "Audio Devices",
        "categories": ["60f7c2b5e1d2c8a1b8e4d456"],
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  }
}
```

### POST /api/group-categories
Create a new group category.

**Request Body:**
```json
{
  "name": "Audio Devices",
  "categories": ["60f7c2b5e1d2c8a1b8e4d456"]
}
```

**Validation:**
- `name`: Required, 3-100 characters, unique across all group categories
- `categories`: Optional array of valid Category ObjectIds

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7c2b5e1d2c8a1b8e4d789",
    "name": "Audio Devices",
    "categories": ["60f7c2b5e1d2c8a1b8e4d456"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### PATCH /api/group-categories/:id
Update an existing group category.

**Request Body:**
```json
{
  "name": "Updated Audio Devices",
  "categories": ["60f7c2b5e1d2c8a1b8e4d456", "60f7c2b5e1d2c8a1b8e4d457"]
}
```

**Validation:**
- `id`: Valid MongoDB ObjectId
- `name`: 3-100 characters, unique across all group categories
- `categories`: Array of valid Category ObjectIds

### DELETE /api/group-categories/:id
Delete a group category.

**Success Response:**
```json
{
  "success": true,
  "data": {
    "message": "Group category deleted successfully"
  }
}
```

---

## Error Codes

### Category Errors
- `CATEGORY_NAME_REQUIRED`: Category name is required
- `CATEGORY_NAME_TOO_SHORT`: Category name must be at least 2 characters
- `CATEGORY_NAME_TOO_LONG`: Category name must be at most 50 characters
- `CATEGORY_NAME_DUPLICATE`: Category name already exists
- `CATEGORY_UPDATE_FAILED`: Failed to update category
- `CATEGORY_DELETE_FAILED`: Failed to delete category
- `CATEGORY_HAS_PRODUCTS`: Cannot delete category with associated products
- `CATEGORY_CASCADE_REMOVAL_FAILED`: Failed to remove category from group categories
- `USER_CANCELLED_DELETION`: Deletion cancelled by user

### Group Category Errors
- `GROUP_CATEGORY_NAME_REQUIRED`: Group category name is required
- `GROUP_CATEGORY_NAME_TOO_SHORT`: Group category name must be at least 3 characters
- `GROUP_CATEGORY_NAME_TOO_LONG`: Group category name must be at most 100 characters
- `GROUP_CATEGORY_NAME_DUPLICATE`: Group category name already exists
- `GROUP_CATEGORY_UPDATE_FAILED`: Failed to update group category
- `GROUP_CATEGORY_DELETE_FAILED`: Failed to delete group category

### General Errors
- `INVALID_ID_FORMAT`: Invalid ObjectId format
- `ID_NOT_FOUND`: Entity not found
- `INSUFFICIENT_PERMISSIONS`: Access denied
- `UNAUTHORIZED_ACCESS`: Authentication required
- `ERROR_FORMAT_INVALID`: Invalid error response format

---

## Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

---

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

## Pagination
All list endpoints support pagination with consistent format:
- `page`: Current page number
- `limit`: Items per page
- `total`: Total number of items
- `pages`: Total number of pages 