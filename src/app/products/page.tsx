"use client";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductsView from "./ProductsView";
import { useProducts } from "@/core/hooks/useProductOperations";
import { fetchAllCategories, Category } from "@/data/category/repository/categoryRepository";
import CategoryMultiSelect from "@/components/CategoryMultiSelect";

const filters = ["Price: Low to High", "Price: High to Low", "Newest"];

export default function ProductsPage() {
    const {
        products,
        pagination,
        productsLoading,
        productsError,
        updateFilters,
        updatePagination,
        clearFilters,
        filters: currentFilters
    } = useProducts();

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Fetch categories on mount
    useEffect(() => {
        fetchAllCategories().then(setCategories);
    }, []);

    // Update product filters when selectedCategories changes
    useEffect(() => {
        if (selectedCategories.length > 0) {
            updateFilters({ category: selectedCategories.join(",") });
        } else {
            updateFilters({ category: undefined });
        }
    }, [selectedCategories, updateFilters]);

    // Handle search
    const handleSearch = (searchTerm: string) => {
        updateFilters({ search: searchTerm });
    };

    // Handle sort filter
    const handleSortChange = (sortOption: string) => {
        switch (sortOption) {
            case "Price: Low to High":
                updateFilters({ sortBy: "price", sortOrder: "asc" });
                break;
            case "Price: High to Low":
                updateFilters({ sortBy: "price", sortOrder: "desc" });
                break;
            case "Newest":
                updateFilters({ sortBy: "createdAt", sortOrder: "desc" });
                break;
            default:
                updateFilters({ sortBy: "name", sortOrder: "asc" });
        }
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        updatePagination({ page });
    };

    // Handle clear filters
    const handleClearFilters = () => {
        setSelectedCategories([]);
        clearFilters();
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
            <Header />
            <div className="flex flex-1">
                {/* Left Sidebar */}
                <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6">
                    <h2 className="text-xl font-bold mb-6 text-blue-300">Categories</h2>

                    {/* Category Multi-Select */}
                    <div className="mb-6">
                        <CategoryMultiSelect
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onSelectionChange={setSelectedCategories}
                            placeholder="Filter by categories..."
                        />
                        {selectedCategories.length > 0 && (
                            <button
                                onClick={handleClearFilters}
                                className="mt-2 w-full px-3 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 text-sm"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>

                    {/* Sort Options */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-300">Sort By</h3>
                        <select
                            value={filters[0]}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                        >
                            {filters.map((filter) => (
                                <option key={filter} value={filter} className="bg-gray-800">
                                    {filter}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-300">Search</h3>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={currentFilters.search || ""}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                        />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <ProductsView
                        products={products}
                        loading={productsLoading}
                        error={productsError}
                        search={currentFilters.search || ""}
                        onSearch={handleSearch}
                        selectedCategory={""} // Not used anymore
                        onCategoryChange={() => { }} // Not used anymore
                        selectedFilter={filters[0]}
                        onFilterChange={handleSortChange}
                        categories={[]} // Not used anymore
                        filters={filters}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onClearFilters={handleClearFilters}
                    />
                </main>
            </div>
            <Footer />
        </div>
    );
}
