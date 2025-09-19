import { useTheme } from "@/core/theme/ThemeContext";

export default function ProductsView() {
    const { colors } = useTheme();
    return (
        <section>
            <h2 style={{ color: colors.primary, fontWeight: 600, fontSize: '1.5rem', marginBottom: '1rem' }}>Manage Products</h2>
            <div style={{ background: colors.background, color: colors.foreground, borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${colors.border}`, marginBottom: '2rem' }}>
                {/* Placeholder for group category management */}
                <h3 style={{ color: colors.primary, fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Group Categories</h3>
                <p style={{ color: colors.secondary }}>Group category and category management features coming soon...</p>
            </div>
            <div style={{ background: colors.background, color: colors.foreground, borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${colors.border}` }}>
                {/* Placeholder for product management UI */}
                <p style={{ color: colors.secondary }}>Product management features coming soon...</p>
            </div>
        </section>
    );
} 