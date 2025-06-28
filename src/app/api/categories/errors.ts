import { ApiError, handleMongoError, validateRequiredId, validateEntityExists } from "@/core/errors/ApiError";
import { ErrorCodes } from "@/core/errors/errorCodes";
import { NextResponse } from "next/server";

// Category-specific error handling functions
export function handleCategoryError(err: unknown): NextResponse {
    console.error("❌ [CATEGORIES API] Error:", err);

    if (err instanceof ApiError) {
        return NextResponse.json(err.toResponse(), { status: err.statusCode });
    }

    // Handle MongoDB specific errors
    if (err && typeof err === 'object' && 'code' in err) {
        const mongoError = err as { code: number; message: string };

        switch (mongoError.code) {
            case 11000: // Duplicate key error
                return NextResponse.json({
                    error: "Category already exists",
                    code: ErrorCodes.CATEGORY.ALREADY_EXISTS,
                    statusCode: 409,
                    timestamp: new Date().toISOString(),
                }, { status: 409 });

            case 121: // Document validation failed
                return NextResponse.json({
                    error: "Category validation failed",
                    code: ErrorCodes.CATEGORY.VALIDATION_ERROR,
                    statusCode: 400,
                    timestamp: new Date().toISOString(),
                }, { status: 400 });

            default:
                return NextResponse.json({
                    error: "Database operation failed",
                    code: ErrorCodes.CATEGORY.FETCH_FAILED,
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

// Category validation functions
export function validateCategoryData(data: any): void {
    if (!data.name || typeof data.name !== 'string') {
        throw ApiError.validationError(
            ErrorCodes.CATEGORY.INVALID_NAME,
            "Category name is required and must be a string"
        );
    }

    if (data.name.trim().length < 1) {
        throw ApiError.validationError(
            ErrorCodes.CATEGORY.INVALID_NAME,
            "Category name cannot be empty"
        );
    }

    if (data.name.length > 100) {
        throw ApiError.validationError(
            ErrorCodes.CATEGORY.INVALID_NAME,
            "Category name must be less than 100 characters"
        );
    }
}

// Category-specific error responses
export const CategoryErrorResponses = {
    notFound: (id: string) => NextResponse.json({
        error: `Category with ID ${id} not found`,
        code: ErrorCodes.CATEGORY.NOT_FOUND,
        statusCode: 404,
        timestamp: new Date().toISOString(),
    }, { status: 404 }),

    alreadyExists: (name: string) => NextResponse.json({
        error: `Category "${name}" already exists`,
        code: ErrorCodes.CATEGORY.ALREADY_EXISTS,
        statusCode: 409,
        timestamp: new Date().toISOString(),
    }, { status: 409 }),

    invalidName: (message: string) => NextResponse.json({
        error: message,
        code: ErrorCodes.CATEGORY.INVALID_NAME,
        statusCode: 400,
        timestamp: new Date().toISOString(),
    }, { status: 400 }),

    createFailed: () => NextResponse.json({
        error: "Failed to create category",
        code: ErrorCodes.CATEGORY.CREATE_FAILED,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    }, { status: 500 }),

    updateFailed: () => NextResponse.json({
        error: "Failed to update category",
        code: ErrorCodes.CATEGORY.UPDATE_FAILED,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    }, { status: 500 }),

    deleteFailed: () => NextResponse.json({
        error: "Failed to delete category",
        code: ErrorCodes.CATEGORY.DELETE_FAILED,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    }, { status: 500 }),

    fetchFailed: () => NextResponse.json({
        error: "Failed to fetch categories",
        code: ErrorCodes.CATEGORY.FETCH_FAILED,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    }, { status: 500 }),
}; 