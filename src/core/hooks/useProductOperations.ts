import { useState, useCallback, useEffect } from 'react';
import { useRepositoryOperation, useCreateOperation, useUpdateOperation, useDeleteOperation } from './useRepositoryOperation';
import {
    fetchProducts,
    fetchAllProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    type Product,
    type FilterParams,
    type PaginationParams,
    type PaginatedResult
} from '@/data/product/repositories/productRepository';

export interface UseProductsOptions {
    initialFilters?: FilterParams;
    initialPagination?: PaginationParams;
}

export function useProducts(options: UseProductsOptions = {}) {
    const [filters, setFilters] = useState<FilterParams>(options.initialFilters || {});
    const [pagination, setPagination] = useState<PaginationParams>(options.initialPagination || { page: 1, limit: 10 });

    // Create a stable fetch function
    const fetchProductsWithParams = useCallback(
        () => fetchProducts(filters, pagination),
        [filters, pagination]
    );

    const {
        data: productsData,
        loading: productsLoading,
        error: productsError,
        execute: fetchProductsData
    } = useRepositoryOperation<PaginatedResult<Product>>(fetchProductsWithParams);

    const {
        data: allProducts,
        loading: allProductsLoading,
        error: allProductsError,
        execute: fetchAllProductsData
    } = useRepositoryOperation<Product[]>(fetchAllProducts);

    // Auto-fetch when filters or pagination change
    useEffect(() => {
        fetchProductsData();
    }, [fetchProductsData]);

    const updateFilters = useCallback((newFilters: Partial<FilterParams>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filters change
    }, []);

    const updatePagination = useCallback((newPagination: Partial<PaginationParams>) => {
        setPagination(prev => ({ ...prev, ...newPagination }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
        setPagination({ page: 1, limit: 10 });
    }, []);

    return {
        // Data
        products: productsData?.data || [],
        pagination: productsData?.pagination,
        allProducts: allProducts || [],

        // Loading states
        productsLoading,
        allProductsLoading,

        // Error states
        productsError,
        allProductsError,

        // Actions
        fetchProducts: fetchProductsData,
        fetchAllProducts: fetchAllProductsData,
        updateFilters,
        updatePagination,
        clearFilters,

        // Current state
        filters,
        currentPagination: pagination
    };
}

export function useProductById(id: string | null) {
    const {
        data: product,
        loading,
        error,
        execute: fetchProduct
    } = useRepositoryOperation<Product>(
        () => {
            if (!id) throw new Error('Product ID is required');
            return fetchProductById(id);
        }
    );

    // Auto-fetch when id changes
    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id, fetchProduct]);

    return {
        product,
        loading,
        error,
        fetchProduct
    };
}

export function useProductCreate() {
    return useCreateOperation<Product, Omit<Product, '_id'>>(createProduct);
}

export function useProductUpdate() {
    return useUpdateOperation<Product, Partial<Omit<Product, '_id'>>>(updateProduct);
}

export function useProductDelete() {
    return useDeleteOperation(deleteProduct);
} 