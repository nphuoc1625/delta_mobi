import { useState } from "react";
import { Category } from "@/data/category/repository/categoryRepository";
import { HiCheck, HiX } from "react-icons/hi";
import { useTheme } from "@/core/theme/ThemeContext";

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
    const { colors } = useTheme();
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
            {
                selectedCategoryNames.length > 0 ? (
                    <div
                        style={{ backgroundColor: colors.background, color: colors.foreground }}
                        className="min-h-[40px]  rounded-lg flex flex-wrap gap-1" >
                        {
                            selectedCategoryNames.map((name, index) => {
                                const category = categories.find(cat => cat.name === name);
                                return (
                                    <span
                                        key={category?._id || index}
                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-gray-400 bg-transparent text-black"
                                    >
                                        {name}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeCategory(category!._id);
                                            }}
                                            className="border border-red-500 rounded p-0.5 hover:bg-red-50 hover:border-red-600 flex items-center justify-center"
                                            style={{ backgroundColor: "transparent" }}
                                            type="button"
                                        >
                                            <HiX className="w-3 h-3 text-red-500" />
                                        </button>
                                    </span>
                                );
                            })
                        }
                    </div>
                ) : (<span />)
            }



            <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onFocus={() => setIsOpen(true)}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ backgroundColor: colors.background, color: colors.foreground, border: `1px solid ${colors.border}`, marginTop: "8px" }}
                className="w-full px-2 py-1 text-sm border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
            />



            {/* Dropdown Menu */}
            {isOpen && (
                <div style={{ backgroundColor: colors.background, color: colors.foreground, border: `1px solid ${colors.border}` }} className="absolute z-10 w-full mt-1 border border-gray-700 rounded-lg shadow-lg">
                    {/* Search Input */}

                    {/* Category List */}
                    <div className={`max-h-[${maxHeight}] overflow-y-auto`}>
                        {filteredCategories.length === 0 ? (
                            <div className="p-2 text-sm text-gray-400">No categories found</div>
                        ) : (
                            filteredCategories.map((category) => (
                                <button
                                    key={category._id}
                                    onClick={() => toggleCategory(category._id)}
                                    style={{ backgroundColor: colors.background, color: colors.foreground, border: `1px solid ${colors.border}` }}
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