import Image from "next/image";
import { useTheme } from "@/core/theme/ThemeContext";

export default function CustomImage({ src, alt, width, height, className }: { src: string, alt: string, width: number, height: number, className?: string }) {
    const { colors } = useTheme();
    return <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', overflow: 'hidden', background: colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {src ? (
            <Image
                src={src}
                alt={alt}
                width={48}
                height={48}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
            />
        ) : null}
        <svg
            className={`w-6 h-6 ${src ? 'hidden' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            style={{ color: colors.secondary }}
        >
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
    </div>
}