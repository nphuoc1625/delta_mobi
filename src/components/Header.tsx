"use client";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full px-8 py-6 flex items-center justify-between shadow-lg bg-gray-950/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3">
                    <Image src="/window.svg" alt="Delta Mobi Logo" width={36} height={36} className="dark:invert" />
                    <span className="text-2xl font-extrabold tracking-wide text-blue-400">Delta Mobi</span>
                </Link>
            </div>
            <nav className="flex gap-4">
                <a href="/products" className="px-4 py-2 rounded-lg font-medium hover:bg-gray-800/80 transition">Products</a>
                <a href="#about" className="px-4 py-2 rounded-lg font-medium hover:bg-gray-800/80 transition">About</a>
                <a href="#contact" className="px-4 py-2 rounded-lg font-medium hover:bg-gray-800/80 transition">Contact</a>
            </nav>
        </header>
    );
} 