import React, { useState, useCallback, useEffect } from 'react';
import { ApiError } from "@/core/errors/ApiError";

interface UseRepositoryOperationOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    autoExecute?: boolean;
}

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

// Hook for filtered and paginated data
export function useFilteredPagination<T>(
    fetchFn: (filters: any, pagination: any) => Promise<any>
) {
    const [state, setState] = useState({
        data: [] as T[],
        filters: {},
        pagination: { page: 1, limit: 10 },
        totalPages: 0,
        loading: false,
        error: null as string | null
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

    const updateFilters = useCallback((newFilters: any) => {
        setState(prev => ({
            ...prev,
            filters: newFilters,
            pagination: { ...prev.pagination, page: 1 } // Reset to first page
        }));
    }, []);

    const updatePagination = useCallback((newPagination: any) => {
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