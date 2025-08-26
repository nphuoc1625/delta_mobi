"use client";
import React, { useState, ReactNode, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useTheme } from "@/core/theme/ThemeContext";
import { HiCube, HiCollection, HiUser, HiClipboardList, HiMenu, HiArrowLeft, HiX, HiPhotograph } from "react-icons/hi";

// Utility to detect mobile (improved with better breakpoint)
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 1024); // Changed from 768 to 1024 for better tablet support
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return isMobile;
}

interface AdminLayoutProps {
    tabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    children: ReactNode;
}

const tabIcons: Record<string, ReactNode> = {
    Products: <HiCube className="w-5 h-5 mr-2" />,
    Categories: <HiCollection className="w-5 h-5 mr-2" />,
    Images: <HiPhotograph className="w-5 h-5 mr-2" />,
    Users: <HiUser className="w-5 h-5 mr-2" />,
    Orders: <HiClipboardList className="w-5 h-5 mr-2" />,
};

// Desktop Sidebar Layout
function DesktopSidebarLayout({
    tabs,
    activeTab,
    setActiveTab,
    children,
    colors,
}: AdminLayoutProps & { colors: any }) {
    function handleTabClick(tab: string) {
        setActiveTab(tab);
    }
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: colors.background, color: colors.foreground }}>
            {/* Header */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '4rem', padding: '0 1rem', borderBottom: `1px solid ${colors.border}`, background: colors.background, zIndex: 20 }}>
                <span style={{ color: colors.primary, fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.05em', marginRight: 'auto' }}>Admin</span>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: colors.primary, color: colors.foreground, fontWeight: 600, fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                    <HiArrowLeft className="w-5 h-5" />
                    Back to Main
                </Link>
            </div>
            <div style={{ display: 'flex', flex: 1, width: '100%', maxWidth: '80rem', margin: '0 auto', padding: '3rem 0.5rem', gap: '2rem' }}>
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
                <main style={{ flex: 1, minHeight: '60vh', display: 'flex', flexDirection: 'column', gap: '2rem', marginLeft: 0, paddingLeft: 0 }}>{children}</main>
            </div>
            <Footer />
        </div>
    );
}

// Mobile Drawer Layout
function MobileDrawerLayout({
    tabs,
    activeTab,
    setActiveTab,
    children,
    colors,
}: AdminLayoutProps & { colors: any }) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    function handleTabClick(tab: string) {
        setActiveTab(tab);
        setDrawerOpen(false);
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: colors.background, color: colors.foreground, overflow: 'hidden' }}>
            {/* Header with menu button */}
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                height: '4rem',
                padding: '0 0.75rem',
                borderBottom: `1px solid ${colors.border}`,
                background: colors.background,
                zIndex: 20,
                flexShrink: 0
            }}>
                <button
                    style={{
                        display: 'inline-flex',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        background: colors.muted,
                        marginRight: '0.5rem',
                        flexShrink: 0
                    }}
                    onClick={() => setDrawerOpen(true)}
                    aria-label="Open menu"
                >
                    <HiMenu className="w-6 h-6" style={{ color: colors.foreground }} />
                </button>
                <span style={{
                    color: colors.primary,
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    letterSpacing: '0.05em',
                    marginRight: 'auto',
                    flexShrink: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    Admin
                </span>
                <Link href="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    background: colors.primary,
                    color: colors.foreground,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                }}>
                    <HiArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                </Link>
            </div>

            {/* Drawer */}
            {drawerOpen && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: '#00000066',
                            zIndex: 40
                        }}
                        onClick={() => setDrawerOpen(false)}
                    />
                    <aside
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: 'min(85vw, 20rem)',
                            background: colors.background,
                            zIndex: 50,
                            borderRight: `1px solid ${colors.border}`,
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100vh',
                            boxShadow: '2px 0 16px #0002',
                            transition: 'transform 0.2s',
                            overflow: 'hidden'
                        }}
                    >
                        {/* <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1.5rem 1rem 0 1rem',
                            borderBottom: `1px solid ${colors.border}`,
                            flexShrink: 0
                        }}>

                            <button
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    background: colors.muted,
                                    display: 'inline-flex'
                                }}
                                onClick={() => setDrawerOpen(false)}
                                aria-label="Close menu"
                            >
                                <HiX className="w-6 h-6" style={{ color: colors.foreground }} />
                            </button>
                        </div> */}
                        <nav style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            padding: '1rem',
                            flex: 1,
                            overflowY: 'auto'
                        }}>
                            {tabs.map((tab: string) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabClick(tab)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0.875rem 1rem',
                                        borderRadius: '0.75rem',
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                        gap: '0.5rem',
                                        width: '100%',
                                        textAlign: 'left',
                                        background: activeTab === tab ? colors.primary : colors.background,
                                        color: activeTab === tab ? colors.foreground : colors.secondary,
                                        border: 'none',
                                        boxShadow: activeTab === tab ? `0 2px 8px ${colors.primary}44` : 'none',
                                        transition: 'background 0.2s, color 0.2s',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {tabIcons[tab]}
                                    <span>{tab}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>
                </>
            )}

            {/* Main Content Area */}
            <div style={{
                flex: 1,
                width: '100%',
                margin: '0 auto',
                padding: '1rem 0.75rem',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <main style={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    overflow: 'hidden'
                }}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default function AdminLayout({ tabs, activeTab, setActiveTab, children }: AdminLayoutProps) {
    const { colors } = useTheme();
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <MobileDrawerLayout
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                children={children}
                colors={colors}
            />
        );
    } else {
        return (
            <DesktopSidebarLayout
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                children={children}
                colors={colors}
            />
        );
    }
}