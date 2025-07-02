"use client";
import React from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useProducts } from "@/core/hooks/useProductOperations";
import { LoadingState } from "@/components/states/LoadingState";
import { ErrorDisplay } from "@/components/states/ErrorDisplay";
import Link from "next/link";
import { useTheme } from "@/core/theme/ThemeContext";

export default function Home() {
  const {
    products,
    productsLoading,
    productsError,
    fetchProducts
  } = useProducts({
    initialPagination: { page: 1, limit: 3 } // Show only 3 featured products
  });
  const { colors } = useTheme();

  // Fetch products on component mount
  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: colors.background, color: colors.foreground }}>
      <Header />

      {/* Hero Section */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '4rem 1rem', textAlign: 'center', background: colors.background, color: colors.foreground
      }}>
        <h1 style={{ color: colors.primary }} className="text-5xl sm:text-6xl font-extrabold mb-6 drop-shadow-lg">Premium Sound Devices</h1>
        <p style={{ color: colors.secondary }} className="text-xl sm:text-2xl mb-8 max-w-2xl">Experience the next level of audio with Delta Mobi. Explore our curated selection of headphones, speakers, and studio equipment designed for true sound lovers.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/products" style={{ background: colors.primary, color: colors.foreground, borderRadius: '9999px', fontWeight: 600, fontSize: '1.125rem', padding: '0.75rem 2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>Browse Products</Link>
          <a href="#about" style={{ background: colors.secondary, color: colors.foreground, borderRadius: '9999px', fontWeight: 600, fontSize: '1.125rem', padding: '0.75rem 2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>Learn More</a>
        </div>
      </section>

      {/* Featured Products */}
      <main id="products" style={{ width: '100%', maxWidth: '72rem', margin: '0 auto', padding: '4rem 1rem' }}>
        <h2 style={{ color: colors.primary }} className="text-3xl font-bold mb-10 text-center">Featured Products</h2>

        <LoadingState
          loading={productsLoading}
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ background: colors.background, color: colors.foreground, borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${colors.border}` }}>
                  <div style={{ width: '4.5rem', height: '4.5rem', background: colors.muted, borderRadius: '0.5rem', marginBottom: '1.5rem' }}></div>
                  <div style={{ height: '1.5rem', background: colors.muted, borderRadius: '0.5rem', width: '75%', marginBottom: '0.5rem' }}></div>
                  <div style={{ height: '1rem', background: colors.muted, borderRadius: '0.5rem', width: '100%', marginBottom: '1rem' }}></div>
                  <div style={{ height: '1.25rem', background: colors.muted, borderRadius: '0.5rem', width: '50%', marginBottom: '1.5rem' }}></div>
                  <div style={{ height: '2.5rem', background: colors.muted, borderRadius: '0.5rem', width: '8rem' }}></div>
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
                  <div key={product._id} style={{ background: colors.background, color: colors.foreground, borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${colors.border}`, hover: { scale: '105%', shadow: colors.primary } }}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={72}
                      height={72}
                      className="mb-6"
                    />
                    <h3 style={{ color: colors.primary }} className="text-xl font-bold mb-2">{product.name}</h3>
                    <p style={{ color: colors.secondary }} className="text-base text-gray-400 mb-4 text-center">{product.category}</p>
                    <span style={{ color: colors.primary, fontWeight: 600, fontSize: '1.125rem' }}>${product.price}</span>
                    <Link
                      href="/products"
                      style={{ background: colors.primary, color: colors.foreground, borderRadius: '9999px', fontWeight: 600, fontSize: '1.125rem', padding: '0.75rem 2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginTop: '1rem', transition: 'background 0.3s ease' }}
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
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link
            href="/products"
            style={{ background: colors.secondary, color: colors.foreground, borderRadius: '9999px', fontWeight: 600, fontSize: '1.125rem', padding: '0.75rem 2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            View All Products
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
