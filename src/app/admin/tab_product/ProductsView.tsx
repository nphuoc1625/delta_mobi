import { useEffect, useState, useCallback } from "react";
import Loading from "../tab_category/Loading";
import ProductFormPopup from "./ProductFormPopup";
import { Product } from "@/data/product/repositories/productRepository";
import { Category, fetchAllCategories } from "@/data/category/repository/categoryRepository";
import ProductFilters from "@/components/ProductFilters";
import { ProductFilterState, DEFAULT_PRODUCT_FILTER, productFilterToParams } from "@/data/product/models/ProductFilter";
import Image from "next/image";
import { useProducts, useProductCreate, useProductUpdate } from "@/core/hooks/useProductOperations";
import { useTheme } from "@/core/theme/ThemeContext";

export default function ProductsView() {
    const { colors } = useTheme();
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    // Use the new products hook
    const {
        products,
        productsLoading: loading,
        productsError: error,
        fetchProducts,
        updateFilters
    } = useProducts();

    // Use separate hooks for create/update operations
    const { execute: createProduct } = useProductCreate();
    const { execute: updateProduct } = useProductUpdate();

    // Filter state
    const [filters, setFilters] = useState<ProductFilterState>(DEFAULT_PRODUCT_FILTER);

    const loadCategories = useCallback(async () => {
        try {
            const categoriesData = await fetchAllCategories();
            setCategories(categoriesData);
        } catch (err: unknown) {
            console.error('Failed to load categories:', err);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    // Update filters and fetch products
    useEffect(() => {
        const params = productFilterToParams(filters);
        updateFilters(params);
    }, [filters, updateFilters]);

    async function handleFormSubmit(product: Omit<Product, '_id'> & { _id?: string }) {
        try {
            if (product._id) {
                const { _id, ...updateData } = product;
                await updateProduct(_id, updateData);
            } else {
                await createProduct(product);
            }
            // Refresh products after creating/updating
            fetchProducts();
            setShowForm(false);
            setEditProduct(null);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save product';
            alert(errorMessage);
        }
    }

    // Clear all filters
    const clearFilters = () => {
        setFilters(DEFAULT_PRODUCT_FILTER);
    };

    // Check if any filters are active
    const hasActiveFilters = filters.search !== "" || filters.category !== "";

    return (
        <section>
            <h2 style={{ color: colors.primary, fontWeight: 600, fontSize: '1.5rem', marginBottom: '1rem' }}>Manage Products</h2>
            <div style={{ background: colors.background, color: colors.foreground, borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${colors.border}` }}>
                {/* Search and Filter Section */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <ProductFilters
                        categories={categories}
                        searchTerm={filters.search}
                        selectedCategory={filters.category}
                        onSearchChange={(search) => setFilters(prev => ({ ...prev, search }))}
                        onCategoryChange={(category) => setFilters(prev => ({ ...prev, category }))}
                        onClearFilters={clearFilters}
                        hasActiveFilters={hasActiveFilters}
                    />
                </div>

                {/* Results Summary */}
                {hasActiveFilters && (
                    <div style={{ marginBottom: '1rem', fontSize: '0.95rem', color: colors.secondary }}>
                        Showing {products.length} products
                        {filters.search && ` matching "${filters.search}"`}
                        {filters.category && ` in category "${filters.category}"`}
                    </div>
                )}

                {/* Add Product Button */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', marginBottom: '1rem', width: '100%', alignItems: 'center' }}>
                    <button
                        type="button"
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            background: colors.primary,
                            color: colors.foreground,
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            minWidth: '64px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        onClick={() => { setEditProduct(null); setShowForm(true); }}
                    >
                        + Add Product
                    </button>
                </div>

                {error && <div style={{ color: '#f87171', marginBottom: '0.5rem' }}>{error}</div>}

                {loading ? (
                    <Loading />
                ) : products.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px', color: colors.secondary, fontSize: '1.1rem' }}>
                        {hasActiveFilters ? "No products match your filters." : "No products found."}
                    </div>
                ) : (
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {products.map((product) => (
                            <li
                                key={product._id}
                                style={{
                                    background: colors.muted,
                                    borderRadius: '0.75rem',
                                    padding: '1rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    cursor: 'pointer',
                                    border: `1.5px solid ${colors.border}`,
                                    transition: 'box-shadow 0.2s',
                                }}
                                onClick={() => { setEditProduct(product); setShowForm(true); }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                                    <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', overflow: 'hidden', background: colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={48}
                                                height={48}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <svg
                                            className={`w-6 h-6 ${product.image ? 'hidden' : ''}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            style={{ color: colors.secondary }}
                                        >
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span style={{ fontWeight: 500, fontSize: '1rem', color: colors.primary, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name} <span style={{ color: colors.secondary }}>${product.price}</span></span>
                                </div>
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', background: colors.background, color: colors.secondary, padding: '0.25rem 0.75rem', borderRadius: '0.5rem', flexShrink: 0 }}>{product.category}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <ProductFormPopup
                    open={showForm}
                    onClose={() => { setShowForm(false); setEditProduct(null); }}
                    onSubmit={handleFormSubmit}
                    initialProduct={editProduct}
                />
            </div>
        </section>
    );
} 