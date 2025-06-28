"use client";
import { useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductsView from "./ProductsView";
import { useProducts } from "@/core/hooks/useProductOperations";
import { type Product } from "@/data/product/repositories/productRepository";

const categories = ["All", "Headphones", "Speakers", "Microphones"];
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

    // Handle search
    const handleSearch = (searchTerm: string) => {
        updateFilters({ search: searchTerm });
    };

    // Handle category filter
    const handleCategoryChange = (category: string) => {
        if (category === "All") {
            updateFilters({ category: undefined });
        } else {
            updateFilters({ category });
        }
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

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
            <Header />
            <ProductsView
                products={products}
                loading={productsLoading}
                error={productsError}
                search={currentFilters.search || ""}
                onSearch={handleSearch}
                selectedCategory={currentFilters.category || "All"}
                onCategoryChange={handleCategoryChange}
                selectedFilter={filters[0]}
                onFilterChange={handleSortChange}
                categories={categories}
                filters={filters}
                pagination={pagination}
                onPageChange={handlePageChange}
                onClearFilters={clearFilters}
            />
            <Footer />
        </div>
    );
}
