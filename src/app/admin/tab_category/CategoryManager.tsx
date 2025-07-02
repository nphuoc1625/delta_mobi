"use client";
import { useEffect, useState } from "react";
import { HiTrash } from "react-icons/hi";
import Loading from "./Loading";
import { Category, fetchAllCategories, createCategory, updateCategory, deleteCategory } from "@/data/category/repository/categoryRepository";
import { useRepositoryOperation, useCreateOperation, useUpdateOperation, useDeleteOperation } from "@/core/hooks/useRepositoryOperation";
import { ErrorDisplay } from "@/components/states/ErrorDisplay";
import { LoadingState } from "@/components/states/LoadingState";
import SearchBar from "@/components/inputs/SearchBar";
import { useTheme } from "@/core/theme/ThemeContext";

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
    const { colors } = useTheme();
    if (isEditing) {
        return (
            <li style={{ background: colors.muted, borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', width: '100%' }}>
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                    <input
                        type="text"
                        value={editCategoryName}
                        onChange={e => setEditCategoryName(e.target.value)}
                        style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: colors.background, color: colors.foreground, border: `1px solid ${colors.border}`, width: '100%' }}
                        autoFocus
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                        <button type="submit" style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '0.5rem', background: colors.primary, color: colors.foreground, fontWeight: 600, border: 'none' }}>Update</button>
                        <button type="button" style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '0.5rem', background: colors.muted, color: colors.foreground, fontWeight: 600, border: 'none' }} onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </li>
        );
    }
    return (
        <li
            style={{ background: colors.muted, borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'pointer', border: `1.5px solid ${colors.border}` }}
            onClick={onEdit}
        >
            <span style={{ fontWeight: 500, fontSize: '1rem', color: colors.primary, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</span>
            <button
                style={{ marginLeft: '0.5rem', padding: '0.25rem', borderRadius: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); onDelete(); }}
                aria-label="Delete category"
            >
                <HiTrash className="w-5 h-5" style={{ color: '#f87171' }} />
            </button>
        </li>
    );
}

export default function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
    const [editCategoryName, setEditCategoryName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Repository operations using custom hooks
    const { loading, error, data, execute: loadCategories } = useRepositoryOperation(fetchAllCategories);
    const { loading: creating, error: createError, execute: executeCreate } = useCreateOperation(createCategory);
    const { loading: updating, error: updateError, execute: executeUpdate } = useUpdateOperation(updateCategory);
    const { loading: deleting, error: deleteError, execute: executeDelete } = useDeleteOperation(deleteCategory);

    // Load categories on mount only
    useEffect(() => {
        loadCategories();
    }, [loadCategories]); // Add loadCategories as dependency

    // Update local state when data changes
    useEffect(() => {
        if (data) {
            setCategories(data);
        }
    }, [data]);

    const { colors } = useTheme();

    async function handleAddCategory(e: React.FormEvent) {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            await executeCreate(newCategoryName);
            setNewCategoryName("");
            // Reload categories to get the updated list
            loadCategories();
        } catch (err: unknown) {
            console.error('Failed to create category:', err);
        }
    }

    function startEditCategory(cat: Category) {
        setEditCategoryId(cat._id);
        setEditCategoryName(cat.name);
    }

    async function handleEditCategory(e: React.FormEvent) {
        e.preventDefault();
        if (!editCategoryId || !editCategoryName.trim()) return;

        try {
            await executeUpdate(editCategoryId, editCategoryName);
            setEditCategoryId(null);
            setEditCategoryName("");
            // Reload categories to get the updated list
            loadCategories();
        } catch (err: unknown) {
            console.error('Failed to update category:', err);
        }
    }

    async function handleDeleteCategory(id: string) {
        if (!confirm("Delete this category?")) return;

        try {
            await executeDelete(id);
            // Reload categories to get the updated list
            loadCategories();
        } catch (err: unknown) {
            console.error('Failed to delete category:', err);
        }
    }

    // Filter categories based on search term
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Combine all errors
    const combinedError = error || createError || updateError || deleteError;
    const isLoading = loading || creating || updating || deleting;

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
                    disabled={creating}
                />
                <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 font-semibold text-sm flex-shrink-0 disabled:opacity-50"
                    style={{ minWidth: "64px" }}
                    disabled={creating || !newCategoryName.trim()}
                >
                    {creating ? 'Adding...' : 'Add'}
                </button>
            </form>

            {/* Error Display */}
            <ErrorDisplay
                error={combinedError}
                onRetry={loadCategories}
                className="mb-4"
            />

            {/* Loading and Content States */}
            <LoadingState loading={loading} fallback={<Loading />}>
                {filteredCategories.length === 0 ? (
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
            </LoadingState>

            {/* Loading indicator for operations */}
            {isLoading && !loading && (
                <div className="mt-4 text-center text-gray-400">
                    {creating && "Adding category..."}
                    {updating && "Updating category..."}
                    {deleting && "Deleting category..."}
                </div>
            )}
        </div>
    );
} 