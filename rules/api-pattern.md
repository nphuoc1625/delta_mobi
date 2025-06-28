# API Route Pattern for This Project

This document outlines the standard pattern for API routes in this Next.js project. All API routes should follow these conventions for consistency, error handling, and maintainability.

## API Route Pattern Rules

1. **Error Handling**: Use centralized error codes and API-specific error handlers
2. **Status Codes**: Return appropriate HTTP status codes
3. **Response Format**: Consistent JSON response structure with error codes
4. **Validation**: Validate input data before processing
5. **Database Operations**: Use repository pattern for data access
6. **Error Centralization**: Each API should have its own `errors.ts` file

## Error Handling Structure

### Centralized Error System
- **`src/core/errors/errorCodes.ts`** - Centralized error codes, messages, and status codes
- **`src/core/errors/ApiError.ts`** - Enhanced ApiError class with error codes
- **`src/app/api/{entity}/errors.ts`** - API-specific error handling for each entity

### Error Code Format
```
ENTITY_ACTION_ERROR_TYPE
Examples:
- CATEGORY_NOT_FOUND
- PRODUCT_INVALID_PRICE
- GROUP_CATEGORY_ALREADY_EXISTS
- DATABASE_DUPLICATE_KEY
```

## Standard API Route Structure

### Basic GET Route
```ts
import { NextResponse } from "next/server";
import { ApiError, validateRequiredId, validateEntityExists } from "@/core/errors/ApiError";
import { handleEntityError } from "./errors";

export async function GET() {
  console.log("🔍 [ENTITY API] GET request received");
  try {
    console.log("🔌 [ENTITY API] Connecting to database...");
    await dbConnect();
    console.log("📊 [ENTITY API] Fetching all items...");
    const items = await Model.find();
    console.log(`✅ [ENTITY API] Found ${items.length} items`);
    return NextResponse.json(items);
  } catch (err: unknown) {
    console.error("❌ [ENTITY API] GET error:", err);
    return handleEntityError(err);
  }
}
```

### POST Route (Create)
```ts
export async function POST(req: Request) {
  console.log("➕ [ENTITY API] POST request received");
  try {
    console.log("🔌 [ENTITY API] Connecting to database...");
    await dbConnect();
    const data = await req.json();
    console.log("📝 [ENTITY API] Creating item with data:", data);
    
    // Validate data using API-specific validation
    validateEntityData(data);
    
    const item = await Model.create(data);
    console.log("✅ [ENTITY API] Item created successfully:", item);
    return NextResponse.json(item, { status: 201 });
  } catch (err: unknown) {
    console.error("❌ [ENTITY API] POST error:", err);
    return handleEntityError(err);
  }
}
```

### PATCH Route (Update)
```ts
export async function PATCH(req: Request) {
  console.log("✏️ [ENTITY API] PATCH request received");
  try {
    console.log("🔌 [ENTITY API] Connecting to database...");
    await dbConnect();
    const data = await req.json();
    const { _id, ...update } = data;
    console.log("🔄 [ENTITY API] Updating item:", { _id, update });

    validateRequiredId(_id, "Entity");
    validateEntityData(update);

    const item = await Model.findByIdAndUpdate(_id, update, { new: true });
    validateEntityExists(item, "Entity");

    console.log("✅ [ENTITY API] Item updated successfully:", item);
    return NextResponse.json(item);
  } catch (err: unknown) {
    console.error("❌ [ENTITY API] PATCH error:", err);
    return handleEntityError(err);
  }
}
```

### DELETE Route
```ts
export async function DELETE(req: Request) {
  console.log("🗑️ [ENTITY API] DELETE request received");
  try {
    console.log("🔌 [ENTITY API] Connecting to database...");
    await dbConnect();
    const data = await req.json();
    const { _id } = data;
    console.log("🗑️ [ENTITY API] Deleting item with ID:", _id);

    validateRequiredId(_id, "Entity");

    const item = await Model.findByIdAndDelete(_id);
    validateEntityExists(item, "Entity");

    console.log("✅ [ENTITY API] Item deleted successfully:", item);
    return NextResponse.json({ 
      success: true,
      message: "Item deleted successfully",
      code: "ENTITY_DELETE_SUCCESS",
      timestamp: new Date().toISOString()
    });
  } catch (err: unknown) {
    console.error("❌ [ENTITY API] DELETE error:", err);
    return handleEntityError(err);
  }
}
```

## API-Specific Error File Structure

