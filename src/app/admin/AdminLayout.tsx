"use client";
import React, { useState, ReactNode } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useTheme } from "@/core/theme/ThemeContext";
import { HiCube, HiCollection, HiUser, HiClipboardList, HiMenu, HiArrowLeft, HiX } from "react-icons/hi";

interface AdminLayoutProps {
    tabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    children: ReactNode;
}

const tabIcons: Record<string, ReactNode> = {
    Products: <HiCube className="w-5 h-5 mr-2" />,
    Categories: <HiCollection className="w-5 h-5 mr-2" />,
    Users: <HiUser className="w-5 h-5 mr-2" />,
    Orders: <HiClipboardList className="w-5 h-5 mr-2" />,
};

export default function AdminLayout({ tabs, activeTab, setActiveTab, children }: AdminLayoutProps) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { colors } = useTheme();

    function handleTabClick(tab: string) {
        setActiveTab(tab);
        setDrawerOpen(false);
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: colors.background, color: colors.foreground }}>
            {/* Custom admin header */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '4rem', padding: '0 1rem', borderBottom: `1px solid ${colors.border}`, background: colors.background, zIndex: 20 }}>
                <button
                    style={{ display: 'none', padding: '0.5rem', borderRadius: '0.5rem', background: colors.muted, marginRight: '0.5rem' }}
                    onClick={() => setDrawerOpen(true)}
                    aria-label="Open menu"
                >
                    <HiMenu className="w-7 h-7" style={{ color: colors.foreground }} />
                </button>
                <span style={{ color: colors.primary, fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.05em', marginRight: 'auto' }}>Admin</span>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: colors.primary, color: colors.foreground, fontWeight: 600, fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                    <HiArrowLeft className="w-5 h-5" />
                    Back to Main
                </Link>
            </div>
            <div style={{ display: 'flex', flex: 1, width: '100%', maxWidth: '80rem', margin: '0 auto', padding: '3rem 0.5rem', gap: '2rem' }}>
                {/* Sidebar for desktop, Drawer for mobile */}
                {drawerOpen && (
                    <div
                        style={{ position: 'fixed', inset: 0, background: '#00000066', zIndex: 40 }}
                        onClick={() => setDrawerOpen(false)}
                    />
                )}
                <aside
                    style={{
                        position: 'static',
                        height: '100%',
                        width: '16rem',
                        background: colors.background,
                        zIndex: 50,
                        borderRight: `1px solid ${colors.border}`,
                        paddingRight: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 'calc(100vh - 4rem)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem 1.5rem 0 1.5rem' }}>
                        <span style={{ color: colors.primary, fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.05em', marginBottom: '2rem' }}>Admin</span>
                        <button
                            style={{ padding: '0.5rem', borderRadius: '0.5rem', background: colors.muted, display: 'none' }}
                            onClick={() => setDrawerOpen(false)}
                            aria-label="Close menu"
                        >
                            <HiX className="w-7 h-7" style={{ color: colors.foreground }} />
                        </button>
                    </div>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1.5rem' }}>
                        {tabs.map((tab: string) => (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab)}
                                style={{
                                    display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', borderRadius: '0.75rem', fontWeight: 500, fontSize: '1rem', gap: '0.5rem', width: '100%', textAlign: 'left', background: activeTab === tab ? colors.primary : colors.background, color: activeTab === tab ? colors.foreground : colors.secondary, border: 'none', boxShadow: activeTab === tab ? `0 2px 8px ${colors.primary}44` : 'none', transition: 'background 0.2s, color 0.2s', cursor: 'pointer',
                                }}
                            >
                                {tabIcons[tab]}
                                <span>{tab}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                {/* Main Content */}
                <main style={{ flex: 1, minHeight: '60vh', display: 'flex', flexDirection: 'column', gap: '2rem', marginLeft: 0, paddingLeft: 0 }}>{children}</main>
            </div>
            <Footer />
        </div>
    );
} 