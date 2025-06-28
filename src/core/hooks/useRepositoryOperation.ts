import React, { useState, useCallback, useEffect, useRef } from 'react';
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

    // Use refs to stabilize dependencies
    const operationRef = useRef(operation);
    const optionsRef = useRef(options);

    // Update refs when props change
    operationRef.current = operation;
    optionsRef.current = options;

    const execute = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const result = await operationRef.current();
            setData(result);
            setSuccess(true);
            optionsRef.current.onSuccess?.(result);

        } catch (err: unknown) {
            handleRepositoryError(err, setError);
            optionsRef.current.onError?.(err instanceof ApiError ? err.message : "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies since we use refs

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<T | null>(null);
    const [success, setSuccess] = useState(false);

    const execute = useCallback(async (params: P) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const result = await createFn(params);
            setData(result);
            setSuccess(true);

        } catch (err: unknown) {
            handleRepositoryError(err, setError);
        } finally {
            setLoading(false);
        }
    }, [createFn]);

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

// Hook for update operations
export function useUpdateOperation<T, P>(updateFn: (id: string, params: P) => Promise<T>) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<T | null>(null);
    const [success, setSuccess] = useState(false);

    const execute = useCallback(async (id: string, params: P) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const result = await updateFn(id, params);
            setData(result);
            setSuccess(true);

        } catch (err: unknown) {
            handleRepositoryError(err, setError);
        } finally {
            setLoading(false);
        }
    }, [updateFn]);

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

// Hook for delete operations
export function useDeleteOperation(deleteFn: (id: string) => Promise<void>) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const execute = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await deleteFn(id);
            setSuccess(true);

        } catch (err: unknown) {
            handleRepositoryError(err, setError);
        } finally {
            setLoading(false);
        }
    }, [deleteFn]);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setSuccess(false);
    }, []);

    return {
        loading,
        error,
        success,
        execute,
        reset
    };
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