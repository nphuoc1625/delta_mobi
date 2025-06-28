import { useEffect, useState, useCallback } from "react";
import Loading from "../tab_category/Loading";
import ProductFormPopup from "./ProductFormPopup";
import { Product, fetchProducts, createProduct, updateProduct } from "@/data/product/repositories/productRepository";
import { Category, fetchCategories } from "@/data/category/repository/categoryRepository";
import ProductFilters from "@/components/ProductFilters";
import { ProductFilterState, DEFAULT_PRODUCT_FILTER, productFilterToParams } from "@/data/product/models/ProductFilter";
import Image from "next/image";

export default function ProductsView() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    // Filter state
    const [filters, setFilters] = useState<ProductFilterState>(DEFAULT_PRODUCT_FILTER);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [productsData, categoriesData] = await Promise.all([
                fetchProducts(productFilterToParams(filters)),
                fetchCategories()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
            setError(errorMessage);
        }
        setLoading(false);
    }, [filters]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    async function handleFormSubmit(product: Omit<Product, '_id'> & { _id?: string }) {
        try {
            if (product._id) {
                const { _id, ...updateData } = product;
                await updateProduct(_id, updateData);
            } else {
                await createProduct(product);
            }
            await loadProducts();
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
            <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
            <div className="bg-gray-900 rounded-xl p-8 shadow border border-gray-800 text-gray-300">
                {/* Search and Filter Section */}
                <div className="mb-6 space-y-4">
                    {/* Filter Options - Always Visible */}
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
                    <div className="mb-4 text-sm text-gray-400">
                        Showing {products.length} products
                        {filters.search && ` matching "${filters.search}"`}
                        {filters.category && ` in category "${filters.category}"`}
                    </div>
                )}

                {/* Add Product Button */}
                <div className="flex flex-row gap-2 mb-4 w-full items-center">
                    <button
                        type="button"
                        className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 font-semibold text-sm flex-shrink-0"
                        style={{ minWidth: "64px" }}
                        onClick={() => { setEditProduct(null); setShowForm(true); }}
                    >
                        + Add Product
                    </button>
                </div>

                {error && <div className="text-red-400 mb-2">{error}</div>}

                {loading ? (
                    <Loading />
                ) : products.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[120px] text-gray-500 text-lg">
                        {hasActiveFilters ? "No products match your filters." : "No products found."}
                    </div>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {products.map((product) => (
                            <li
                                key={product._id}
                                className="bg-gray-800 rounded-lg p-4 shadow flex items-center justify-between w-full cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
                                onClick={() => { setEditProduct(product); setShowForm(true); }}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-700 flex items-center justify-center">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <svg
                                            className={`w-6 h-6 text-gray-400 ${product.image ? 'hidden' : ''}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-base text-blue-200 truncate flex-1">{product.name} <span className="text-gray-400">(${product.price})</span></span>
                                </div>
                                <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded flex-shrink-0">{product.category}</span>
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