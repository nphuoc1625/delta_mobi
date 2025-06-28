export interface GroupCategory {
    _id: string;
    name: string;
    categories: string[];
}

const API_URL = "/api/group-categories";

function getErrorMessage(res: Response, action: string) {
    if (res.status === 404) return `Group category not found when trying to ${action}.`;
    if (res.status === 400) return `Invalid data provided for ${action}.`;
    if (res.status === 409) return `Group category already exists.`;
    return `Failed to ${action} group category (status ${res.status}).`;
}

export async function fetchGroupCategories(): Promise<GroupCategory[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(getErrorMessage(res, "fetch"));
    return res.json();
}

export async function createGroupCategory(name: string): Promise<GroupCategory> {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error(getErrorMessage(res, "create"));
    return res.json();
}

export async function updateGroupCategory(_id: string, name: string): Promise<GroupCategory> {
    const res = await fetch(API_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id, name }),
    });
    if (!res.ok) throw new Error(getErrorMessage(res, "update"));
    return res.json();
}

export async function deleteGroupCategory(_id: string): Promise<void> {
    const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
    });
    if (!res.ok) throw new Error(getErrorMessage(res, "delete"));
} 