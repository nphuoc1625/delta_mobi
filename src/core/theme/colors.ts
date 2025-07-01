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
    secondary: '#94a3b8',    // slate-400
    error: '#f87171',        // red-400
    warning: '#fbbf24',      // yellow-400
    info: '#38bdf8',         // sky-400
    success: '#4ade80',      // green-400
    background: '#ffffff',   // white for background (as requested)
    foreground: '#000000',   // black for container/text
    border: '#334155',       // slate-700
    muted: '#1e293b',        // slate-800
};