import { useEffect, useState, useCallback } from "react";
import ProductFormPopup from "./ProductFormPopup";
import { Product } from "@/data/product/repositories/productRepository";
import { Category, fetchAllCategories } from "@/data/category/repository/categoryRepository";
import ProductFilters from "@/components/ProductFilters";
import { ProductFilterState, DEFAULT_PRODUCT_FILTER, productFilterToParams } from "@/data/product/models/ProductFilter";
import { useProducts, useProductCreate, useProductUpdate, useProductDelete } from "@/core/hooks/useProductOperations";
import { useTheme } from "@/core/theme/ThemeContext";
import { LoadingState } from "@/components/states/LoadingState";
import { AdminProductItem } from "@/components/product/admin/product_item";
import DeleteDialog from "@/components/dialogs/delete_product_dialog";

export default function ProductsView() {
    const { colors } = useTheme();
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Use the new products hook
    const {
        products,
        productsLoading: loading,
        productsError: error,
        fetchProducts,
        updateFilters
    } = useProducts();

    // Use separate hooks for create/update/delete operations
    const { execute: createProduct } = useProductCreate();
    const { execute: updateProduct } = useProductUpdate();
    const { execute: deleteProductOperation, loading: deleteLoading } = useProductDelete();

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

    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

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

    // Handle delete product
    const handleDeleteProduct = async () => {
        if (!deleteProduct) return;

        try {
            // Execute the delete operation
            await deleteProductOperation(deleteProduct._id);

            // Close the dialog and clear selection
            setShowDeleteDialog(false);
            setDeleteProduct(null);

            // Refresh products after deletion
            fetchProducts();

            // Show success message
            setSuccessMessage(`Product "${deleteProduct.name}" deleted successfully`);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
            alert(errorMessage);
        }
    };

    // Handle delete dialog open
    const handleDeleteClick = (product: Product) => {
        setDeleteProduct(product);
        setShowDeleteDialog(true);
    };

    // Handle delete dialog close
    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
        setDeleteProduct(null);
    };

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
                {/* Success Message */}
                {successMessage && (
                    <div style={{
                        background: '#22c55e',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span>✅</span>
                        {successMessage}
                    </div>
                )}

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

                <LoadingState loading={loading} >
                    {products.length === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px', color: colors.secondary, fontSize: '1.1rem' }}>
                            {hasActiveFilters ? "No products match your filters." : "No products found."}
                        </div>
                    ) : (
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {products.map((product) => (
                                <AdminProductItem
                                    key={product._id}
                                    product={product}
                                    colors={colors}
                                    onClick={() => { setEditProduct(product); setShowForm(true); }}
                                    onDelete={() => handleDeleteClick(product)}
                                />
                            ))}
                        </ul>
                    )}
                </LoadingState>

                <ProductFormPopup
                    open={showForm}
                    onClose={() => { setShowForm(false); setEditProduct(null); }}
                    onSubmit={handleFormSubmit}
                    initialProduct={editProduct}
                />

                <DeleteDialog
                    open={showDeleteDialog}
                    onAccept={handleDeleteProduct}
                    onCancel={handleDeleteCancel}
                    productName={deleteProduct?.name}
                    loading={deleteLoading}
                />
            </div>
        </section>
    );
} 