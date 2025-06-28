import { ApiError } from "@/core/errors/ApiError";
import { ErrorCodes } from "@/core/errors/errorCodes";

export interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export interface FilterParams {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
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

export const ProductErrors = {
    notFound: (id?: string) => RepositoryErrors.notFound("Product", id),
    invalidName: (message: string) =>
        new ApiError(
            ErrorCodes.PRODUCT.NAME_REQUIRED,
            message,
            { entity: "Product", field: "name" }
        ),
    invalidPrice: (message: string) =>
        new ApiError(
            ErrorCodes.PRODUCT.PRICE_INVALID,
            message,
            { entity: "Product", field: "price" }
        ),
    invalidCategory: (message: string) =>
        new ApiError(
            ErrorCodes.PRODUCT.CATEGORY_INVALID,
            message,
            { entity: "Product", field: "category" }
        ),
    invalidImage: (message: string) =>
        new ApiError(
            ErrorCodes.PRODUCT.IMAGE_INVALID,
            message,
            { entity: "Product", field: "image" }
        ),
    alreadyExists: (name: string) =>
        new ApiError(
            ErrorCodes.PRODUCT.NAME_DUPLICATE,
            `Product "${name}" already exists`,
            { entity: "Product", field: "name", value: name }
        ),
    createFailed: () =>
        new ApiError(
            ErrorCodes.PRODUCT.CREATE_FAILED,
            "Failed to create product",
            { entity: "Product", action: "create" }
        ),
    updateFailed: () =>
        new ApiError(
            ErrorCodes.PRODUCT.UPDATE_FAILED,
            "Failed to update product",
            { entity: "Product", action: "update" }
        ),
    deleteFailed: () =>
        new ApiError(
            ErrorCodes.PRODUCT.DELETE_FAILED,
            "Failed to delete product",
            { entity: "Product", action: "delete" }
        ),
    fetchFailed: () =>
        new ApiError(
            ErrorCodes.PRODUCT.FETCH_FAILED,
            "Failed to fetch products",
            { entity: "Product", action: "fetch" }
        ),
};

const API_URL = "/api/products";

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
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    return params.toString();
}

function validateProductData(data: any): void {
    // Name validation
    if (!data.name || typeof data.name !== 'string') {
        throw ProductErrors.invalidName("Product name is required and must be a string");
    }

    if (data.name.trim().length < 1) {
        throw ProductErrors.invalidName("Product name must be at least 1 character");
    }

    if (data.name.length > 200) {
        throw ProductErrors.invalidName("Product name must be less than 200 characters");
    }

    // Category validation
    if (!data.category || typeof data.category !== 'string') {
        throw ProductErrors.invalidCategory("Product category is required and must be a string");
    }

    if (data.category.trim().length < 1) {
        throw ProductErrors.invalidCategory("Product category cannot be empty");
    }

    // Price validation
    if (typeof data.price !== 'number' || data.price < 0.01) {
        throw ProductErrors.invalidPrice("Product price must be a positive number (≥ 0.01)");
    }

    if (data.price > 999999.99) {
        throw ProductErrors.invalidPrice("Product price cannot exceed 999,999.99");
    }

    // Image validation
    if (!data.image || typeof data.image !== 'string') {
        throw ProductErrors.invalidImage("Product image is required and must be a string");
    }

    if (data.image.trim().length < 1) {
        throw ProductErrors.invalidImage("Product image cannot be empty");
    }
}

export async function fetchProducts(
    filters?: FilterParams,
    pagination?: PaginationParams
): Promise<PaginatedResult<Product>> {
    try {
        const queryString = buildQueryParams(filters, pagination);
        const url = queryString ? `${API_URL}?${queryString}` : API_URL;

        const response = await fetch(url);
        return handleApiResponse<PaginatedResult<Product>>(response, "Product", "fetch");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw ProductErrors.fetchFailed();
    }
}

export async function fetchAllProducts(): Promise<Product[]> {
    try {
        const response = await fetch(API_URL);
        return handleApiResponse<Product[]>(response, "Product", "fetch");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw ProductErrors.fetchFailed();
    }
}

export async function fetchProductById(id: string): Promise<Product> {
    try {
        if (!id) {
            throw ProductErrors.invalidName("Product ID is required");
        }

        const response = await fetch(`${API_URL}/${id}`);
        return handleApiResponse<Product>(response, "Product", "fetch");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw ProductErrors.fetchFailed();
    }
}

export async function createProduct(product: Omit<Product, '_id'>): Promise<Product> {
    try {
        validateProductData(product);

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });

        return handleApiResponse<Product>(response, "Product", "create");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw ProductErrors.createFailed();
    }
}

export async function updateProduct(id: string, product: Partial<Omit<Product, '_id'>>): Promise<Product> {
    try {
        if (!id) {
            throw ProductErrors.invalidName("Product ID is required");
        }
        validateProductData(product);

        const response = await fetch(API_URL, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: id, ...product }),
        });

        return handleApiResponse<Product>(response, "Product", "update");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw ProductErrors.updateFailed();
    }
}

export async function deleteProduct(id: string): Promise<void> {
    try {
        if (!id) {
            throw ProductErrors.invalidName("Product ID is required");
        }

        const response = await fetch(API_URL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: id }),
        });

        await handleApiResponse<{ success: boolean }>(response, "Product", "delete");
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw ProductErrors.deleteFailed();
    }
} 