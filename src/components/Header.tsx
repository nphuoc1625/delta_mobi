"use client";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/core/theme/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function Header() {
    const { theme, colors, toggleTheme } = useTheme();
    const isLight = theme === 'light';
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
                    <span style={{ color: colors.primary }} className="text-2xl font-extrabold tracking-wide">
                        Delta Mobi
                    </span>
                </Link>
            </div>
            <nav className="flex gap-4">
                <Link href="/products" style={{ color: colors.foreground }} className="px-4 py-2 rounded-lg font-medium hover:opacity-80 transition">Products</Link>
                <a href="#about" style={{ color: colors.foreground }} className="px-4 py-2 rounded-lg font-medium hover:opacity-80 transition">About</a>
                <a href="#contact" style={{ color: colors.foreground }} className="px-4 py-2 rounded-lg font-medium hover:opacity-80 transition">Contact</a>
            </nav>
            <button
                onClick={toggleTheme}
                aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
                style={{
                    background: isLight ? '#2563eb' : '#facc15',
                    color: '#fff',
                    padding: '0.25rem',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    marginLeft: '1rem',
                    border: 'none',
                    transition: 'background 0.2s',
                }}
            >
                {isLight ? (
                    <FiMoon color="#fff" size={18} />
                ) : (
                    <FiSun color="#fff" size={18} />
                )}
            </button>
        </header>
    );
} 