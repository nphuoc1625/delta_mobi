import { Category } from "@/data/category/repository/categoryRepository";
import SearchBar from "./inputs/SearchBar";

interface ProductFiltersProps {
    categories: Category[];
    searchTerm: string;
    selectedCategory: string;
    onSearchChange: (search: string) => void;
    onCategoryChange: (category: string) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

export default function ProductFilters({
    categories,
    searchTerm,
    selectedCategory,
    onSearchChange,
    onCategoryChange,
    onClearFilters,
    hasActiveFilters
}: ProductFiltersProps) {
    return (
        <div className=" rounded-lg    ">
            <div className="flex items-center justify-between mb-4">
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-gray-400 hover:text-white underline"
                    >
                        Clear all filters
                    </button>
                )}
            </div>
            <div className="space-y-4">
                {/* Search Bar */}
                <div>
                    <SearchBar
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder="Search products by name or category..."
                    />
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2">Category</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-gray-900 text-white text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
} 