### `src/app/api/{entity}/errors.ts`
```ts
import { ApiError } from "@/core/errors/ApiError";
import { ErrorCodes } from "@/core/errors/errorCodes";
import { NextResponse } from "next/server";

// Entity-specific error handling function
export function handleEntityError(err: unknown): NextResponse {
  console.error("❌ [ENTITY API] Error:", err);
  
  if (err instanceof ApiError) {
    return NextResponse.json(err.toResponse(), { status: err.statusCode });
  }
  
  // Handle MongoDB specific errors
  if (err && typeof err === 'object' && 'code' in err) {
    const mongoError = err as { code: number; message: string };
    
    switch (mongoError.code) {
      case 11000: // Duplicate key error
        return NextResponse.json({
          error: "Entity already exists",
          code: ErrorCodes.ENTITY.ALREADY_EXISTS,
          statusCode: 409,
          timestamp: new Date().toISOString(),
        }, { status: 409 });
      
      case 121: // Document validation failed
        return NextResponse.json({
          error: "Entity validation failed",
          code: ErrorCodes.ENTITY.VALIDATION_ERROR,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        }, { status: 400 });
      
      default:
        return NextResponse.json({
          error: "Database operation failed",
          code: ErrorCodes.ENTITY.FETCH_FAILED,
          statusCode: 500,
          timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
  }
  
  // Generic error fallback
  return NextResponse.json({
    error: "Internal server error",
    code: ErrorCodes.GENERIC.INTERNAL_ERROR,
    statusCode: 500,
    timestamp: new Date().toISOString(),
  }, { status: 500 });
}

// Entity validation functions
export function validateEntityData(data: any): void {
  if (!data.name || typeof data.name !== 'string') {
    throw ApiError.validationError(
      ErrorCodes.ENTITY.INVALID_NAME,
      "Entity name is required and must be a string"
    );
  }
  
  if (data.name.trim().length < 1) {
    throw ApiError.validationError(
      ErrorCodes.ENTITY.INVALID_NAME,
      "Entity name cannot be empty"
    );
  }
  
  if (data.name.length > 100) {
    throw ApiError.validationError(
      ErrorCodes.ENTITY.INVALID_NAME,
      "Entity name must be less than 100 characters"
    );
  }
}

// Entity-specific error responses
export const EntityErrorResponses = {
  notFound: (id: string) => NextResponse.json({
    error: `Entity with ID ${id} not found`,
    code: ErrorCodes.ENTITY.NOT_FOUND,
    statusCode: 404,
    timestamp: new Date().toISOString(),
  }, { status: 404 }),

  alreadyExists: (name: string) => NextResponse.json({
    error: `Entity "${name}" already exists`,
    code: ErrorCodes.ENTITY.ALREADY_EXISTS,
    statusCode: 409,
    timestamp: new Date().toISOString(),
  }, { status: 409 }),

  invalidName: (message: string) => NextResponse.json({
    error: message,
    code: ErrorCodes.ENTITY.INVALID_NAME,
    statusCode: 400,
    timestamp: new Date().toISOString(),
  }, { status: 400 }),

  createFailed: () => NextResponse.json({
    error: "Failed to create entity",
    code: ErrorCodes.ENTITY.CREATE_FAILED,
    statusCode: 500,
    timestamp: new Date().toISOString(),
  }, { status: 500 }),

  updateFailed: () => NextResponse.json({
    error: "Failed to update entity",
    code: ErrorCodes.ENTITY.UPDATE_FAILED,
    statusCode: 500,
    timestamp: new Date().toISOString(),
  }, { status: 500 }),

  deleteFailed: () => NextResponse.json({
    error: "Failed to delete entity",
    code: ErrorCodes.ENTITY.DELETE_FAILED,
    statusCode: 500,
    timestamp: new Date().toISOString(),
  }, { status: 500 }),

  fetchFailed: () => NextResponse.json({
    error: "Failed to fetch entities",
    code: ErrorCodes.ENTITY.FETCH_FAILED,
    statusCode: 500,
    timestamp: new Date().toISOString(),
  }, { status: 500 }),
};
```

## Advanced API Routes with Filtering and Pagination

### GET Route with Query Parameters
```ts
export async function GET(request: Request) {
  console.log("🔍 [ENTITY API] GET request with filters received");
  try {
    await dbConnect();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Build query object
    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await Model.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Execute query with pagination
    const items = await Model.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    // Return paginated response
    return NextResponse.json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (err: unknown) {
    console.error("❌ [ENTITY API] GET with filters error:", err);
    return handleEntityError(err);
  }
}
```

## Centralized Error Handling Utilities

### Enhanced ApiError Class
```ts
import { ErrorCodes, ErrorMessages, ErrorStatusCodes, ErrorCode } from './errorCodes';

export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly timestamp: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message?: string,
    details?: Record<string, unknown>
  ) {
    const defaultMessage = ErrorMessages[code];
    const statusCode = ErrorStatusCodes[code];
    
    super(message || defaultMessage);
    
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.details = details;
  }

  // Static factory methods
  static notFound(code: ErrorCode, message?: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(code, message, details);
  }

  static validationError(code: ErrorCode, message?: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(code, message, details);
  }

  static conflict(code: ErrorCode, message?: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(code, message, details);
  }

  static internalError(code: ErrorCode, message?: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(code, message, details);
  }

  // Convert to response format
  toResponse() {
    return {
      error: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      ...(this.details && { details: this.details }),
    };
  }
}
```

