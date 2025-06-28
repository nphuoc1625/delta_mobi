# UI State Management with Repositories

This document outlines the standard patterns for managing UI state when working with repository modules. Focus on state management, error handling, and repository integration patterns.

## Core State Management Principles

1. **Repository Abstraction**: UI components only interact with repository functions
2. **Centralized Error Handling**: Use centralized error codes and ApiError class
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **State Consistency**: Proper loading, error, and success states
5. **User Feedback**: Clear feedback for all user actions

## State Management Patterns

### Basic State Structure

```tsx
// Standard state structure for repository operations
interface RepositoryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Example usage
const [categories, setCategories] = useState<Category[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState(false);
```

### State Management Functions

```tsx
// Helper functions for consistent state management
function setLoadingState(setLoading: (loading: boolean) => void, setError: (error: string | null) => void) {
  setLoading(true);
  setError(null);
}

function setSuccessState<T>(
  setData: (data: T) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setSuccess: (success: boolean) => void,
  data: T
) {
  setData(data);
  setLoading(false);
  setError(null);
  setSuccess(true);
}

function setErrorState(
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setSuccess: (success: boolean) => void,
  error: string
) {
  setLoading(false);
  setError(error);
  setSuccess(false);
}
```

## Error Handling Patterns

### Centralized Error Handling

```tsx
import { ApiError } from "@/core/errors/ApiError";

// Standard error handling function
function handleRepositoryError(err: unknown, setError: (error: string) => void): void {
  if (err instanceof ApiError) {
    setError(err.message);
    console.error("Repository error:", err.code, err.details);
  } else {
    setError("An unexpected error occurred");
    console.error("Unknown error:", err);
  }
}

// Usage in components
async function loadData() {
  try {
    setLoadingState(setLoading, setError);
    const data = await fetchCategories();
    setSuccessState(setCategories, setLoading, setError, setSuccess, data);
  } catch (err: unknown) {
    handleRepositoryError(err, setError);
  }
}
```

### Error Display Components

```tsx
// Reusable error display component
interface ErrorDisplayProps {
  error: string | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({ error, onRetry, className = "" }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className={`error-display ${className}`}>
      <div className="error-message">{error}</div>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
}

// Loading state component
interface LoadingStateProps {
  loading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LoadingState({ 
  loading, 
  children, 
  fallback = <div>Loading...</div> 
}: LoadingStateProps) {
  if (loading) return <>{fallback}</>;
  return <>{children}</>;
}
```

## Repository Operation Patterns

### Custom Hook for Repository Operations

```tsx
import { useState, useCallback } from 'react';
import { ApiError } from "@/core/errors/ApiError";

interface UseRepositoryOperationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  autoExecute?: boolean;
}

export function useRepositoryOperation<T>(
  operation: () => Promise<T>,
  options: UseRepositoryOperationOptions<T> = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await operation();
      setData(result);
      setSuccess(true);
      options.onSuccess?.(result);
      
    } catch (err: unknown) {
      handleRepositoryError(err, setError);
      options.onError?.(err instanceof ApiError ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [operation, options]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    data,
    success,
    execute,
    reset
  };
}
```

### CRUD Operation Hooks

```tsx
// Hook for fetch operations
export function useFetchOperation<T>(fetchFn: () => Promise<T>) {
  return useRepositoryOperation(fetchFn, { autoExecute: true });
}

// Hook for create operations
export function useCreateOperation<T, P>(createFn: (params: P) => Promise<T>) {
  const [createParams, setCreateParams] = useState<P | null>(null);
  
  const operation = useCallback(() => {
    if (!createParams) throw new Error("No parameters provided");
    return createFn(createParams);
  }, [createFn, createParams]);
  
  const result = useRepositoryOperation(operation);
  
  const execute = useCallback((params: P) => {
    setCreateParams(params);
    return result.execute();
  }, [result.execute]);
  
  return { ...result, execute };
}

// Hook for update operations
export function useUpdateOperation<T, P>(updateFn: (id: string, params: P) => Promise<T>) {
  const [updateData, setUpdateData] = useState<{ id: string; params: P } | null>(null);
  
  const operation = useCallback(() => {
    if (!updateData) throw new Error("No update data provided");
    return updateFn(updateData.id, updateData.params);
  }, [updateFn, updateData]);
  
  const result = useRepositoryOperation(operation);
  
  const execute = useCallback((id: string, params: P) => {
    setUpdateData({ id, params });
    return result.execute();
  }, [result.execute]);
  
  return { ...result, execute };
}

// Hook for delete operations
export function useDeleteOperation(deleteFn: (id: string) => Promise<void>) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const operation = useCallback(() => {
    if (!deleteId) throw new Error("No ID provided");
    return deleteFn(deleteId);
  }, [deleteFn, deleteId]);
  
  const result = useRepositoryOperation(operation);
  
  const execute = useCallback((id: string) => {
    setDeleteId(id);
    return result.execute();
  }, [result.execute]);
  
  return { ...result, execute };
}
```

