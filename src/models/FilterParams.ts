export interface FilterParams {
    search?: string;
    category?: string;
    sort?: "price-asc" | "price-desc" | "newest";
    page?: number;
    pageSize?: number;
}

// Example usage:
// const params: FilterParams = { search: "headphone", category: "Headphones", sort: "price-asc", page: 1, pageSize: 20 }; 