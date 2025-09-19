import { useTheme } from "@/core/theme/ThemeContext";

export default function OrdersView() {
    const { colors } = useTheme();
    return (
        <section>
            <h2 style={{ color: colors.primary, fontWeight: 600, fontSize: '1.5rem', marginBottom: '1rem' }}>Manage Orders</h2>
            <div style={{ background: colors.background, color: colors.foreground, borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${colors.border}` }}>
                <p style={{ color: colors.secondary }}>Order management features coming soon...</p>
            </div>
        </section>
    );
} 