import { ApiError } from "@/core/errors/ApiError";
import { ErrorCodes } from "@/core/errors/errorCodes";

// Define the data interface
export interface Category {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

// Define filter and pagination interfaces
export interface FilterParams {
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Warning interface for deletion
export interface DeletionWarning {
    category: {
        _id: string;
        name: string;
    };
    warnings: {
        affectedProducts: number;
        affectedGroupCategories: number;
        productNames: string[];
        groupCategoryNames: string[];
    };
}

// Reusable error objects for common scenarios
export const RepositoryErrors = {
    // Network/Connection errors
    networkError: (entity: string, action: string) =>
        new ApiError(
            ErrorCodes.API.SERVICE_UNAVAILABLE,
            `Failed to ${action} ${entity} - network error`,
            { entity, action }
        ),

    // Not found errors
    notFound: (entity: string, id?: string) =>
        new ApiError(
            ErrorCodes.GENERIC.NOT_FOUND,
            id ? `${entity} with ID ${id} not found` : `${entity} not found`,
            { entity, id }
        ),

    // Validation errors
    validationError: (entity: string, field: string, message: string) =>
        new ApiError(
            ErrorCodes.GENERIC.VALIDATION_ERROR,
            `${field} validation failed for ${entity}: ${message}`,
            { entity, field, message }
        ),

    // Conflict errors (duplicates)
    conflict: (entity: string, field: string, value: string) =>
        new ApiError(
            ErrorCodes.GENERIC.CONFLICT,
            `${entity} with ${field} "${value}" already exists`,
            { entity, field, value }
        ),

    // Server errors
    serverError: (entity: string, action: string, details?: unknown) =>
        new ApiError(
            ErrorCodes.GENERIC.INTERNAL_ERROR,
            `Failed to ${action} ${entity}`,
            { entity, action, details }
        ),
};

// Entity-specific error objects
export const CategoryErrors = {
    notFound: (id?: string) => RepositoryErrors.notFound("Category", id),
    nameRequired: () =>
        new ApiError(
            ErrorCodes.CATEGORY.NAME_REQUIRED,
            "Category name is required",
            { entity: "Category", field: "name" }
        ),
    nameTooShort: () =>
        new ApiError(
            ErrorCodes.CATEGORY.NAME_TOO_SHORT,
            "Category name must be at least 2 characters",
            { entity: "Category", field: "name" }
        ),
    nameTooLong: () =>
        new ApiError(
            ErrorCodes.CATEGORY.NAME_TOO_LONG,
            "Category name must be at most 50 characters",
            { entity: "Category", field: "name" }
        ),
    nameDuplicate: (name: string) =>
        new ApiError(
            ErrorCodes.CATEGORY.NAME_DUPLICATE,
            `Category "${name}" already exists`,
            { entity: "Category", field: "name", value: name }
        ),
    invalidNameFormat: () =>
        new ApiError(
            ErrorCodes.VALIDATION.NAME_CONTAINS_INVALID_CHARS,
            "Category name can only contain alphanumeric characters, spaces, hyphens, and underscores",
            { entity: "Category", field: "name" }
        ),
    createFailed: () =>
        new ApiError(
            ErrorCodes.CATEGORY.CREATE_FAILED,
            "Failed to create category",
            { entity: "Category", action: "create" }
        ),
    updateFailed: () =>
        new ApiError(
            ErrorCodes.CATEGORY.UPDATE_FAILED,
            "Failed to update category",
            { entity: "Category", action: "update" }
        ),
    deleteFailed: () =>
        new ApiError(
            ErrorCodes.CATEGORY.DELETE_FAILED,
            "Failed to delete category",
            { entity: "Category", action: "delete" }
        ),
    fetchFailed: () =>
        new ApiError(
            ErrorCodes.CATEGORY.FETCH_FAILED,
            "Failed to fetch categories",
            { entity: "Category", action: "fetch" }
        ),
    hasProducts: () =>
        new ApiError(
            ErrorCodes.CATEGORY.HAS_PRODUCTS,
            "Cannot delete category with associated products",
            { entity: "Category", action: "delete" }
        ),
    userCancelledDeletion: () =>
        new ApiError(
            ErrorCodes.CATEGORY.USER_CANCELLED_DELETION,
            "Category deletion cancelled by user",
            { entity: "Category", action: "delete" }
        ),
    deletionNotConfirmed: () =>
        new ApiError(
            ErrorCodes.CATEGORY.DELETION_NOT_CONFIRMED,
            "Category deletion not confirmed",
            { entity: "Category", action: "delete" }
        ),
    cascadeRemovalFailed: () =>
        new ApiError(
            ErrorCodes.CATEGORY.CASCADE_REMOVAL_FAILED,
            "Failed to remove category from group categories",
            { entity: "Category", action: "delete" }
        ),
};

const API_URL = "/api/categories";

// Helper function for consistent error handling
async function handleApiResponse<T>(response: Response, entity: string, action: string): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle specific error codes from API
        if (errorData.error?.code) {
            throw new ApiError(
                errorData.error.code as any,
                errorData.error.message || `Failed to ${action} ${entity}`,
                {
                    entity,
                    action,
                    statusCode: response.status,
                    apiError: errorData
                }
            );
        }

