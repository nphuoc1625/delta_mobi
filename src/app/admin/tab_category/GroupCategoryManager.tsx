"use client";
import { useEffect, useState } from "react";
import {
    fetchAllGroupCategories,
    createGroupCategory,
    updateGroupCategory,
    deleteGroupCategory,
    GroupCategory,
} from "@/data/group_category/repository/groupCategoryRepository";
import { Category, fetchAllCategories } from "@/data/category/repository/categoryRepository";
import { HiTrash } from "react-icons/hi";
import Loading from "./Loading";
import CategoryMultiSelect from "@/components/CategoryMultiSelect";

function GroupCategoryItem({
    group,
    isEditing,
    editGroupName,
    setEditGroupName,
    onEdit,
    onDelete,
    onSubmit,
    onCancel,
    allCategories,
    handleUpdateGroupCategories,
    saving,
}: {
    group: GroupCategory;
    isEditing: boolean;
    editGroupName: string;
    setEditGroupName: (v: string) => void;
    onEdit: () => void;
    onDelete: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    allCategories: Category[];
    handleUpdateGroupCategories: (group: GroupCategory, newCategories: string[]) => Promise<void>;
    saving: string | null;
}) {
    const handleCategorySelection = async (selectedIds: string[]) => {
        await handleUpdateGroupCategories(group, selectedIds);
    };

    if (isEditing) {
        return (
            <li className="bg-gray-800 rounded-lg p-4 shadow flex flex-row items-center gap-2 w-full">
                <form onSubmit={onSubmit} className="flex flex-row gap-2 w-full items-center">
                    <input
                        type="text"
                        value={editGroupName}
                        onChange={e => setEditGroupName(e.target.value)}
                        className="px-4 py-2 rounded bg-gray-900 text-white focus:outline-none w-full flex-[5]"
                        autoFocus
                    />
                    <button type="submit" className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 font-semibold text-sm flex-shrink-0" style={{ minWidth: '64px' }}>Update</button>
                    <button type="button" className="px-3 py-1.5 rounded bg-gray-700 font-semibold text-sm flex-shrink-0" style={{ minWidth: '64px' }} onClick={onCancel}>Cancel</button>
                </form>
            </li>
        );
    }
    return (
        <li className="bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2 w-full">
            <div className="flex flex-row items-center justify-between w-full cursor-pointer hover:ring-2 hover:ring-blue-400 transition" onClick={onEdit}>
                <span className="font-medium text-base text-blue-200 truncate w-full">{group.name}</span>
                <button
                    className="ml-2 p-1 rounded hover:bg-red-700 transition"
                    onClick={e => { e.stopPropagation(); onDelete(); }}
                    aria-label="Delete group category"
                >
                    <HiTrash className="w-5 h-5 text-red-400" />
                </button>
            </div>
            <div>
                <div className="font-medium mb-2 text-sm text-gray-400">
                    Assign Categories:
                </div>
                <CategoryMultiSelect
                    categories={allCategories}
                    selectedCategories={group.categories || []}
                    onSelectionChange={handleCategorySelection}
                    placeholder="Select categories to assign..."
                />
                {saving === group._id && <span className="text-xs text-blue-400 mt-2 block">Saving...</span>}
            </div>
        </li>
    );
}

export default function GroupCategoryManager() {
    const [groupCategories, setGroupCategories] = useState<GroupCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newGroupName, setNewGroupName] = useState("");
    const [editGroupId, setEditGroupId] = useState<string | null>(null);
    const [editGroupName, setEditGroupName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<string | null>(null); // group id being saved

    async function loadGroupsAndCategories() {
        setLoading(true);
        setError(null);
        try {
            const [groups, cats] = await Promise.all([
                fetchAllGroupCategories(),
                fetchAllCategories(),
            ]);
            setGroupCategories(groups);
            setCategories(cats);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load groups and categories';
            setError(errorMessage);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadGroupsAndCategories();
    }, []);

    async function handleAddGroupCategory(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        try {
            const group = await createGroupCategory(newGroupName);
            setGroupCategories((prev) => [...prev, group]);
            setNewGroupName("");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create group category';
            setError(errorMessage);
        }
    }

    function startEditGroup(group: GroupCategory) {
        setEditGroupId(group._id);
        setEditGroupName(group.name);
    }
    async function handleEditGroupCategory(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        try {
            if (!editGroupId) return;
            const updated = await updateGroupCategory(editGroupId, editGroupName);
            setGroupCategories((prev) => prev.map((g) => (g._id === updated._id ? updated : g)));
            setEditGroupId(null);
            setEditGroupName("");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update group category';
            setError(errorMessage);
        }
    }
    async function handleDeleteGroupCategory(id: string) {
        if (!confirm("Delete this group category?")) return;
        setError(null);
        try {
            await deleteGroupCategory(id);
            setGroupCategories((prev) => prev.filter((g) => g._id !== id));
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete group category';
            setError(errorMessage);
        }
    }

    // Assign categories to group
    async function handleUpdateGroupCategories(group: GroupCategory, newCategories: string[]) {
        setSaving(group._id);
        setError(null);
        try {
            const updated = await updateGroupCategory(group._id, group.name, newCategories);
            setGroupCategories((prev) => prev.map((g) => (g._id === updated._id ? updated : g)));
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update group categories';
            setError(errorMessage);
        }
        setSaving(null);
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Group Categories</h3>
            <form
                onSubmit={handleAddGroupCategory}
                className={`flex flex-row gap-2 mb-4 w-full items-center${editGroupId ? ' hidden' : ''}`}
            >
                <input
                    type="text"
                    value={newGroupName}
                    onChange={e => setNewGroupName(e.target.value)}
                    placeholder="New group category name"
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
            ) : groupCategories.length === 0 ? (
                <div className="flex items-center justify-center min-h-[120px] text-gray-500 text-lg">No group categories found.</div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {groupCategories.map((group) => (
                        <GroupCategoryItem
                            key={group._id}
                            group={group}
                            isEditing={editGroupId === group._id}
                            editGroupName={editGroupName}
                            setEditGroupName={setEditGroupName}
                            onEdit={() => startEditGroup(group)}
                            onDelete={() => handleDeleteGroupCategory(group._id)}
                            onSubmit={handleEditGroupCategory}
                            onCancel={() => { setEditGroupId(null); setEditGroupName(""); }}
                            allCategories={categories}
                            handleUpdateGroupCategories={handleUpdateGroupCategories}
                            saving={saving}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
} 