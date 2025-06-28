import { ProductFilter } from "@/data/product/models/ProductFilter";

export interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    image: string;
}

const API_URL = "/api/products";

function getErrorMessage(res: Response, action: string) {
    if (res.status === 404) return `Product not found when trying to ${action}.`;
    if (res.status === 400) return `Invalid data provided for ${action}.`;
    if (res.status === 409) return `Product already exists.`;
    return `Failed to ${action} product (status ${res.status}).`;
}

function buildQueryString(params: ProductFilter): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value.toString());
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
}

export async function fetchProducts(filters?: ProductFilter): Promise<Product[]> {
    const queryString = filters ? buildQueryString(filters) : "";
    const res = await fetch(`${API_URL}${queryString}`);
    if (!res.ok) throw new Error(getErrorMessage(res, "fetch"));
    return res.json();
}

export async function createProduct(product: Omit<Product, '_id'>): Promise<Product> {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(getErrorMessage(res, "create"));
    return res.json();
}

export async function updateProduct(_id: string, product: Partial<Omit<Product, '_id'>>): Promise<Product> {
    const res = await fetch(API_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id, ...product }),
    });
    if (!res.ok) throw new Error(getErrorMessage(res, "update"));
    return res.json();
}

export async function deleteProduct(_id: string): Promise<void> {
    const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
    });
    if (!res.ok) throw new Error(getErrorMessage(res, "delete"));
} 