import { ApiError } from "@/core/errors/ApiError";
import { ErrorCodes } from "@/core/errors/errorCodes";

export interface GroupCategory {
    _id: string;
    name: string;
    categories: string[];
}

export interface FilterParams {
    search?: string;
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

export const RepositoryErrors = {
    networkError: (entity: string, action: string) =>
        new ApiError(
            ErrorCodes.API.SERVICE_UNAVAILABLE,
            `Failed to ${action} ${entity} - network error`,
            { entity, action }
        ),

    notFound: (entity: string, id?: string) =>
        new ApiError(
            ErrorCodes.GENERIC.NOT_FOUND,
            id ? `${entity} with ID ${id} not found` : `${entity} not found`,
            { entity, id }
        ),

    validationError: (entity: string, field: string, message: string) =>
        new ApiError(
            ErrorCodes.GENERIC.VALIDATION_ERROR,
            `${field} validation failed for ${entity}: ${message}`,
            { entity, field, message }
        ),

    conflict: (entity: string, field: string, value: string) =>
        new ApiError(
            ErrorCodes.GENERIC.CONFLICT,
            `${entity} with ${field} "${value}" already exists`,
            { entity, field, value }
        ),

    serverError: (entity: string, action: string, details?: unknown) =>
        new ApiError(
            ErrorCodes.GENERIC.INTERNAL_ERROR,
            `Failed to ${action} ${entity}`,
            { entity, action, details }
        ),
};

export const GroupCategoryErrors = {
    notFound: (id?: string) => RepositoryErrors.notFound("Group Category", id),
    invalidName: (message: string) =>
        new ApiError(
            ErrorCodes.GROUP_CATEGORY.INVALID_NAME,
            message,
            { entity: "Group Category", field: "name" }
        ),
    alreadyExists: (name: string) =>
        new ApiError(
            ErrorCodes.GROUP_CATEGORY.ALREADY_EXISTS,
            `Group Category "${name}" already exists`,
            { entity: "Group Category", field: "name", value: name }
        ),
    categoryAssignmentFailed: () =>
        new ApiError(
            ErrorCodes.GROUP_CATEGORY.CATEGORY_ASSIGNMENT_FAILED,
            "Failed to assign categories to group",
            { entity: "Group Category", action: "assign" }
        ),
    createFailed: () =>
        new ApiError(
            ErrorCodes.GROUP_CATEGORY.CREATE_FAILED,
            "Failed to create group category",
            { entity: "Group Category", action: "create" }
        ),
    updateFailed: () =>
        new ApiError(
            ErrorCodes.GROUP_CATEGORY.UPDATE_FAILED,
            "Failed to update group category",
            { entity: "Group Category", action: "update" }
        ),
    deleteFailed: () =>
        new ApiError(
            ErrorCodes.GROUP_CATEGORY.DELETE_FAILED,
            "Failed to delete group category",
            { entity: "Group Category", action: "delete" }
        ),
    fetchFailed: () =>
        new ApiError(
            ErrorCodes.GROUP_CATEGORY.FETCH_FAILED,
            "Failed to fetch group categories",
            { entity: "Group Category", action: "fetch" }
        ),
};

const API_URL = "/api/group-categories";

async function handleApiResponse<T>(response: Response, entity: string, action: string): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

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

function buildQueryParams(filters?: FilterParams, pagination?: PaginationParams): string {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    return params.toString();
}

function validateGroupCategoryData(data: any): void {
    if (!data.name || typeof data.name !== 'string') {
        throw GroupCategoryErrors.invalidName("Group category name is required and must be a string");
    }

    if (data.name.trim().length < 1) {
        throw GroupCategoryErrors.invalidName("Group category name cannot be empty");
    }

    if (data.name.length > 100) {
        throw GroupCategoryErrors.invalidName("Group category name must be less than 100 characters");
    }

    if (!Array.isArray(data.categories)) {
        throw GroupCategoryErrors.invalidName("Categories must be an array");
    }

    if (data.categories.length === 0) {
        throw GroupCategoryErrors.invalidName("At least one category must be selected");
    }

    for (const category of data.categories) {
        if (typeof category !== 'string') {
            throw GroupCategoryErrors.invalidName("All categories must be strings");
        }
    }
}

export async function fetchGroupCategories(
    filters?: FilterParams,
    pagination?: PaginationParams
): Promise<PaginatedResult<GroupCategory>> {
    try {
        const queryString = buildQueryParams(filters, pagination);
        const url = queryString ? `${API_URL}?${queryString}` : API_URL;

        const response = await fetch(url);
        return handleApiResponse<PaginatedResult<GroupCategory>>(response, "Group Category", "fetch");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw GroupCategoryErrors.fetchFailed();
    }
}

export async function fetchAllGroupCategories(): Promise<GroupCategory[]> {
    try {
        const response = await fetch(API_URL);
        return handleApiResponse<GroupCategory[]>(response, "Group Category", "fetch");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw GroupCategoryErrors.fetchFailed();
    }
}

export async function fetchGroupCategoryById(id: string): Promise<GroupCategory> {
    try {
        if (!id) {
            throw GroupCategoryErrors.invalidName("Group category ID is required");
        }

        const response = await fetch(`${API_URL}/${id}`);
        return handleApiResponse<GroupCategory>(response, "Group Category", "fetch");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw GroupCategoryErrors.fetchFailed();
    }
}

export async function createGroupCategory(name: string, categories: string[]): Promise<GroupCategory> {
    try {
        validateGroupCategoryData({ name, categories });

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, categories }),
        });

        return handleApiResponse<GroupCategory>(response, "Group Category", "create");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw GroupCategoryErrors.createFailed();
    }
}

export async function updateGroupCategory(id: string, name: string, categories: string[]): Promise<GroupCategory> {
    try {
        if (!id) {
            throw GroupCategoryErrors.invalidName("Group category ID is required");
        }
        validateGroupCategoryData({ name, categories });

        const response = await fetch(API_URL, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: id, name, categories }),
        });

        return handleApiResponse<GroupCategory>(response, "Group Category", "update");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw GroupCategoryErrors.updateFailed();
    }
}

export async function deleteGroupCategory(id: string): Promise<void> {
    try {
        if (!id) {
            throw GroupCategoryErrors.invalidName("Group category ID is required");
        }

        const response = await fetch(API_URL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: id }),
        });

        await handleApiResponse<{ success: boolean }>(response, "Group Category", "delete");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw GroupCategoryErrors.deleteFailed();
    }
} 