import Image from "next/image";
import { type Product } from "@/data/product/repositories/productRepository";
import { ErrorDisplay } from "@/components/states/ErrorDisplay";
import { LoadingState } from "@/components/states/LoadingState";

interface ProductsViewProps {
    products: Product[];
    loading: boolean;
    error: string | null;
    search: string;
    onSearch: (searchTerm: string) => void;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    onPageChange?: (page: number) => void;
}

export default function ProductsView({
    products,
    loading,
    error,
    search,
    onSearch,
    pagination,
    onPageChange,
}: ProductsViewProps) {
    // Handle error state
    if (error) {
        return (
            <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-8 py-12 px-4">
                <ErrorDisplay
                    error={error}
                    onRetry={() => window.location.reload()}
                />
            </main>
        );
    }

    return (
        <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-8 py-12 px-4">
            {/* Product Grid */}
            <LoadingState loading={loading} fallback={<div className="text-center text-gray-400 text-lg py-12">Loading products...</div>}>
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.length === 0 ? (
                            <div className="col-span-full text-center text-gray-400 text-lg py-12">
                                No products found.
                                {search && (
                                    <div className="mt-2">
                                        <button
                                            onClick={() => onSearch("")}
                                            className="text-blue-400 hover:text-blue-300 underline"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            products.map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-gray-900 rounded-2xl p-6 flex flex-col items-center shadow-xl hover:scale-105 hover:shadow-blue-900 transition-transform border border-gray-800"
                                >
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={64}
                                        height={64}
                                        className="mb-4"
                                    />
                                    <h3 className="text-lg font-bold mb-2 text-white">{product.name}</h3>
                                    <span className="text-base font-semibold text-blue-400 mb-2">${product.price}</span>
                                    <span className="text-xs text-gray-400 mb-4">{product.category}</span>
                                    <button className="mt-auto px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold transition shadow">View Details</button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination && onPageChange && pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={() => onPageChange(pagination.page - 1)}
                                disabled={!pagination.hasPrev}
                                className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                            >
                                Previous
                            </button>

                            <span className="text-gray-300">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>

                            <button
                                onClick={() => onPageChange(pagination.page + 1)}
                                disabled={!pagination.hasNext}
                                className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* Results count */}
                    {pagination && (
                        <div className="text-center text-gray-400 text-sm">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
                        </div>
                    )}
                </>
            </LoadingState>
        </main>
    );
} 