import Footer from "../../components/Footer";
import { ReactNode, useState } from "react";
import { HiCube, HiCollection, HiUser, HiClipboardList, HiMenu, HiX, HiArrowLeft } from "react-icons/hi";
import Link from "next/link";

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

    function handleTabClick(tab: string) {
        setActiveTab(tab);
        setDrawerOpen(false);
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
            {/* Custom admin header */}
            <div className="relative flex items-center h-16 px-4 border-b border-gray-800 bg-gray-950 z-20">
                <button
                    className="md:hidden p-2 rounded bg-gray-800 hover:bg-blue-700 focus:outline-none mr-2"
                    onClick={() => setDrawerOpen(true)}
                    aria-label="Open menu"
                >
                    <HiMenu className="w-7 h-7 text-white" />
                </button>
                <span className="text-xl font-bold text-blue-300 tracking-wide mr-auto">Admin</span>
                <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm ml-2">
                    <HiArrowLeft className="w-5 h-5" />
                    Back to Main
                </Link>
            </div>
            <div className="flex flex-1 w-full max-w-7xl mx-auto py-12 px-2 sm:px-4 gap-8">
                {/* Sidebar for desktop, Drawer for mobile */}
                {drawerOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
                        onClick={() => setDrawerOpen(false)}
                    />
                )}
                <aside
                    className={`fixed top-0 left-0 h-full w-64 bg-gray-950 z-50 transform transition-transform duration-200 md:static md:translate-x-0 md:h-auto md:w-64 md:bg-transparent
                        ${drawerOpen ? "translate-x-0" : "-translate-x-full"} md:pr-6 border-r border-gray-800`}
                >
                    <div className="flex items-center justify-between md:block px-6 pt-8 md:pt-0 md:px-0">
                        <span className="text-xl font-bold mb-8 text-blue-300 tracking-wide md:mb-8">Admin</span>
                        <button
                            className="md:hidden p-2 rounded bg-gray-800 hover:bg-blue-700 focus:outline-none"
                            onClick={() => setDrawerOpen(false)}
                            aria-label="Close menu"
                        >
                            <HiX className="w-7 h-7 text-white" />
                        </button>
                    </div>
                    <nav className="flex flex-col gap-2 px-6 md:px-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab)}
                                className={`flex items-center px-5 py-3 rounded-lg font-medium transition-all text-base gap-2 w-full text-left
                                    ${activeTab === tab
                                        ? "bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg border-l-4 border-blue-400"
                                        : "bg-gray-800 text-gray-300 hover:bg-blue-900 hover:text-white"}
                                `}
                            >
                                {tabIcons[tab]}
                                <span>{tab}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                {/* Main Content */}
                <main className="flex-1 min-h-[60vh] flex flex-col gap-8 md:ml-0 ml-0 md:pl-0 pl-0">{children}</main>
            </div>
            <Footer />
        </div>
    );
} 