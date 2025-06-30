import { useState } from "react";
import { Category } from "@/data/category/repository/categoryRepository";
import { HiCheck, HiX } from "react-icons/hi";

interface CategoryMultiSelectProps {
    categories: Category[];
    selectedCategories: string[];
    onSelectionChange: (selectedIds: string[]) => void;
    placeholder?: string;
    maxHeight?: string;
}

export default function CategoryMultiSelect({
    categories,
    selectedCategories,
    onSelectionChange,
    placeholder = "Select categories...",
    maxHeight = "200px"
}: CategoryMultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedCategoryNames = categories
        .filter(cat => selectedCategories.includes(cat._id))
        .map(cat => cat.name);

    const toggleCategory = (categoryId: string) => {
        const newSelection = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];
        onSelectionChange(newSelection);
    };

    const removeCategory = (categoryId: string) => {
        onSelectionChange(selectedCategories.filter(id => id !== categoryId));
    };

    return (
        <div className="relative">
            {/* Selected Categories Display */}
            <div className="min-h-[40px] p-2 border border-gray-700 rounded-lg bg-gray-900 flex flex-wrap gap-1" onClick={() => setIsOpen(!isOpen)}>
                {selectedCategoryNames.length > 0 ? (
                    selectedCategoryNames.map((name, index) => {
                        const category = categories.find(cat => cat.name === name);
                        return (
                            <span
                                key={category?._id || index}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded"
                            >
                                {name}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeCategory(category!._id);
                                    }}
                                    className="hover:bg-blue-700 rounded"
                                >
                                    <HiX className="w-3 h-3" />
                                </button>
                            </span>
                        );
                    })
                ) : (
                    <span className="text-gray-400 text-sm">{placeholder}</span>
                )}
            </div>

            {/* Dropdown Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-700">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-2 py-1 text-sm bg-gray-900 text-white border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Category List */}
                    <div className={`max-h-[${maxHeight}] overflow-y-auto`}>
                        {filteredCategories.length === 0 ? (
                            <div className="p-2 text-sm text-gray-400">No categories found</div>
                        ) : (
                            filteredCategories.map((category) => (
                                <button
                                    key={category._id}
                                    onClick={() => toggleCategory(category._id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-700 text-sm"
                                >
                                    <div className="w-4 h-4 border border-gray-600 rounded flex items-center justify-center">
                                        {selectedCategories.includes(category._id) && (
                                            <HiCheck className="w-3 h-3 text-blue-500" />
                                        )}
                                    </div>
                                    {category.name}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Backdrop to close dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
} 