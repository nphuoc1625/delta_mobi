import { useState, useEffect } from "react";
import { Product } from "@/data/product/repositories/productRepository";
import { Category, fetchCategories } from "@/data/product/repositories/categoryRepository";
import CategoryMultiSelect from "@/components/CategoryMultiSelect";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (product: Omit<Product, '_id'> & { _id?: string }) => Promise<void>;
    initialProduct?: Product | null;
}

export default function ProductFormPopup({ open, onClose, onSubmit, initialProduct }: Props) {
    const [form, setForm] = useState<Omit<Product, '_id'> & { _id?: string }>({ name: "", category: "", price: 0, image: "" });
    const [errors, setErrors] = useState<{ [k: string]: string }>({});
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryLoading, setCategoryLoading] = useState(false);

    useEffect(() => {
        if (initialProduct) {
            setForm({ ...initialProduct });
        } else {
            setForm({ name: "", category: "", price: 0, image: "" });
        }
        setErrors({});
    }, [initialProduct, open]);

    useEffect(() => {
        if (open) {
            loadCategories();
        }
    }, [open]);

    async function loadCategories() {
        setCategoryLoading(true);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch {
            setCategories([]);
        }
        setCategoryLoading(false);
    }

    function validate() {
        const errs: { [k: string]: string } = {};
        if (!form.name.trim()) errs.name = "Name is required";
        if (!form.category.trim()) errs.category = "Category is required";
        if (form.price <= 0) errs.price = "Price must be greater than 0";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        await onSubmit(form);
        setSubmitting(false);
    }

    const handleCategorySelection = (selectedIds: string[]) => {
        // For single category selection, take the first selected category
        setForm(prev => ({ ...prev, category: selectedIds[0] || "" }));
    };

    const selectedCategory = categories.find(c => c._id === form.category);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold">{initialProduct ? "Edit Product" : "Add Product"}</h4>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm mb-1">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                        />
                        {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Category</label>
                        {categoryLoading ? (
                            <div className="text-gray-400 text-sm">Loading categories...</div>
                        ) : (
                            <CategoryMultiSelect
                                categories={categories}
                                selectedCategories={form.category ? [form.category] : []}
                                onSelectionChange={handleCategorySelection}
                                placeholder="Select a category..."
                            />
                        )}
                        {errors.category && <div className="text-red-400 text-xs mt-1">{errors.category}</div>}
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Price</label>
                        <input
                            type="number"
                            value={form.price}
                            onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                            className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                            min={0}
                            step={0.01}
                        />
                        {errors.price && <div className="text-red-400 text-xs mt-1">{errors.price}</div>}
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Image URL</label>
                        <input
                            type="text"
                            value={form.image}
                            onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                            className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                        />
                        {errors.image && <div className="text-red-400 text-xs mt-1">{errors.image}</div>}
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                            disabled={submitting}
                        >
                            {submitting ? "Saving..." : initialProduct ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 