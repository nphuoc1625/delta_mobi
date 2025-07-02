import { useState, useEffect } from "react";
import { Product } from "@/data/product/repositories/productRepository";
import { Category, fetchAllCategories } from "@/data/category/repository/categoryRepository";
import CategoryMultiSelect from "@/components/CategoryMultiSelect";
import { useTheme } from "@/core/theme/ThemeContext";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (product: Omit<Product, '_id'> & { _id?: string }) => Promise<void>;
    initialProduct?: Product | null;
}

export default function ProductFormPopup({ open, onClose, onSubmit, initialProduct }: Props) {
    const { colors } = useTheme();
    const [form, setForm] = useState<Omit<Product, '_id'> & { _id?: string }>({ name: "", category: "", price: 0, image: "", createdAt: "", updatedAt: "" });
    const [errors, setErrors] = useState<{ [k: string]: string }>({});
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryLoading, setCategoryLoading] = useState(false);

    useEffect(() => {
        if (initialProduct) {
            setForm({ ...initialProduct });
        } else {
            setForm({ name: "", category: "", price: 0, image: "", createdAt: "", updatedAt: "" });
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
            const data = await fetchAllCategories();
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
        setForm(prev => ({ ...prev, category: selectedIds[0] || "" }));
    };

    if (!open) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: colors.background, color: colors.foreground, borderRadius: '1rem', boxShadow: '0 4px 32px rgba(0,0,0,0.18)', border: `1.5px solid ${colors.border}`, padding: '2rem', width: '100%', maxWidth: '28rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{initialProduct ? "Edit Product" : "Add Product"}</h4>
                    <button onClick={onClose} style={{ color: colors.secondary, background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: colors.muted, color: colors.foreground, border: `1px solid ${colors.border}` }}
                        />
                        {errors.name && <div style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.name}</div>}
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Category</label>
                        {categoryLoading ? (
                            <div style={{ color: colors.secondary, fontSize: '0.95rem' }}>Loading categories...</div>
                        ) : (
                            <CategoryMultiSelect
                                categories={categories}
                                selectedCategories={form.category ? [form.category] : []}
                                onSelectionChange={handleCategorySelection}
                                placeholder="Select a category..."
                            />
                        )}
                        {errors.category && <div style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.category}</div>}
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Price</label>
                        <input
                            type="number"
                            value={form.price}
                            onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                            style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: colors.muted, color: colors.foreground, border: `1px solid ${colors.border}` }}
                            min={0}
                            step={0.01}
                        />
                        {errors.price && <div style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.price}</div>}
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Image URL</label>
                        <input
                            type="text"
                            value={form.image}
                            onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                            style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: colors.muted, color: colors.foreground, border: `1px solid ${colors.border}` }}
                        />
                        {errors.image && <div style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.image}</div>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button
                            type="button"
                            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: colors.muted, color: colors.foreground, border: 'none', fontWeight: 500, cursor: 'pointer' }}
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: colors.primary, color: colors.foreground, border: 'none', fontWeight: 600, cursor: 'pointer' }}
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