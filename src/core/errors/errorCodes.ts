// Centralized Error Codes for the Application
// Format: ENTITY_ACTION_ERROR_TYPE

export const ErrorCodes = {
    // Generic Errors (1000-1999)
    GENERIC: {
        VALIDATION_ERROR: 'GENERIC_VALIDATION_ERROR',
        NOT_FOUND: 'GENERIC_NOT_FOUND',
        UNAUTHORIZED: 'GENERIC_UNAUTHORIZED',
        FORBIDDEN: 'GENERIC_FORBIDDEN',
        INTERNAL_ERROR: 'GENERIC_INTERNAL_ERROR',
        BAD_REQUEST: 'GENERIC_BAD_REQUEST',
        CONFLICT: 'GENERIC_CONFLICT',
    },

    // Category Errors (2000-2999)
    CATEGORY: {
        NOT_FOUND: 'CATEGORY_NOT_FOUND',
        ALREADY_EXISTS: 'CATEGORY_ALREADY_EXISTS',
        INVALID_NAME: 'CATEGORY_INVALID_NAME',
        CREATE_FAILED: 'CATEGORY_CREATE_FAILED',
        UPDATE_FAILED: 'CATEGORY_UPDATE_FAILED',
        DELETE_FAILED: 'CATEGORY_DELETE_FAILED',
        FETCH_FAILED: 'CATEGORY_FETCH_FAILED',
        VALIDATION_ERROR: 'CATEGORY_VALIDATION_ERROR',
    },

    // Group Category Errors (3000-3999)
    GROUP_CATEGORY: {
        NOT_FOUND: 'GROUP_CATEGORY_NOT_FOUND',
        ALREADY_EXISTS: 'GROUP_CATEGORY_ALREADY_EXISTS',
        INVALID_NAME: 'GROUP_CATEGORY_INVALID_NAME',
        CREATE_FAILED: 'GROUP_CATEGORY_CREATE_FAILED',
        UPDATE_FAILED: 'GROUP_CATEGORY_UPDATE_FAILED',
        DELETE_FAILED: 'GROUP_CATEGORY_DELETE_FAILED',
        FETCH_FAILED: 'GROUP_CATEGORY_FETCH_FAILED',
        VALIDATION_ERROR: 'GROUP_CATEGORY_VALIDATION_ERROR',
        CATEGORY_ASSIGNMENT_FAILED: 'GROUP_CATEGORY_CATEGORY_ASSIGNMENT_FAILED',
    },

    // Product Errors (4000-4999)
    PRODUCT: {
        NOT_FOUND: 'PRODUCT_NOT_FOUND',
        ALREADY_EXISTS: 'PRODUCT_ALREADY_EXISTS',
        INVALID_DATA: 'PRODUCT_INVALID_DATA',
        CREATE_FAILED: 'PRODUCT_CREATE_FAILED',
        UPDATE_FAILED: 'PRODUCT_UPDATE_FAILED',
        DELETE_FAILED: 'PRODUCT_DELETE_FAILED',
        FETCH_FAILED: 'PRODUCT_FETCH_FAILED',
        VALIDATION_ERROR: 'PRODUCT_VALIDATION_ERROR',
        INVALID_PRICE: 'PRODUCT_INVALID_PRICE',
        INVALID_CATEGORY: 'PRODUCT_INVALID_CATEGORY',
    },

    // Database Errors (5000-5999)
    DATABASE: {
        CONNECTION_FAILED: 'DATABASE_CONNECTION_FAILED',
        QUERY_FAILED: 'DATABASE_QUERY_FAILED',
        TRANSACTION_FAILED: 'DATABASE_TRANSACTION_FAILED',
        DUPLICATE_KEY: 'DATABASE_DUPLICATE_KEY',
        CONSTRAINT_VIOLATION: 'DATABASE_CONSTRAINT_VIOLATION',
    },

    // API Errors (6000-6999)
    API: {
        INVALID_REQUEST: 'API_INVALID_REQUEST',
        RATE_LIMIT_EXCEEDED: 'API_RATE_LIMIT_EXCEEDED',
        TIMEOUT: 'API_TIMEOUT',
        SERVICE_UNAVAILABLE: 'API_SERVICE_UNAVAILABLE',
    },
} as const;

