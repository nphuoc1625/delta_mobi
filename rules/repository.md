# Repository Pattern Example for This Project

This project uses the repository pattern to encapsulate all data access and mutation logic. UI components and API routes **must not** interact directly with database models or external APIs. Instead, they should use repository modules to fetch, mutate, and handle results/errors.

## General Repository Structure

A repository module should:
- Export functions for all CRUD operations (fetchAll, fetchById, create, update, delete)
- Handle all error/result logic internally
- Never expose database/model logic to UI or API consumers
- **Return success results and throw errors** (consistent with API routes)
- Use proper TypeScript interfaces for data types

### Repository Pattern Rules

1. **Error Handling**: Always throw errors, never return error objects
2. **Success Results**: Return the actual data or success indicators
3. **Type Safety**: Define and export TypeScript interfaces for all data types
4. **API Abstraction**: Repository functions should call API endpoints, not database models directly
5. **Consistent Naming**: Use descriptive function names (fetchCategories, createCategory, etc.)

### Example Repository Module (TypeScript)

```ts
// Define the data interface
export interface Category {
  _id: string;
  name: string;
}

const API_URL = "/api/categories";

// Helper function for consistent error messages
function getErrorMessage(res: Response, action: string) {
  if (res.status === 404) return `Category not found when trying to ${action}.`;
  if (res.status === 400) return `Invalid data provided for ${action}.`;
  if (res.status === 409) return `Category already exists.`;
  return `Failed to ${action} category (status ${res.status}).`;
}

// Fetch all items
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(getErrorMessage(res, "fetch"));
  return res.json();
}

// Fetch single item by ID
export async function fetchCategoryById(id: string): Promise<Category> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(getErrorMessage(res, "fetch"));
  return res.json();
}

// Create new item
export async function createCategory(name: string): Promise<Category> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(getErrorMessage(res, "create"));
  return res.json();
}

// Update existing item
export async function updateCategory(id: string, name: string): Promise<Category> {
  const res = await fetch(API_URL, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id: id, name }),
  });
  if (!res.ok) throw new Error(getErrorMessage(res, "update"));
  return res.json();
}

// Delete item
export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(API_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id: id }),
  });
  if (!res.ok) throw new Error(getErrorMessage(res, "delete"));
}
```

### API Route Pattern

API routes should follow the "return for success, throw for errors" pattern:

```ts
import { NextResponse } from "next/server";
import { ApiError, handleMongoError, validateRequiredId, validateEntityExists } from "@/lib/api-utils";

export async function GET() {
  try {
    // Database operation
    const items = await Model.find();
    return NextResponse.json(items);
  } catch (err: any) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await Model.create(data);
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return handleMongoError(err, "Item");
  }
}
```

### Usage in UI Components

```ts
import { fetchCategories, createCategory, Category } from "@/repositories/categoryRepository";

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadCategories() {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleAddCategory(name: string) {
    try {
      const newCategory = await createCategory(name);
      setCategories(prev => [...prev, newCategory]);
    } catch (err: any) {
      setError(err.message);
    }
  }
}
```

### Key Principles

1. **Separation of Concerns**: UI components never call APIs directly
2. **Error Consistency**: All errors are thrown, not returned
3. **Type Safety**: Strong typing throughout the application
4. **Maintainability**: Centralized data access logic
5. **Testability**: Easy to mock repository functions for testing

Below is an example of a product repository module for this project:
