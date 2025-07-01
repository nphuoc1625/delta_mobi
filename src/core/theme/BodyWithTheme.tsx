"use client";
import { useTheme } from "@/core/theme/ThemeContext";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function BodyWithTheme({ children }: { children: React.ReactNode }) {
    const { theme, colors } = useTheme();
    return (
        <body
            className={`${theme} ${geistSans.variable} ${geistMono.variable} antialiased`}
            style={{
                background: colors.background,
                color: colors.foreground,
            }}
        >
            {children}
        </body>
    );
} 