// Error Messages mapping
export const ErrorMessages = {
    [ErrorCodes.GENERIC.VALIDATION_ERROR]: 'Validation error occurred',
    [ErrorCodes.GENERIC.NOT_FOUND]: 'Resource not found',
    [ErrorCodes.GENERIC.UNAUTHORIZED]: 'Unauthorized access',
    [ErrorCodes.GENERIC.FORBIDDEN]: 'Access forbidden',
    [ErrorCodes.GENERIC.INTERNAL_ERROR]: 'Internal server error',
    [ErrorCodes.GENERIC.BAD_REQUEST]: 'Bad request',
    [ErrorCodes.GENERIC.CONFLICT]: 'Resource conflict',

    [ErrorCodes.CATEGORY.NOT_FOUND]: 'Category not found',
    [ErrorCodes.CATEGORY.ALREADY_EXISTS]: 'Category already exists',
    [ErrorCodes.CATEGORY.INVALID_NAME]: 'Invalid category name',
    [ErrorCodes.CATEGORY.CREATE_FAILED]: 'Failed to create category',
    [ErrorCodes.CATEGORY.UPDATE_FAILED]: 'Failed to update category',
    [ErrorCodes.CATEGORY.DELETE_FAILED]: 'Failed to delete category',
    [ErrorCodes.CATEGORY.FETCH_FAILED]: 'Failed to fetch categories',
    [ErrorCodes.CATEGORY.VALIDATION_ERROR]: 'Category validation error',

    [ErrorCodes.GROUP_CATEGORY.NOT_FOUND]: 'Group category not found',
    [ErrorCodes.GROUP_CATEGORY.ALREADY_EXISTS]: 'Group category already exists',
    [ErrorCodes.GROUP_CATEGORY.INVALID_NAME]: 'Invalid group category name',
    [ErrorCodes.GROUP_CATEGORY.CREATE_FAILED]: 'Failed to create group category',
    [ErrorCodes.GROUP_CATEGORY.UPDATE_FAILED]: 'Failed to update group category',
    [ErrorCodes.GROUP_CATEGORY.DELETE_FAILED]: 'Failed to delete group category',
    [ErrorCodes.GROUP_CATEGORY.FETCH_FAILED]: 'Failed to fetch group categories',
    [ErrorCodes.GROUP_CATEGORY.VALIDATION_ERROR]: 'Group category validation error',
    [ErrorCodes.GROUP_CATEGORY.CATEGORY_ASSIGNMENT_FAILED]: 'Failed to assign categories to group',

    [ErrorCodes.PRODUCT.NOT_FOUND]: 'Product not found',
    [ErrorCodes.PRODUCT.ALREADY_EXISTS]: 'Product already exists',
    [ErrorCodes.PRODUCT.INVALID_DATA]: 'Invalid product data',
    [ErrorCodes.PRODUCT.CREATE_FAILED]: 'Failed to create product',
    [ErrorCodes.PRODUCT.UPDATE_FAILED]: 'Failed to update product',
    [ErrorCodes.PRODUCT.DELETE_FAILED]: 'Failed to delete product',
    [ErrorCodes.PRODUCT.FETCH_FAILED]: 'Failed to fetch products',
    [ErrorCodes.PRODUCT.VALIDATION_ERROR]: 'Product validation error',
    [ErrorCodes.PRODUCT.INVALID_PRICE]: 'Invalid product price',
    [ErrorCodes.PRODUCT.INVALID_CATEGORY]: 'Invalid product category',

    [ErrorCodes.DATABASE.CONNECTION_FAILED]: 'Database connection failed',
    [ErrorCodes.DATABASE.QUERY_FAILED]: 'Database query failed',
    [ErrorCodes.DATABASE.TRANSACTION_FAILED]: 'Database transaction failed',
    [ErrorCodes.DATABASE.DUPLICATE_KEY]: 'Duplicate key error',
    [ErrorCodes.DATABASE.CONSTRAINT_VIOLATION]: 'Database constraint violation',

    [ErrorCodes.API.INVALID_REQUEST]: 'Invalid API request',
    [ErrorCodes.API.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
    [ErrorCodes.API.TIMEOUT]: 'API request timeout',
    [ErrorCodes.API.SERVICE_UNAVAILABLE]: 'Service unavailable',
} as const;

// HTTP Status Code mapping
export const ErrorStatusCodes = {
    [ErrorCodes.GENERIC.VALIDATION_ERROR]: 400,
    [ErrorCodes.GENERIC.NOT_FOUND]: 404,
    [ErrorCodes.GENERIC.UNAUTHORIZED]: 401,
    [ErrorCodes.GENERIC.FORBIDDEN]: 403,
    [ErrorCodes.GENERIC.INTERNAL_ERROR]: 500,
    [ErrorCodes.GENERIC.BAD_REQUEST]: 400,
    [ErrorCodes.GENERIC.CONFLICT]: 409,

    [ErrorCodes.CATEGORY.NOT_FOUND]: 404,
    [ErrorCodes.CATEGORY.ALREADY_EXISTS]: 409,
    [ErrorCodes.CATEGORY.INVALID_NAME]: 400,
    [ErrorCodes.CATEGORY.CREATE_FAILED]: 500,
    [ErrorCodes.CATEGORY.UPDATE_FAILED]: 500,
    [ErrorCodes.CATEGORY.DELETE_FAILED]: 500,
    [ErrorCodes.CATEGORY.FETCH_FAILED]: 500,
    [ErrorCodes.CATEGORY.VALIDATION_ERROR]: 400,

    [ErrorCodes.GROUP_CATEGORY.NOT_FOUND]: 404,
    [ErrorCodes.GROUP_CATEGORY.ALREADY_EXISTS]: 409,
    [ErrorCodes.GROUP_CATEGORY.INVALID_NAME]: 400,
    [ErrorCodes.GROUP_CATEGORY.CREATE_FAILED]: 500,
    [ErrorCodes.GROUP_CATEGORY.UPDATE_FAILED]: 500,
    [ErrorCodes.GROUP_CATEGORY.DELETE_FAILED]: 500,
    [ErrorCodes.GROUP_CATEGORY.FETCH_FAILED]: 500,
    [ErrorCodes.GROUP_CATEGORY.VALIDATION_ERROR]: 400,
    [ErrorCodes.GROUP_CATEGORY.CATEGORY_ASSIGNMENT_FAILED]: 500,

    [ErrorCodes.PRODUCT.NOT_FOUND]: 404,
    [ErrorCodes.PRODUCT.ALREADY_EXISTS]: 409,
    [ErrorCodes.PRODUCT.INVALID_DATA]: 400,
    [ErrorCodes.PRODUCT.CREATE_FAILED]: 500,
    [ErrorCodes.PRODUCT.UPDATE_FAILED]: 500,
    [ErrorCodes.PRODUCT.DELETE_FAILED]: 500,
    [ErrorCodes.PRODUCT.FETCH_FAILED]: 500,
    [ErrorCodes.PRODUCT.VALIDATION_ERROR]: 400,
    [ErrorCodes.PRODUCT.INVALID_PRICE]: 400,
    [ErrorCodes.PRODUCT.INVALID_CATEGORY]: 400,

    [ErrorCodes.DATABASE.CONNECTION_FAILED]: 500,
    [ErrorCodes.DATABASE.QUERY_FAILED]: 500,
    [ErrorCodes.DATABASE.TRANSACTION_FAILED]: 500,
    [ErrorCodes.DATABASE.DUPLICATE_KEY]: 409,
    [ErrorCodes.DATABASE.CONSTRAINT_VIOLATION]: 400,

    [ErrorCodes.API.INVALID_REQUEST]: 400,
    [ErrorCodes.API.RATE_LIMIT_EXCEEDED]: 429,
    [ErrorCodes.API.TIMEOUT]: 408,
    [ErrorCodes.API.SERVICE_UNAVAILABLE]: 503,
} as const;

// Type definitions - Extract all error codes as a union type
type ErrorCodeValues<T> = T extends Record<string, infer U> ? U : never;
type ErrorCodeNested<T> = T extends Record<string, Record<string, string>>
    ? ErrorCodeValues<T[keyof T]>
    : never;

export type ErrorCode = ErrorCodeNested<typeof ErrorCodes>;
export type ErrorMessage = typeof ErrorMessages[ErrorCode];
export type ErrorStatusCode = typeof ErrorStatusCodes[ErrorCode]; 