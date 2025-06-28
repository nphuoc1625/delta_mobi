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
                    error: "Product name already exists",
                    code: ErrorCodes.PRODUCT.NAME_DUPLICATE,
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
export function validateProductData(data: Record<string, unknown>): void {
    // Name validation
    if (!data.name || typeof data.name !== 'string') {
        throw new ApiError(
            ErrorCodes.PRODUCT.NAME_REQUIRED,
            "Product name is required and must be a string",
            { entity: "Product", field: "name" }
        );
    }

    if (data.name.trim().length < 1) {
        throw new ApiError(
            ErrorCodes.PRODUCT.NAME_TOO_SHORT,
            "Product name must be at least 1 character",
            { entity: "Product", field: "name" }
        );
    }

    if (data.name.length > 200) {
        throw new ApiError(
            ErrorCodes.PRODUCT.NAME_TOO_LONG,
            "Product name must be less than 200 characters",
            { entity: "Product", field: "name" }
        );
    }

    // Price validation
    if (typeof data.price !== 'number' || data.price <= 0) {
        throw new ApiError(
            ErrorCodes.PRODUCT.INVALID_PRICE,
            "Product price must be a positive number",
            { entity: "Product", field: "price" }
        );
    }

    if (data.price > 999999.99) {
        throw new ApiError(
            ErrorCodes.PRODUCT.PRICE_INVALID,
            "Product price must be less than 1,000,000",
            { entity: "Product", field: "price" }
        );
    }

    // Category validation
    if (!data.category || typeof data.category !== 'string') {
        throw new ApiError(
            ErrorCodes.PRODUCT.CATEGORY_REQUIRED,
            "Product category is required and must be a string",
            { entity: "Product", field: "category" }
        );
    }

    if (data.category.trim().length < 1) {
        throw new ApiError(
            ErrorCodes.PRODUCT.CATEGORY_INVALID,
            "Product category must be at least 1 character",
            { entity: "Product", field: "category" }
        );
    }

    if (data.category.length > 100) {
        throw new ApiError(
            ErrorCodes.PRODUCT.CATEGORY_INVALID,
            "Product category must be less than 100 characters",
            { entity: "Product", field: "category" }
        );
    }

    // Image validation (optional)
    if (data.image && typeof data.image !== 'string') {
        throw new ApiError(
            ErrorCodes.PRODUCT.IMAGE_INVALID,
            "Product image must be a string",
            { entity: "Product", field: "image" }
        );
    }

    if (data.image && typeof data.image === 'string' && data.image.length > 500) {
        throw new ApiError(
            ErrorCodes.PRODUCT.IMAGE_INVALID,
            "Product image URL must be less than 500 characters",
            { entity: "Product", field: "image" }
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

    nameDuplicate: (name: string) => NextResponse.json({
        error: `Product "${name}" already exists`,
        code: ErrorCodes.PRODUCT.NAME_DUPLICATE,
        statusCode: 409,
        timestamp: new Date().toISOString(),
    }, { status: 409 }),

    invalidName: (message: string) => NextResponse.json({
        error: message,
        code: ErrorCodes.PRODUCT.NAME_REQUIRED,
        statusCode: 400,
        timestamp: new Date().toISOString(),
    }, { status: 400 }),

    invalidPrice: (message: string) => NextResponse.json({
        error: message,
        code: ErrorCodes.PRODUCT.PRICE_INVALID,
        statusCode: 400,
        timestamp: new Date().toISOString(),
    }, { status: 400 }),

    invalidCategory: (message: string) => NextResponse.json({
        error: message,
        code: ErrorCodes.PRODUCT.CATEGORY_INVALID,
        statusCode: 400,
        timestamp: new Date().toISOString(),
    }, { status: 400 }),

    invalidImage: (message: string) => NextResponse.json({
        error: message,
        code: ErrorCodes.PRODUCT.IMAGE_INVALID,
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