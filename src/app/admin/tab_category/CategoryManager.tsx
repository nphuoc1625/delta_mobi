"use client";
import { useEffect, useState } from "react";
import { HiTrash } from "react-icons/hi";
import Loading from "./Loading";
import { Category, fetchCategories, createCategory, updateCategory, deleteCategory } from "@/data/category/repository/categoryRepository";
import SearchBar from "@/components/inputs/SearchBar";

function ItemView({
    cat,
    isEditing,
    editCategoryName,
    setEditCategoryName,
    onEdit,
    onDelete,
    onSubmit,
    onCancel,
}: {
    cat: Category;
    isEditing: boolean;
    editCategoryName: string;
    setEditCategoryName: (v: string) => void;
    onEdit: () => void;
    onDelete: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}) {
    if (isEditing) {
        return (
            <li className="bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2 w-full">
                <form onSubmit={onSubmit} className="flex flex-col gap-2 w-full">
                    <input
                        type="text"
                        value={editCategoryName}
                        onChange={e => setEditCategoryName(e.target.value)}
                        className="px-4 py-2 rounded bg-gray-900 text-white focus:outline-none w-full"
                        autoFocus
                    />
                    <div className="flex gap-2 w-full">
                        <button type="submit" className="flex-1 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold">Update</button>
                        <button type="button" className="px-4 py-2 rounded bg-gray-700 font-semibold" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </li>
        );
    }
    return (
        <li
            className="bg-gray-800 rounded-lg p-4 shadow flex items-center justify-between w-full cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
            onClick={onEdit}
        >
            <span className="font-medium text-base text-blue-200 truncate w-full">{cat.name}</span>
            <button
                className="ml-2 p-1 rounded hover:bg-red-700 transition"
                onClick={e => { e.stopPropagation(); onDelete(); }}
                aria-label="Delete category"
            >
                <HiTrash className="w-5 h-5 text-red-400" />
            </button>
        </li>
    );
}

export default function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
    const [editCategoryName, setEditCategoryName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    async function loadCategories() {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadCategories();
    }, []);

    async function handleAddCategory(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        try {
            const cat = await createCategory(newCategoryName);
            setCategories((prev) => [...prev, cat]);
            setNewCategoryName("");
        } catch (err: any) {
            setError(err.message);
        }
    }
    function startEditCategory(cat: Category) {
        setEditCategoryId(cat._id);
        setEditCategoryName(cat.name);
    }
    async function handleEditCategory(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        try {
            if (!editCategoryId) return;
            const updated = await updateCategory(editCategoryId, editCategoryName);
            setCategories((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
            setEditCategoryId(null);
            setEditCategoryName("");
        } catch (err: any) {
            setError(err.message);
        }
    }
    async function handleDeleteCategory(id: string) {
        if (!confirm("Delete this category?")) return;
        setError(null);
        try {
            await deleteCategory(id);
            setCategories((prev) => prev.filter((c) => c._id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    }

    // Filter categories based on search term
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Categories</h3>

            {/* Search Bar */}
            <div className="mb-4">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search categories..."
                />
            </div>

            <form
                onSubmit={handleAddCategory}
                className={`flex flex-row gap-2 mb-4 w-full items-center${editCategoryId ? ' hidden' : ''}`}
            >
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="px-4 py-2 rounded bg-gray-800 text-white focus:outline-none w-full flex-[5]"
                />
                <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 font-semibold text-sm flex-shrink-0"
                    style={{ minWidth: "64px" }}
                >
                    Add
                </button>
            </form>

            {error && <div className="text-red-400 mb-2">{error}</div>}

            {loading ? (
                <Loading />
            ) : filteredCategories.length === 0 ? (
                <div className="flex items-center justify-center min-h-[120px] text-gray-500 text-lg">
                    {searchTerm ? "No categories match your search." : "No categories found."}
                </div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {filteredCategories.map((cat) => (
                        <ItemView
                            key={cat._id}
                            cat={cat}
                            isEditing={editCategoryId === cat._id}
                            editCategoryName={editCategoryName}
                            setEditCategoryName={setEditCategoryName}
                            onEdit={() => startEditCategory(cat)}
                            onDelete={() => handleDeleteCategory(cat._id)}
                            onSubmit={handleEditCategory}
                            onCancel={() => { setEditCategoryId(null); setEditCategoryName(""); }}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
} 