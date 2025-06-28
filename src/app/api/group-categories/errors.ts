import { ApiError, handleMongoError, validateRequiredId, validateEntityExists } from "@/core/errors/ApiError";
import { ErrorCodes } from "@/core/errors/errorCodes";
import { NextResponse } from "next/server";

// Group Category-specific error handling functions
export function handleGroupCategoryError(err: unknown): NextResponse {
    console.error("❌ [GROUP CATEGORIES API] Error:", err);

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
                        code: ErrorCodes.GROUP_CATEGORY.NAME_DUPLICATE,
                        message: "Group category name already exists"
                    }
                }, { status: 409 });

            case 121: // Document validation failed
                return NextResponse.json({
                    success: false,
                    error: {
                        code: ErrorCodes.GROUP_CATEGORY.VALIDATION_ERROR,
                        message: "Group category validation failed"
                    }
                }, { status: 400 });

            default:
                return NextResponse.json({
                    success: false,
                    error: {
                        code: ErrorCodes.GROUP_CATEGORY.FETCH_FAILED,
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

// Group Category validation functions based on business rules
export function validateGroupCategoryData(data: any): void {
    // Check if name is provided
    if (!data.name || typeof data.name !== 'string') {
        throw ApiError.validationError(
            ErrorCodes.GROUP_CATEGORY.NAME_REQUIRED,
            "Group category name is required"
        );
    }

    const trimmedName = data.name.trim();

    // Check name length (3-100 characters)
    if (trimmedName.length < 3) {
        throw ApiError.validationError(
            ErrorCodes.GROUP_CATEGORY.NAME_TOO_SHORT,
            "Group category name must be at least 3 characters"
        );
    }

    if (trimmedName.length > 100) {
        throw ApiError.validationError(
            ErrorCodes.GROUP_CATEGORY.NAME_TOO_LONG,
            "Group category name must be at most 100 characters"
        );
    }

    // Check name format (alphanumeric, spaces, hyphens, underscores only)
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
        throw ApiError.validationError(
            ErrorCodes.VALIDATION.NAME_CONTAINS_INVALID_CHARS,
            "Group category name can only contain alphanumeric characters, spaces, hyphens, and underscores"
        );
    }

    // Update the data with trimmed name
    data.name = trimmedName;

    // Validate categories array if provided
    if (data.categories && Array.isArray(data.categories)) {
        // Categories array is optional, but if provided, must contain valid ObjectIds
        for (const categoryId of data.categories) {
            if (!categoryId || typeof categoryId !== 'string') {
                throw ApiError.validationError(
                    ErrorCodes.GROUP_CATEGORY.VALIDATION_ERROR,
                    "Invalid category ID in categories array"
                );
            }
        }
    }
}

// Group Category-specific error responses
export const GroupCategoryErrorResponses = {
    notFound: (id: string) => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.GENERIC.ID_NOT_FOUND,
            message: `Group category with ID ${id} not found`
        }
    }, { status: 404 }),

    alreadyExists: (name: string) => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.GROUP_CATEGORY.NAME_DUPLICATE,
            message: `Group category "${name}" already exists`
        }
    }, { status: 409 }),

    invalidName: (message: string) => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.GROUP_CATEGORY.INVALID_NAME,
            message: message
        }
    }, { status: 400 }),

    createFailed: () => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.GROUP_CATEGORY.CREATE_FAILED,
            message: "Failed to create group category"
        }
    }, { status: 500 }),

    updateFailed: () => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.GROUP_CATEGORY.UPDATE_FAILED,
            message: "Failed to update group category"
        }
    }, { status: 500 }),

    deleteFailed: () => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.GROUP_CATEGORY.DELETE_FAILED,
            message: "Failed to delete group category"
        }
    }, { status: 500 }),

    fetchFailed: () => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.GROUP_CATEGORY.FETCH_FAILED,
            message: "Failed to fetch group categories"
        }
    }, { status: 500 }),

    categoryAssignmentFailed: () => NextResponse.json({
        success: false,
        error: {
            code: ErrorCodes.GROUP_CATEGORY.CATEGORY_ASSIGNMENT_FAILED,
            message: "Failed to assign categories to group category"
        }
    }, { status: 500 }),
}; 