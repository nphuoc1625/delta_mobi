import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n/config';

const languageNames: Record<string, string> = {
    en: 'English',
    vi: 'Tiếng Việt',
    fr: 'Français',
    es: 'Español'
};

const languageFlags: Record<string, string> = {
    en: '🇺🇸',
    vi: '🇻🇳',
    fr: '🇫🇷',
    es: '🇪🇸'
};

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('common');

    const handleLanguageChange = (newLocale: string) => {
        // Remove current locale from pathname
        const pathWithoutLocale = pathname.replace(`/${locale}`, '');

        // Construct new path with new locale
        const newPath = `/${newLocale}${pathWithoutLocale}`;

        // Navigate to new path
        router.push(newPath);
    };

    return (
        <div className="relative inline-block text-left">
            <select
                value={locale}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label={t('changeLanguage')}
            >
                {locales.map((lang) => (
                    <option key={lang} value={lang}>
                        {languageFlags[lang]} {languageNames[lang]}
                    </option>
                ))}
            </select>

            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}
