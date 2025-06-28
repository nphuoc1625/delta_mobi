export interface ProductFilter {
    search?: string;
    category?: string;
}

export interface ProductFilterState {
    search: string;
    category: string;
}

export const DEFAULT_PRODUCT_FILTER: ProductFilterState = {
    search: "",
    category: "",
};

export function productFilterToParams(filter: ProductFilterState): ProductFilter {
    const params: ProductFilter = {};

    if (filter.search.trim()) params.search = filter.search.trim();
    if (filter.category) params.category = filter.category;

    return params;
} 