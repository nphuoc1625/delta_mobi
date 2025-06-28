import { useState, useMemo } from "react";

interface Category {
    _id: string;
    name: string;
}

export default function CategorySelectPopup({
    open,
    onClose,
    categories,
    onSelect,
}: {
    open: boolean;
    onClose: () => void;
    categories: Category[];
    onSelect: (ids: string[]) => void;
}) {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string[]>([]);

    const filtered = useMemo(
        () =>
            categories.filter((cat) =>
                cat.name.toLowerCase().includes(search.toLowerCase())
            ),
        [categories, search]
    );

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold">Select Categories</h4>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full mb-3 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                />
                <div className="max-h-60 overflow-y-auto mb-4">
                    {filtered.length === 0 ? (
                        <div className="text-gray-500 text-center py-4">No categories found.</div>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {filtered.map(cat => (
                                <li key={cat._id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(cat._id)}
                                        onChange={e => {
                                            setSelected(sel =>
                                                e.target.checked
                                                    ? [...sel, cat._id]
                                                    : sel.filter(id => id !== cat._id)
                                            );
                                        }}
                                    />
                                    <span>{cat.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                        onClick={() => onSelect(selected)}
                        disabled={selected.length === 0}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
} 