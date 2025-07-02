export interface Colors {
    primary: string;
    secondary: string;
    error: string;
    warning: string;
    info: string;
    success: string;
    background: string;
    foreground: string;
    border: string;
    muted: string;
}

export const light: Colors = {
    primary: '#facc15',      // yellow-400 for primary text
    secondary: '#64748b',    // slate-500
    error: '#ef4444',        // red-500
    warning: '#f59e42',      // orange-400
    info: '#0ea5e9',         // sky-500
    success: '#22c55e',      // green-500
    background: '#ffffff',   // white for background
    foreground: '#000000',   // black for container/text
    border: '#e5e7eb',       // gray-200
    muted: '#f3f4f6',        // gray-100
};

export const dark: Colors = {
    primary: '#facc15',      // yellow-400 for primary text
    secondary: '#f1f5f9',    // light slate-100 for secondary text
    error: '#f87171',        // red-400
    warning: '#fbbf24',      // yellow-400
    info: '#38bdf8',         // sky-400
    success: '#4ade80',      // green-400
    background: '#18181b',   // dark gray background
    foreground: '#f4f4f5',   // light gray/white for text
    border: '#27272a',       // dark border
    muted: '#27272a',        // dark muted
};