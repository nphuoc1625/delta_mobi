"use client";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductsView from "./ProductsView";

// Define the Product type for type safety
interface Product {
    _id?: string;
    id?: number;
    name: string;
    category: string;
    price: number;
    image: string;
}

const categories = ["All", "Headphones", "Speakers", "Microphones"];
const filters = ["Price: Low to High", "Price: High to Low", "Newest"];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedFilter, setSelectedFilter] = useState(filters[0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
            setLoading(false);
        }
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
            <Header />
            <ProductsView
                products={products}
                loading={loading}
                search={search}
                setSearch={setSearch}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                categories={categories}
                filters={filters}
            />
            <Footer />
        </div>
    );
}
