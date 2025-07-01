"use client";
import { useTheme } from "@/core/theme/ThemeContext";

export default function Footer() {
    const { theme, colors } = useTheme();
    return (
        <footer
            style={{
                width: '100%',
                textAlign: 'center',
                padding: '2rem 0',
                borderTop: `1px solid ${colors.foreground}22`,
                color: colors.foreground,
                background: colors.background,
                marginTop: 'auto',
                fontSize: '1rem',
                opacity: 0.8,
            }}
        >
            © {new Date().getFullYear()} Delta Mobi. All rights reserved.
        </footer>
    );
} 