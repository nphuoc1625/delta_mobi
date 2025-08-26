import { HiSearch, HiX } from "react-icons/hi";
import { useTheme } from "@/core/theme/ThemeContext";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search...", className = "" }: SearchBarProps) {
    const { colors } = useTheme();
    return (
        <div className={`relative w-full ${className}`}>
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                    borderRadius: '0.5rem',
                    background: colors.background,
                    color: colors.foreground,
                    border: `1px solid ${colors.border}`,
                    fontSize: '0.875rem',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                }}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
                    aria-label="Clear search"
                >
                    <HiX className="w-4 h-4" />
                </button>
            )}
        </div>
    );
} 