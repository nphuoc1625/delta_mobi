"use client";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/core/theme/ThemeContext";

export default function Header() {
    const { theme, colors, toggleTheme } = useTheme();
    return (
        <header
            style={{
                background: colors.background,
                color: colors.foreground,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderBottom: `1px solid ${colors.foreground}22`, // subtle border
            }}
        >
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3">
                    <Image src="/window.svg" alt="Delta Mobi Logo" width={36} height={36} className="dark:invert" />
                    <span className="text-2xl font-extrabold tracking-wide text-blue-400">Delta Mobi</span>
                </Link>
            </div>
            <nav className="flex gap-4">
                <Link href="/products" className="px-4 py-2 rounded-lg font-medium hover:opacity-80 transition">Products</Link>
                <a href="#about" className="px-4 py-2 rounded-lg font-medium hover:opacity-80 transition">About</a>
                <a href="#contact" className="px-4 py-2 rounded-lg font-medium hover:opacity-80 transition">Contact</a>
            </nav>
            <button
                onClick={toggleTheme}
                style={{
                    background: 'none',
                    border: `1px solid ${colors.foreground}`,
                    color: colors.foreground,
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
        </header>
    );
} 