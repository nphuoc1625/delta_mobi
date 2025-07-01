"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { light, dark, Colors } from './colors';

export type Theme = 'light' | 'dark';

const themeColorsMap: Record<Theme, Colors> = {
    'light': light,
    'dark': dark
}

interface ThemeContextProps {
    theme: Theme;
    colors: Colors;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
    theme: 'light',
    colors: light,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light');
    const colors = themeColorsMap[theme];

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}; 