        // Handle HTTP status codes
        switch (response.status) {
            case 404:
                throw RepositoryErrors.notFound(entity);
            case 409:
                throw RepositoryErrors.conflict(entity, "name", "unknown");
            case 400:
                throw RepositoryErrors.validationError(entity, "data", "Invalid data provided");
            case 500:
                throw RepositoryErrors.serverError(entity, action);
            default:
                throw RepositoryErrors.serverError(entity, action, { statusCode: response.status });
        }
    }

    const result = await response.json();
    return result.data || result;
}

// Helper function to build query parameters
function buildQueryParams(filters?: FilterParams, pagination?: PaginationParams): string {
    const params = new URLSearchParams();

    // Add filter parameters
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.order) params.append('order', filters.order);

    // Add pagination parameters
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    return params.toString();
}

// Validation function based on business rules
function validateCategoryData(data: any): void {
    if (!data.name || typeof data.name !== 'string') {
        throw CategoryErrors.nameRequired();
    }

    const trimmedName = data.name.trim();

    if (trimmedName.length < 2) {
        throw CategoryErrors.nameTooShort();
    }

    if (trimmedName.length > 50) {
        throw CategoryErrors.nameTooLong();
    }

    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
        throw CategoryErrors.invalidNameFormat();
    }
}

// Fetch all items with filters and pagination
export async function fetchCategories(
    filters?: FilterParams,
    pagination?: PaginationParams
): Promise<PaginatedResult<Category>> {
    try {
        const queryString = buildQueryParams(filters, pagination);
        const url = queryString ? `${API_URL}?${queryString}` : API_URL;

        const response = await fetch(url);
        return handleApiResponse<PaginatedResult<Category>>(response, "Category", "fetch");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw CategoryErrors.fetchFailed();
    }
}

// Fetch all categories without pagination
export async function fetchAllCategories(): Promise<Category[]> {
    try {
        const response = await fetch(API_URL);
        const result = await handleApiResponse<{ categories: Category[]; pagination: any }>(response, "Category", "fetch");
        return result.categories || [];
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw CategoryErrors.fetchFailed();
    }
}

// Fetch a single category by ID
export async function fetchCategoryById(id: string): Promise<Category> {
    try {
        if (!id) {
            throw CategoryErrors.notFound();
        }

        const response = await fetch(`${API_URL}/${id}`);
        return handleApiResponse<Category>(response, "Category", "fetch");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw CategoryErrors.notFound(id);
    }
}

// Create a new category
export async function createCategory(name: string): Promise<Category> {
    try {
        validateCategoryData({ name });

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name.trim() }),
        });

        return handleApiResponse<Category>(response, "Category", "create");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw CategoryErrors.createFailed();
    }
}

// Update an existing category
export async function updateCategory(id: string, name: string): Promise<Category> {
    try {
        if (!id) {
            throw CategoryErrors.notFound();
        }

        validateCategoryData({ name });

        const response = await fetch(API_URL, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: id, name: name.trim() }),
        });

        return handleApiResponse<Category>(response, "Category", "update");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw CategoryErrors.updateFailed();
    }
}

// Get deletion warning information
export async function getCategoryDeletionWarning(id: string): Promise<DeletionWarning> {
    try {
        if (!id) {
            throw CategoryErrors.notFound();
        }

        const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: id, confirmed: false }),
        });

        return handleApiResponse<DeletionWarning>(response, "Category", "delete");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw CategoryErrors.deleteFailed();
    }
}

// Delete a category with confirmation
export async function deleteCategory(id: string, confirmed: boolean = false): Promise<void> {
    try {
        if (!id) {
            throw CategoryErrors.notFound();
        }

        if (!confirmed) {
            throw CategoryErrors.deletionNotConfirmed();
        }

        const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: id, confirmed: true }),
        });

        await handleApiResponse(response, "Category", "delete");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw CategoryErrors.deleteFailed();
    }
} 