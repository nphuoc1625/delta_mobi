"use client";
import Image from "next/image";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getProducts, Product } from "../../data/products";

const categories = ["All", "Headphones", "Speakers", "Microphones"];
const filters = ["Price: Low to High", "Price: High to Low", "Newest"];

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedFilter, setSelectedFilter] = useState(filters[0]);

    const products: Product[] = getProducts();

    // Filtered and searched products
    let filteredProducts = products.filter(
        (p) =>
            (selectedCategory === "All" || p.category === selectedCategory) &&
            p.name.toLowerCase().includes(search.toLowerCase())
    );
    if (selectedFilter === "Price: Low to High") {
        filteredProducts = filteredProducts.slice().sort((a, b) => a.price - b.price);
    } else if (selectedFilter === "Price: High to Low") {
        filteredProducts = filteredProducts.slice().sort((a, b) => b.price - a.price);
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
            <Header />

            {/* Body */}
            <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-8 py-12 px-4">
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-1/2 px-5 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
                    />
                    {/* Filter Dropdown */}
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className="px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
                    >
                        {filters.map((filter) => (
                            <option key={filter} value={filter} className="bg-gray-800">
                                {filter}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category Section */}
                <div className="flex gap-3 flex-wrap mb-6">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2 rounded-full font-medium transition border-2 ${selectedCategory === cat
                                ? "bg-blue-600 border-blue-400 text-white"
                                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-blue-900 hover:border-blue-400"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center text-gray-400 text-lg py-12">No products found.</div>
                    ) : (
                        filteredProducts.map((product) => (
                            <div
                                key={product.id}
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
            </main>

            <Footer />
        </div>
    );
}
