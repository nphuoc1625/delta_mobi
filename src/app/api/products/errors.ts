import { ApiError } from "@/core/errors/ApiError";
import { ErrorCodes } from "@/core/errors/errorCodes";
import { NextResponse } from "next/server";

// Product-specific error handling function
export function handleProductError(err: unknown): NextResponse {
    console.error("❌ [PRODUCTS API] Error:", err);

    if (err instanceof ApiError) {
        return NextResponse.json(err.toResponse(), { status: err.statusCode });
    }

    // Handle MongoDB specific errors
    if (err && typeof err === 'object' && 'code' in err) {
        const mongoError = err as { code: number; message: string };

        switch (mongoError.code) {
            case 11000: // Duplicate key error
                return NextResponse.json({
                    error: "Product already exists",
                    code: ErrorCodes.PRODUCT.ALREADY_EXISTS,
                    statusCode: 409,
                    timestamp: new Date().toISOString(),
                }, { status: 409 });

            case 121: // Document validation failed
                return NextResponse.json({
                    error: "Product validation failed",
                    code: ErrorCodes.PRODUCT.VALIDATION_ERROR,
                    statusCode: 400,
                    timestamp: new Date().toISOString(),
                }, { status: 400 });

            default:
                return NextResponse.json({
                    error: "Database operation failed",
                    code: ErrorCodes.PRODUCT.FETCH_FAILED,
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

// Product validation functions
export function validateProductData(data: any): void {
    if (!data.name || typeof data.name !== 'string') {
        throw ApiError.validationError(
            ErrorCodes.PRODUCT.INVALID_DATA,
            "Product name is required and must be a string"
        );
    }

    if (data.name.trim().length < 1) {
        throw ApiError.validationError(
            ErrorCodes.PRODUCT.INVALID_DATA,
            "Product name cannot be empty"
        );
    }

    if (data.name.length > 200) {
        throw ApiError.validationError(
            ErrorCodes.PRODUCT.INVALID_DATA,
            "Product name must be less than 200 characters"
        );
    }

    if (!data.category || typeof data.category !== 'string') {
        throw ApiError.validationError(
            ErrorCodes.PRODUCT.INVALID_CATEGORY,
            "Product category is required and must be a string"
        );
    }

    if (data.category.trim().length < 1) {
        throw ApiError.validationError(
            ErrorCodes.PRODUCT.INVALID_CATEGORY,
            "Product category cannot be empty"
        );
    }

    if (typeof data.price !== 'number' || data.price < 0) {
        throw ApiError.validationError(
            ErrorCodes.PRODUCT.INVALID_PRICE,
            "Product price must be a positive number"
        );
    }

    if (data.price > 999999.99) {
        throw ApiError.validationError(
            ErrorCodes.PRODUCT.INVALID_PRICE,
            "Product price must be less than 1,000,000"
        );
    }

    if (!data.image || typeof data.image !== 'string') {
        throw ApiError.validationError(
            ErrorCodes.PRODUCT.INVALID_DATA,
            "Product image URL is required and must be a string"
        );
    }

    if (data.image.trim().length < 1) {
        throw ApiError.validationError(
            ErrorCodes.PRODUCT.INVALID_DATA,
            "Product image URL cannot be empty"
        );
    }
}

// Product-specific error responses
export const ProductErrorResponses = {
    notFound: (id: string) => NextResponse.json({
        error: `Product with ID ${id} not found`,
        code: ErrorCodes.PRODUCT.NOT_FOUND,
        statusCode: 404,
        timestamp: new Date().toISOString(),
    }, { status: 404 }),

    alreadyExists: (name: string) => NextResponse.json({
        error: `Product "${name}" already exists`,
        code: ErrorCodes.PRODUCT.ALREADY_EXISTS,
        statusCode: 409,
        timestamp: new Date().toISOString(),
    }, { status: 409 }),

    invalidData: (message: string) => NextResponse.json({
        error: message,
        code: ErrorCodes.PRODUCT.INVALID_DATA,
        statusCode: 400,
        timestamp: new Date().toISOString(),
    }, { status: 400 }),

    invalidPrice: (message: string) => NextResponse.json({
        error: message,
        code: ErrorCodes.PRODUCT.INVALID_PRICE,
        statusCode: 400,
        timestamp: new Date().toISOString(),
    }, { status: 400 }),

    invalidCategory: (message: string) => NextResponse.json({
        error: message,
        code: ErrorCodes.PRODUCT.INVALID_CATEGORY,
        statusCode: 400,
        timestamp: new Date().toISOString(),
    }, { status: 400 }),

    createFailed: () => NextResponse.json({
        error: "Failed to create product",
        code: ErrorCodes.PRODUCT.CREATE_FAILED,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    }, { status: 500 }),

    updateFailed: () => NextResponse.json({
        error: "Failed to update product",
        code: ErrorCodes.PRODUCT.UPDATE_FAILED,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    }, { status: 500 }),

    deleteFailed: () => NextResponse.json({
        error: "Failed to delete product",
        code: ErrorCodes.PRODUCT.DELETE_FAILED,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    }, { status: 500 }),

    fetchFailed: () => NextResponse.json({
        error: "Failed to fetch products",
        code: ErrorCodes.PRODUCT.FETCH_FAILED,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    }, { status: 500 }),
}; 