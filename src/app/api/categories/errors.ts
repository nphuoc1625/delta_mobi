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
                    success: false,
                    error: {
                        code: ErrorCodes.CATEGORY.NAME_DUPLICATE,
                        message: "Category name already exists"
                    }
                }, { status: 409 });

            case 121: // Document validation failed
                return NextResponse.json({
                    success: false,
                    error: {
                        code: ErrorCodes.CATEGORY.VALIDATION_ERROR,
                        message: "Category validation failed"
                    }
                }, { status: 400 });

            default:
                return NextResponse.json({
                    success: false,
                    error: {
                        code: ErrorCodes.CATEGORY.FETCH_FAILED,
                        message: "Database operation failed"
                    }
                }, { status: 500 });
        }
    }

    // Generic error fallback
    return NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.GENERIC.INTERNAL_ERROR,
            message: "Internal server error"
        }
    }, { status: 500 });
}

// Category validation functions based on business rules
export function validateCategoryData(data: any): void {
    // Check if name is provided
    if (!data.name || typeof data.name !== 'string') {
        throw ApiError.validationError(
            ErrorCodes.CATEGORY.NAME_REQUIRED,
            "Category name is required"
        );
    }

    const trimmedName = data.name.trim();

    // Check name length (2-50 characters)
    if (trimmedName.length < 2) {
        throw ApiError.validationError(
            ErrorCodes.CATEGORY.NAME_TOO_SHORT,
            "Category name must be at least 2 characters"
        );
    }

    if (trimmedName.length > 50) {
        throw ApiError.validationError(
            ErrorCodes.CATEGORY.NAME_TOO_LONG,
            "Category name must be at most 50 characters"
        );
    }

    // Check name format (alphanumeric, spaces, hyphens, underscores only)
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
        throw ApiError.validationError(
            ErrorCodes.VALIDATION.NAME_CONTAINS_INVALID_CHARS,
            "Category name can only contain alphanumeric characters, spaces, hyphens, and underscores"
        );
    }

    // Update the data with trimmed name
    data.name = trimmedName;
}

// Category-specific error responses
export const CategoryErrorResponses = {
    notFound: (id: string) => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.GENERIC.ID_NOT_FOUND,
            message: `Category with ID ${id} not found`
        }
    }, { status: 404 }),

    alreadyExists: (name: string) => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.CATEGORY.NAME_DUPLICATE,
            message: `Category "${name}" already exists`
        }
    }, { status: 409 }),

    invalidName: (message: string) => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.CATEGORY.INVALID_NAME,
            message: message
        }
    }, { status: 400 }),

    createFailed: () => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.CATEGORY.CREATE_FAILED,
            message: "Failed to create category"
        }
    }, { status: 500 }),

    updateFailed: () => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.CATEGORY.UPDATE_FAILED,
            message: "Failed to update category"
        }
    }, { status: 500 }),

    deleteFailed: () => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.CATEGORY.DELETE_FAILED,
            message: "Failed to delete category"
        }
    }, { status: 500 }),

    fetchFailed: () => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.CATEGORY.FETCH_FAILED,
            message: "Failed to fetch categories"
        }
    }, { status: 500 }),

    hasProducts: () => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.CATEGORY.HAS_PRODUCTS,
            message: "Cannot delete category with associated products"
        }
    }, { status: 400 }),

    userCancelledDeletion: () => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.CATEGORY.USER_CANCELLED_DELETION,
            message: "Category deletion cancelled by user"
        }
    }, { status: 200 }),

    deletionNotConfirmed: () => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.CATEGORY.DELETION_NOT_CONFIRMED,
            message: "Category deletion not confirmed"
        }
    }, { status: 400 }),

    cascadeRemovalFailed: () => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.CATEGORY.CASCADE_REMOVAL_FAILED,
            message: "Failed to remove category from group categories"
        }
    }, { status: 500 }),
}; 