## Optimistic Updates Pattern

```tsx
// Optimistic update helper
function useOptimisticUpdate<T>(
  data: T[],
  setData: (data: T[]) => void,
  operation: () => Promise<void>,
  optimisticAction: (data: T[]) => T[]
) {
  const [originalData, setOriginalData] = useState<T[]>([]);
  
  const execute = useCallback(async () => {
    // Store original data
    setOriginalData([...data]);
    
    // Apply optimistic update
    setData(optimisticAction(data));
    
    try {
      await operation();
    } catch (error) {
      // Revert on error
      setData(originalData);
      throw error;
    }
  }, [data, setData, operation, optimisticAction, originalData]);
  
  return execute;
}

// Usage example
const optimisticCreate = useOptimisticUpdate(
  categories,
  setCategories,
  () => createCategory(name),
  (current) => [...current, { _id: `temp-${Date.now()}`, name }]
);
```

## Filter and Pagination State Management

```tsx
// State structure for filters and pagination
interface FilterPaginationState<T> {
  data: T[];
  filters: FilterParams;
  pagination: PaginationParams;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

// Hook for managing filtered and paginated data
export function useFilteredPagination<T>(
  fetchFn: (filters: FilterParams, pagination: PaginationParams) => Promise<PaginatedResult<T>>
) {
  const [state, setState] = useState<FilterPaginationState<T>>({
    data: [],
    filters: {},
    pagination: { page: 1, limit: 10 },
    totalPages: 0,
    loading: false,
    error: null
  });

  const loadData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await fetchFn(state.filters, state.pagination);
      
      setState(prev => ({
        ...prev,
        data: result.data,
        totalPages: result.pagination.totalPages,
        loading: false
      }));
    } catch (err: unknown) {
      handleRepositoryError(err, (error) => 
        setState(prev => ({ ...prev, error, loading: false }))
      );
    }
  }, [fetchFn, state.filters, state.pagination]);

  const updateFilters = useCallback((newFilters: FilterParams) => {
    setState(prev => ({
      ...prev,
      filters: newFilters,
      pagination: { ...prev.pagination, page: 1 } // Reset to first page
    }));
  }, []);

  const updatePagination = useCallback((newPagination: PaginationParams) => {
    setState(prev => ({ ...prev, pagination: newPagination }));
  }, []);

  // Auto-reload when filters or pagination change
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ...state,
    loadData,
    updateFilters,
    updatePagination
  };
}
```

## Best Practices

### 1. **State Management**
- Always maintain loading, error, and success states
- Use consistent state structure across components
- Reset error states when starting new operations
- Use optimistic updates for better UX

### 2. **Error Handling**
- Use centralized error handling functions
- Log error codes and details for debugging
- Provide user-friendly error messages
- Include retry mechanisms where appropriate

### 3. **Type Safety**
- Use proper TypeScript interfaces for all state
- Avoid `any` types in state management
- Use proper error typing with `unknown`

### 4. **Performance**
- Implement proper loading states
- Use pagination for large datasets
- Consider debouncing for search operations
- Use memoization for expensive operations

### 5. **User Experience**
- Provide immediate feedback for user actions
- Use optimistic updates for better perceived performance
- Include proper loading indicators
- Handle edge cases gracefully

## Related Documentation

- **[Repository Pattern](./repository.md)** - Repository module patterns and structure
- **[API Route Pattern](./api-pattern.md)** - API route patterns and error handling 