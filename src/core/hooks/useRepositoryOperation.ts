import { useState, useCallback } from 'react';

export interface UseRepositoryOperationResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    execute: () => Promise<void>;
}

export function useRepositoryOperation<T>(
    operation: () => Promise<T>
): UseRepositoryOperationResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await operation();
            setData(result);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [operation]);

    return {
        data,
        loading,
        error,
        execute
    };
}

// Hook for fetch operations
export function useFetchOperation<T>(fetchFn: () => Promise<T>) {
    return useRepositoryOperation(fetchFn);
}

export interface UseCreateOperationResult<T, TCreate> {
    loading: boolean;
    error: string | null;
    execute: (data: TCreate) => Promise<T>;
}

export function useCreateOperation<T, TCreate>(
    createOperation: (data: TCreate) => Promise<T>
): UseCreateOperationResult<T, TCreate> {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (data: TCreate): Promise<T> => {
        setLoading(true);
        setError(null);
        try {
            const result = await createOperation(data);
            return result;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [createOperation]);

    return {
        loading,
        error,
        execute
    };
}

export interface UseUpdateOperationResult<T, TUpdate> {
    loading: boolean;
    error: string | null;
    execute: (id: string, data: TUpdate) => Promise<T>;
}

export function useUpdateOperation<T, TUpdate>(
    updateOperation: (id: string, data: TUpdate) => Promise<T>
): UseUpdateOperationResult<T, TUpdate> {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (id: string, data: TUpdate): Promise<T> => {
        setLoading(true);
        setError(null);
        try {
            const result = await updateOperation(id, data);
            return result;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [updateOperation]);

    return {
        loading,
        error,
        execute
    };
}

export interface UseDeleteOperationResult {
    loading: boolean;
    error: string | null;
    execute: (id: string) => Promise<void>;
}

export function useDeleteOperation(
    deleteOperation: (id: string) => Promise<void>
): UseDeleteOperationResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (id: string): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await deleteOperation(id);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [deleteOperation]);

    return {
        loading,
        error,
        execute
    };
} 