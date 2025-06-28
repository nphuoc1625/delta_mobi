# API Documentation - Products

## Overview
RESTful API endpoints for managing products in the DeltaMobi system.

## Base URL
```
/api/products
```

## Authentication
- **GET** endpoints: No authentication required
- **POST, PATCH, DELETE** endpoints: Admin authentication required

## Endpoints

### GET /api/products
Retrieve products with filtering, sorting, and pagination.

#### Query Parameters
| Parameter | Type    | Required | Default | Description                    |
|-----------|---------|----------|---------|--------------------------------|
| search    | string  | No       | -       | Search in name and category    |
| category  | string  | No       | -       | Filter by category             |
| minPrice  | number  | No       | -       | Minimum price filter           |
| maxPrice  | number  | No       | -       | Maximum price filter           |
| sortBy    | string  | No       | name    | Sort field (name, price, createdAt) |
| sortOrder | string  | No       | asc     | Sort order (asc, desc)         |
| page      | number  | No       | 1       | Page number                    |
| limit     | number  | No       | 10      | Items per page (max 100)       |

#### Behavior
- If `category` is provided, returns products where `category` matches any of the provided IDs.
- If not provided, returns all products.

#### Example Request
```
GET /api/products?category=catid1,catid2
```

#### Response Format
```json
{
  "data": [
    {
      "_id": "60f7c2b5e1d2c8a1b8e4d123",
      "name": "Delta Sound Pro X1",
      "category": "Headphones",
      "price": 199.99,
      "image": "/images/headphones.jpg",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Status Codes
- `200 OK`: Products retrieved successfully
- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Server error

---

### POST /api/products
Create a new product.

#### Request Body
```json
{
  "name": "Delta Sound Pro X1",
  "category": "Headphones",
  "price": 199.99,
  "image": "/images/headphones.jpg"
}
```

#### Validation Rules
- `name`: Required, 1-200 characters, unique
- `category`: Required, valid category name
- `price`: Required, positive number (≥ 0.01)
- `image`: Required, valid URL or file path

#### Response Format
```json
{
  "_id": "60f7c2b5e1d2c8a1b8e4d123",
  "name": "Delta Sound Pro X1",
  "category": "Headphones",
  "price": 199.99,
  "image": "/images/headphones.jpg",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Status Codes
- `201 Created`: Product created successfully
- `400 Bad Request`: Validation error
- `409 Conflict`: Product name already exists
- `500 Internal Server Error`: Server error

---

### PATCH /api/products
Update an existing product.

#### Request Body
```json
{
  "_id": "60f7c2b5e1d2c8a1b8e4d123",
  "name": "Delta Sound Pro X1 Updated",
  "category": "Headphones",
  "price": 179.99,
  "image": "/images/headphones-updated.jpg"
}
```

#### Validation Rules
- `_id`: Required, valid MongoDB ObjectId
- `name`: Optional, 1-200 characters, unique (if provided)
- `category`: Optional, valid category name (if provided)
- `price`: Optional, positive number (if provided)
- `image`: Optional, valid URL or file path (if provided)

#### Response Format
```json
{
  "_id": "60f7c2b5e1d2c8a1b8e4d123",
  "name": "Delta Sound Pro X1 Updated",
  "category": "Headphones",
  "price": 179.99,
  "image": "/images/headphones-updated.jpg",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:45:00Z"
}
```

#### Status Codes
- `200 OK`: Product updated successfully
- `400 Bad Request`: Validation error
- `404 Not Found`: Product not found
- `409 Conflict`: Product name already exists
- `500 Internal Server Error`: Server error

---

### DELETE /api/products
Delete a product.

#### Request Body
```json
{
  "_id": "60f7c2b5e1d2c8a1b8e4d123"
}
```

#### Validation Rules
- `_id`: Required, valid MongoDB ObjectId

#### Response Format
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "code": "PRODUCT_DELETE_SUCCESS",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

#### Status Codes
- `200 OK`: Product deleted successfully
- `400 Bad Request`: Invalid ID
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Server error

---

## Error Response Format

### Standard Error Response
```json
{
  "error": "Product name is required",
  "code": "PRODUCT_NAME_REQUIRED",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {
    "entity": "Product",
    "field": "name"
  }
}
```

### Validation Error Response
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {
    "entity": "Product",
    "field": "price",
    "message": "Price must be a positive number"
  }
}
```

---

## Error Codes

### Product-Specific Errors
| Code                    | Status | Description                           |
|-------------------------|--------|---------------------------------------|
| `PRODUCT_NAME_REQUIRED` | 400    | Product name is required              |
| `PRODUCT_NAME_TOO_SHORT` | 400   | Product name too short                |
| `PRODUCT_NAME_TOO_LONG` | 400    | Product name too long                 |
| `PRODUCT_NAME_DUPLICATE` | 409   | Product name already exists           |
| `PRODUCT_CATEGORY_REQUIRED` | 400 | Product category is required          |
| `PRODUCT_CATEGORY_INVALID` | 400 | Invalid product category              |
| `PRODUCT_PRICE_REQUIRED` | 400   | Product price is required             |
| `PRODUCT_PRICE_INVALID` | 400    | Invalid product price                 |
| `PRODUCT_IMAGE_REQUIRED` | 400   | Product image is required             |
| `PRODUCT_CREATE_FAILED` | 500    | Failed to create product              |
| `PRODUCT_UPDATE_FAILED` | 500    | Failed to update product              |
| `PRODUCT_DELETE_FAILED` | 500    | Failed to delete product              |
| `PRODUCT_FETCH_FAILED`  | 500    | Failed to fetch products              |

### Generic Errors
| Code                    | Status | Description                           |
|-------------------------|--------|---------------------------------------|
| `NOT_FOUND`             | 404    | Resource not found                    |
| `VALIDATION_ERROR`      | 400    | Validation failed                     |
| `CONFLICT`              | 409    | Resource conflict                     |
| `INTERNAL_ERROR`        | 500    | Internal server error                 |
| `UNAUTHORIZED`          | 401    | Unauthorized access                   |
| `FORBIDDEN`             | 403    | Insufficient permissions              |

---

## Rate Limiting
- **GET** requests: 100 requests per minute
- **POST, PATCH, DELETE** requests: 20 requests per minute

---

## Examples

### Search Products
```bash
GET /api/products?search=headphones&category=Audio&minPrice=50&maxPrice=200&sortBy=price&sortOrder=asc&page=1&limit=10
```

### Create Product
```bash
curl -X POST /api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Delta Sound Pro X1",
    "category": "Headphones",
    "price": 199.99,
    "image": "/images/headphones.jpg"
  }'
```

### Update Product
```bash
curl -X PATCH /api/products \
  -H "Content-Type: application/json" \
  -d '{
    "_id": "60f7c2b5e1d2c8a1b8e4d123",
    "price": 179.99
  }'
```

### Delete Product
```bash
curl -X DELETE /api/products \
  -H "Content-Type: application/json" \
  -d '{
    "_id": "60f7c2b5e1d2c8a1b8e4d123"
  }'
```

This API documentation ensures consistent, well-documented product endpoints across the project, Sir! 