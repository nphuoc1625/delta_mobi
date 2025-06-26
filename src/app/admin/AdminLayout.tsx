import Header from "../../components/Header";
import Footer from "../../components/Footer";

interface AdminLayoutProps {
    tabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    children: React.ReactNode;
}

export default function AdminLayout({ tabs, activeTab, setActiveTab, children }: AdminLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
            <Header />
            <div className="flex flex-1 w-full max-w-7xl mx-auto py-12 px-4 gap-8">
                {/* Sidebar */}
                <aside className="w-56 flex-shrink-0 border-r border-gray-800 pr-6">
                    <h2 className="text-xl font-bold mb-6 text-blue-300">Admin</h2>
                    <nav className="flex flex-col gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-left px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-800 text-gray-300 hover:bg-blue-900 hover:text-white"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </aside>
                {/* Main Content */}
                <main className="flex-1 min-h-[60vh]">{children}</main>
            </div>
            <Footer />
        </div>
    );
} 