### Validation Functions
```ts
export function validateRequiredId(_id: string | undefined, entityName: string): void {
  if (!_id) {
    throw ApiError.validationError(
      ErrorCodes.GENERIC.VALIDATION_ERROR,
      `${entityName} ID is required`
    );
  }
}

export function validateEntityExists(entity: unknown, entityName: string): void {
  if (!entity) {
    throw ApiError.notFound(
      ErrorCodes.GENERIC.NOT_FOUND,
      `${entityName} not found`
    );
  }
}

export function validateRequiredField(
  value: unknown, 
  fieldName: string, 
  entityName: string
): void {
  if (value === undefined || value === null || value === '') {
    throw ApiError.validationError(
      ErrorCodes.GENERIC.VALIDATION_ERROR,
      `${fieldName} is required for ${entityName}`
    );
  }
}
```

## Response Format Standards

### Success Responses
```ts
// Single item
return NextResponse.json(item);

// List of items
return NextResponse.json(items);

// Created item
return NextResponse.json(item, { status: 201 });

// Paginated response
return NextResponse.json({
  data: items,
  pagination: { page, limit, total, totalPages, hasNext, hasPrev }
});

// Delete success with metadata
return NextResponse.json({ 
  success: true,
  message: "Item deleted successfully",
  code: "ENTITY_DELETE_SUCCESS",
  timestamp: new Date().toISOString()
});
```

### Error Responses (Standardized Format)
```ts
// All error responses follow this structure:
{
  "error": "Human-readable error message",
  "code": "ENTITY_ACTION_ERROR_TYPE",
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "details": { /* optional additional info */ }
}

// Examples:
// Validation error
{
  "error": "Category name is required and must be a string",
  "code": "CATEGORY_INVALID_NAME",
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// Not found
{
  "error": "Category with ID 123 not found",
  "code": "CATEGORY_NOT_FOUND",
  "statusCode": 404,
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// Conflict (duplicate)
{
  "error": "Category \"Electronics\" already exists",
  "code": "CATEGORY_ALREADY_EXISTS",
  "statusCode": 409,
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// Server error
{
  "error": "Failed to fetch categories",
  "code": "CATEGORY_FETCH_FAILED",
  "statusCode": 500,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Best Practices

1. **Always use try-catch**: Wrap all database operations
2. **Validate input**: Check required fields and data types using API-specific validation
3. **Use proper status codes**: 200, 201, 400, 404, 409, 500
4. **Consistent error messages**: Use descriptive, user-friendly messages
5. **Database connection**: Always call `dbConnect()` before database operations
6. **Type safety**: Use TypeScript for all API routes
7. **Logging**: Add debug logs for troubleshooting (in development)
8. **Error centralization**: Each API should have its own `errors.ts` file
9. **Error codes**: Use standardized error codes for consistency
10. **Timestamps**: Include timestamps in all error responses

## File Structure for Each API

```
src/app/api/{entity}/
├── route.ts          # Main API routes
├── errors.ts         # API-specific error handling
└── types.ts          # API-specific types (optional)
```

## Example Complete API Route

```ts
import { NextResponse } from "next/server";
import dbConnect from "@/infrac/mongoose";
import Category from "@/data/category/models/Category.model";
import { ApiError, validateRequiredId, validateEntityExists } from "@/core/errors/ApiError";
import { ErrorCodes } from "@/core/errors/errorCodes";
import { handleCategoryError, validateCategoryData } from "./errors";

export async function GET() {
  console.log("🔍 [CATEGORIES API] GET request received");
  try {
    console.log("🔌 [CATEGORIES API] Connecting to database...");
    await dbConnect();
    console.log("📊 [CATEGORIES API] Fetching all categories...");
    const categories = await Category.find();
    console.log(`✅ [CATEGORIES API] Found ${categories.length} categories`);
    return NextResponse.json(categories);
  } catch (err: unknown) {
    console.error("❌ [CATEGORIES API] GET error:", err);
    return handleCategoryError(err);
  }
}

export async function POST(req: Request) {
  console.log("➕ [CATEGORIES API] POST request received");
  try {
    console.log("🔌 [CATEGORIES API] Connecting to database...");
    await dbConnect();
    const data = await req.json();
    console.log("📝 [CATEGORIES API] Creating category with data:", data);
    
    // Validate category data
    validateCategoryData(data);
    
    const category = await Category.create(data);
    console.log("✅ [CATEGORIES API] Category created successfully:", category);
    return NextResponse.json(category, { status: 201 });
  } catch (err: unknown) {
    console.error("❌ [CATEGORIES API] POST error:", err);
    return handleCategoryError(err);
  }
}
``` 