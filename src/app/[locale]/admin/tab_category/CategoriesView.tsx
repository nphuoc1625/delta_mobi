"use client";

import GroupCategoryManager from "./GroupCategoryManager";
import CategoryManager from "./CategoryManager";
import { useTheme } from "@/core/theme/ThemeContext";

export default function CategoriesView() {
    const { colors } = useTheme();
    return (
        <section>
            <h2 style={{ color: colors.primary, fontWeight: 600, fontSize: '1.5rem', marginBottom: '1rem' }}>Manage Categories</h2>
            <div style={{ background: colors.background, color: colors.foreground, borderRadius: '1rem', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${colors.border}`, marginBottom: '2rem' }}>
                <GroupCategoryManager />
            </div>
            <div style={{ background: colors.background, color: colors.foreground, borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${colors.border}` }}>
                <CategoryManager />
            </div>
        </section>
    );
} 