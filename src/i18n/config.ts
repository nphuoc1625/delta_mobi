import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'vi', 'fr', 'es'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export function getLocale(pathname: string): Locale {
    const segments = pathname.split('/');
    const locale = segments[1];

    if (locales.includes(locale as Locale)) {
        return locale as Locale;
    }

    return defaultLocale;
}

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!locale || !locales.includes(locale as Locale)) notFound();

    return {
        locale: locale as string,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
