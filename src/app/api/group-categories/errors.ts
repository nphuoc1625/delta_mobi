import { ApiError } from "@/core/errors/ApiError";
import { ErrorCodes } from "@/core/errors/errorCodes";
import { NextResponse } from "next/server";

// Group Category-specific error handling function
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
                    error: "Group category already exists",
                    code: ErrorCodes.GROUP_CATEGORY.ALREADY_EXISTS,
                    statusCode: 409,
                    timestamp: new Date().toISOString(),
                }, { status: 409 });

            case 121: // Document validation failed
                return NextResponse.json({
                    error: "Group category validation failed",
                    code: ErrorCodes.GROUP_CATEGORY.VALIDATION_ERROR,
                    statusCode: 400,
                    timestamp: new Date().toISOString(),
                }, { status: 400 });

            default:
                return NextResponse.json({
                    error: "Database operation failed",
                    code: ErrorCodes.GROUP_CATEGORY.FETCH_FAILED,
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

// Group Category validation functions
export function validateGroupCategoryData(data: any): void {
    if (!data.name || typeof data.name !== 'string') {
        throw ApiError.validationError(
            ErrorCodes.GROUP_CATEGORY.INVALID_NAME,
            "Group category name is required and must be a string"
        );
    }

    if (data.name.trim().length < 1) {
        throw ApiError.validationError(
            ErrorCodes.GROUP_CATEGORY.INVALID_NAME,
            "Group category name cannot be empty"
        );
    }

    if (data.name.length > 100) {
        throw ApiError.validationError(
            ErrorCodes.GROUP_CATEGORY.INVALID_NAME,
            "Group category name must be less than 100 characters"
        );
    }

    if (!Array.isArray(data.categories)) {
        throw ApiError.validationError(
            ErrorCodes.GROUP_CATEGORY.VALIDATION_ERROR,
            "Categories must be an array"
        );
    }

    if (data.categories.length === 0) {
        throw ApiError.validationError(
            ErrorCodes.GROUP_CATEGORY.VALIDATION_ERROR,
            "At least one category must be selected"
        );
    }

    // Validate that all categories are strings
    for (const category of data.categories) {
        if (typeof category !== 'string') {
            throw ApiError.validationError(
                ErrorCodes.GROUP_CATEGORY.VALIDATION_ERROR,
                "All categories must be strings"
            );
        }
    }
}

// Group Category-specific error responses
export const GroupCategoryErrorResponses = {
    notFound: (id: string) => NextResponse.json({
        error: `Group category with ID ${id} not found`,
        code: ErrorCodes.GROUP_CATEGORY.NOT_FOUND,
        statusCode: 404,
        timestamp: new Date().toISOString(),
    }, { status: 404 }),

    alreadyExists: (name: string) => NextResponse.json({
        error: `Group category "${name}" already exists`,
        code: ErrorCodes.GROUP_CATEGORY.ALREADY_EXISTS,
        statusCode: 409,
        timestamp: new Date().toISOString(),
    }, { status: 409 }),

    invalidName: (message: string) => NextResponse.json({
        error: message,
        code: ErrorCodes.GROUP_CATEGORY.INVALID_NAME,
        statusCode: 400,
        timestamp: new Date().toISOString(),
    }, { status: 400 }),

    categoryAssignmentFailed: () => NextResponse.json({
        error: "Failed to assign categories to group",
        code: ErrorCodes.GROUP_CATEGORY.CATEGORY_ASSIGNMENT_FAILED,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    }, { status: 500 }),

    createFailed: () => NextResponse.json({
        error: "Failed to create group category",
        code: ErrorCodes.GROUP_CATEGORY.CREATE_FAILED,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    }, { status: 500 }),

    updateFailed: () => NextResponse.json({
        error: "Failed to update group category",
        code: ErrorCodes.GROUP_CATEGORY.UPDATE_FAILED,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    }, { status: 500 }),

    deleteFailed: () => NextResponse.json({
        error: "Failed to delete group category",
        code: ErrorCodes.GROUP_CATEGORY.DELETE_FAILED,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    }, { status: 500 }),

    fetchFailed: () => NextResponse.json({
        error: "Failed to fetch group categories",
        code: ErrorCodes.GROUP_CATEGORY.FETCH_FAILED,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    }, { status: 500 }),
}; 