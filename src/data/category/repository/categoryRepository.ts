import { ApiError } from "@/core/errors/ApiError";
import { ErrorCodes } from "@/core/errors/errorCodes";

// Define the data interface
export interface Category {
    _id: string;
    name: string;
}

// Define filter and pagination interfaces
export interface FilterParams {
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
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
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
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
    invalidName: (message: string) =>
        new ApiError(
            ErrorCodes.CATEGORY.INVALID_NAME,
            message,
            { entity: "Category", field: "name" }
        ),
    alreadyExists: (name: string) =>
        new ApiError(
            ErrorCodes.CATEGORY.ALREADY_EXISTS,
            `Category "${name}" already exists`,
            { entity: "Category", field: "name", value: name }
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
};

const API_URL = "/api/categories";

// Helper function for consistent error handling
async function handleApiResponse<T>(response: Response, entity: string, action: string): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle specific error codes from API
        if (errorData.code) {
            throw new ApiError(
                errorData.code as any,
                errorData.error || `Failed to ${action} ${entity}`,
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

    return response.json();
}

// Helper function to build query parameters
function buildQueryParams(filters?: FilterParams, pagination?: PaginationParams): string {
    const params = new URLSearchParams();

    // Add filter parameters
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    // Add pagination parameters
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    return params.toString();
}

// Validation function
function validateCategoryData(data: any): void {
    if (!data.name || typeof data.name !== 'string') {
        throw CategoryErrors.invalidName("Category name is required and must be a string");
    }

    if (data.name.trim().length < 1) {
        throw CategoryErrors.invalidName("Category name cannot be empty");
    }

    if (data.name.length > 100) {
        throw CategoryErrors.invalidName("Category name must be less than 100 characters");
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

// Fetch all items (simple version without pagination)
export async function fetchAllCategories(): Promise<Category[]> {
    try {
        const response = await fetch(API_URL);
        return handleApiResponse<Category[]>(response, "Category", "fetch");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw CategoryErrors.fetchFailed();
    }
}

// Fetch single item by ID
export async function fetchCategoryById(id: string): Promise<Category> {
    try {
        if (!id) {
            throw CategoryErrors.invalidName("Category ID is required");
        }

        const response = await fetch(`${API_URL}/${id}`);
        return handleApiResponse<Category>(response, "Category", "fetch");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw CategoryErrors.fetchFailed();
    }
}

// Create new item
export async function createCategory(name: string): Promise<Category> {
    try {
        // Validate input
        validateCategoryData({ name });

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        return handleApiResponse<Category>(response, "Category", "create");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw CategoryErrors.createFailed();
    }
}

// Update existing item
export async function updateCategory(id: string, name: string): Promise<Category> {
    try {
        // Validate input
        if (!id) {
            throw CategoryErrors.invalidName("Category ID is required");
        }
        validateCategoryData({ name });

        const response = await fetch(API_URL, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: id, name }),
        });

        return handleApiResponse<Category>(response, "Category", "update");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw CategoryErrors.updateFailed();
    }
}

// Delete item
export async function deleteCategory(id: string): Promise<void> {
    try {
        if (!id) {
            throw CategoryErrors.invalidName("Category ID is required");
        }

        const response = await fetch(API_URL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: id }),
        });

        await handleApiResponse<{ success: boolean }>(response, "Category", "delete");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw CategoryErrors.deleteFailed();
    }
} 