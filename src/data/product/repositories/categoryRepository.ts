export interface Category {
    _id: string;
    name: string;
}

const API_URL = "/api/categories";

function getErrorMessage(res: Response, action: string) {
    if (res.status === 404) return `Category not found when trying to ${action}.`;
    if (res.status === 400) return `Invalid data provided for ${action}.`;
    if (res.status === 409) return `Category already exists.`;
    return `Failed to ${action} category (status ${res.status}).`;
}

export async function fetchCategories(): Promise<Category[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(getErrorMessage(res, "fetch"));
    return res.json();
}

export async function createCategory(name: string): Promise<Category> {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error(getErrorMessage(res, "create"));
    return res.json();
}

export async function updateCategory(_id: string, name: string): Promise<Category> {
    const res = await fetch(API_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id, name }),
    });
    if (!res.ok) throw new Error(getErrorMessage(res, "update"));
    return res.json();
}

export async function deleteCategory(_id: string): Promise<void> {
    const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
    });
    if (!res.ok) throw new Error(getErrorMessage(res, "delete"));
} 