"use client";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductsView from "./ProductsView";
import { useProducts } from "@/core/hooks/useProductOperations";
import { fetchAllCategories, Category } from "@/data/category/repository/categoryRepository";
import CategoryMultiSelect from "@/components/CategoryMultiSelect";
import { useTheme } from "@/core/theme/ThemeContext";
import Image from "next/image";

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
    const { colors } = useTheme();

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
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: colors.background, color: colors.foreground }}>
            <Header />
            <main style={{ flex: 1, width: '100%', maxWidth: '72rem', margin: '0 auto', padding: '4rem 1rem', display: 'flex', gap: '2rem' }}>
                {/* Categories Side Panel */}
                <aside style={{ width: '16rem', background: colors.muted, color: colors.foreground, borderRadius: '1rem', padding: '2rem 1rem', border: `1px solid ${colors.border}`, height: 'fit-content' }}>
                    <h2 style={{ color: colors.primary, fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem' }}>Categories</h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {categories.map((cat) => (
                            <li key={cat.name} style={{ marginBottom: '1rem', color: colors.secondary }}>{cat.name}</li>
                        ))}
                    </ul>
                </aside>
                {/* Product Cards Grid */}
                <section style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    {products.map((product) => (
                        <div
                            key={product._id}
                            style={{
                                background: colors.background,
                                color: colors.foreground,
                                borderRadius: '1rem',
                                padding: '2rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                border: `1px solid ${colors.border}`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                height: '100%',
                            }}
                        >
                            <div style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={240}
                                    height={180}
                                    style={{ width: '100%', height: 'auto', maxHeight: '180px', objectFit: 'contain', borderRadius: '0.75rem', background: colors.muted }}
                                />
                            </div>
                            <h2 style={{ color: colors.primary, fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem', textAlign: 'left', width: '100%' }}>{product.name}</h2>
                            <p style={{ color: colors.secondary, marginBottom: '0.5rem', textAlign: 'left', width: '100%' }}>{product.category}</p>
                            <span style={{ color: colors.primary, fontWeight: 600, fontSize: '1.125rem', textAlign: 'left', width: '100%' }}>${product.price}</span>
                        </div>
                    ))}
                </section>
            </main>
            <Footer />
        </div>
    );
}
