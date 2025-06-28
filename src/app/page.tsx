"use client";
import React from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useProducts } from "@/core/hooks/useProductOperations";
import { LoadingState } from "@/components/states/LoadingState";
import { ErrorDisplay } from "@/components/states/ErrorDisplay";
import Link from "next/link";

export default function Home() {
  const {
    products,
    productsLoading,
    productsError,
    fetchProducts
  } = useProducts({
    initialPagination: { page: 1, limit: 3 } // Show only 3 featured products
  });

  // Fetch products on component mount
  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 py-16 px-4 text-center bg-gradient-to-b from-gray-950/90 to-gray-900/80">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-blue-400 drop-shadow-lg">Premium Sound Devices</h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl">Experience the next level of audio with Delta Mobi. Explore our curated selection of headphones, speakers, and studio equipment designed for true sound lovers.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/products" className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-lg font-semibold shadow-lg transition">Browse Products</Link>
          <a href="#about" className="px-8 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-lg font-semibold shadow-lg transition">Learn More</a>
        </div>
      </section>

      {/* Featured Products */}
      <main id="products" className="w-full max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-10 text-center text-blue-300">Featured Products</h2>

        <LoadingState
          loading={productsLoading}
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-900 rounded-2xl p-8 flex flex-col items-center shadow-xl border border-gray-800 animate-pulse">
                  <div className="w-18 h-18 bg-gray-700 rounded-lg mb-6"></div>
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
                  <div className="h-5 bg-gray-700 rounded w-1/2 mb-6"></div>
                  <div className="h-10 bg-gray-700 rounded w-32"></div>
                </div>
              ))}
            </div>
          }
        >
          {productsError ? (
            <ErrorDisplay
              error={productsError}
              onRetry={fetchProducts}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {products.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 text-lg py-12">
                  No products available at the moment.
                </div>
              ) : (
                products.map((product) => (
                  <div key={product._id} className="bg-gray-900 rounded-2xl p-8 flex flex-col items-center shadow-xl hover:scale-105 hover:shadow-blue-900 transition-transform border border-gray-800">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={72}
                      height={72}
                      className="mb-6"
                    />
                    <h3 className="text-xl font-bold mb-2 text-white">{product.name}</h3>
                    <p className="text-base text-gray-400 mb-4 text-center">{product.category}</p>
                    <span className="text-lg font-semibold text-blue-400">${product.price}</span>
                    <Link
                      href="/products"
                      className="mt-6 px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold transition shadow"
                    >
                      View Details
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}
        </LoadingState>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="px-8 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-lg font-semibold shadow-lg transition"
          >
            View All Products
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
