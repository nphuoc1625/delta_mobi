# 🌍 Localization (i18n) System

## Overview
The localization system provides multi-language support for your application using Next.js 15 and `next-intl`. It supports English, Vietnamese, French, and Spanish with automatic locale detection and URL-based language switching.

## 🚀 **Features**

### **Supported Languages**
- 🇺🇸 **English (en)** - Default language
- 🇻🇳 **Vietnamese (vi)** - Tiếng Việt
- 🇫🇷 **French (fr)** - Français  
- 🇪🇸 **Spanish (es)** - Español

### **Key Capabilities**
- **🌐 URL-based Locales**: `/en/products`, `/vi/admin`, `/fr/demo`
- **🔄 Automatic Detection**: Detects user's preferred language
- **📱 Language Switcher**: Easy language switching in header
- **📝 Message Files**: JSON-based translation management
- **🎯 Type Safety**: Full TypeScript support
- **⚡ Performance**: Optimized with Next.js 15

## 🏗️ **Architecture**

### **File Structure**
```
src/
├── app/
│   ├── [locale]/           # Locale-based routing
│   │   ├── layout.tsx      # Locale layout wrapper
│   │   ├── page.tsx        # Home page
│   │   ├── products/       # Products pages
│   │   ├── admin/          # Admin pages
│   │   └── demo/           # Localization demo
│   ├── layout.tsx          # Root layout (redirects)
│   └── globals.css         # Global styles
├── i18n/
│   └── config.ts           # i18n configuration
├── messages/                # Translation files
│   ├── en.json             # English
│   ├── vi.json             # Vietnamese
│   ├── fr.json             # French
│   └── es.json             # Spanish
└── components/
    └── LanguageSwitcher.tsx # Language selector
```

### **Routing Structure**
```
/                    → Redirects to /en
/en                  → English home page
/vi                  → Vietnamese home page
/fr                  → French home page
/es                  → Spanish home page
/en/products         → English products page
/vi/admin            → Vietnamese admin panel
/fr/demo             → French localization demo
```

## 🔧 **Configuration**

### **1. i18n Configuration (`src/i18n/config.ts`)**
```typescript
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'vi', 'fr', 'es'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !locales.includes(locale as Locale)) notFound();

  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
```

### **2. Middleware (`middleware.ts`)**
```typescript
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';

export default createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export const config = {
  matcher: ['/', '/(vi|en|fr|es)/:path*']
};
```

### **3. Next.js Configuration (`next.config.ts`)**
```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // ... your config
};

export default withNextIntl(nextConfig);
```

## 📝 **Translation Files**

### **Message Structure**
Each language has a JSON file with nested keys for organization:

```json
{
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "delete": "Delete"
  },
  "products": {
    "title": "Products",
    "addProduct": "Add Product",
    "validation": {
      "nameRequired": "Name is required"
    }
  }
}
```

### **Available Translation Keys**

#### **Common Actions**
- `common.loading` - Loading states
- `common.save` - Save button
- `common.delete` - Delete button
- `common.cancel` - Cancel button
- `common.edit` - Edit button
- `common.add` - Add button

#### **Navigation**
- `navigation.home` - Home link
- `navigation.products` - Products link
- `navigation.admin` - Admin link
- `navigation.login` - Login link

#### **Admin Panel**
- `admin.title` - Admin panel title
- `admin.dashboard` - Dashboard
- `admin.users` - Users management
- `admin.orders` - Orders management
- `admin.images` - Images management

#### **Products**
- `products.title` - Products page title
- `products.addProduct` - Add product button
- `products.productName` - Product name field
- `products.productCategory` - Category field
- `products.productPrice` - Price field

#### **Images**
- `images.title` - Image management title
- `images.cleanupManager` - Cleanup manager
- `images.storageStatistics` - Storage statistics
- `images.dryRun` - Dry run button
- `images.cleanUp` - Clean up button

## 🎯 **Usage Examples**

### **1. Using Translations in Components**
```tsx
import { useTranslations } from 'next-intl';

export default function ProductForm() {
  const t = useTranslations('products');
  
  return (
    <form>
      <h1>{t('title')}</h1>
      <label>{t('productName')}</label>
      <input placeholder={t('enterName')} />
      <button type="submit">{t('addProduct')}</button>
    </form>
  );
}
```

### **2. Using Common Translations**
```tsx
import { useTranslations } from 'next-intl';

export default function ActionButtons() {
  const t = useTranslations('common');
  
  return (
    <div>
      <button>{t('save')}</button>
      <button>{t('cancel')}</button>
      <button>{t('delete')}</button>
    </div>
  );
}
```

### **3. Nested Translation Keys**
```tsx
const t = useTranslations('products.validation');

return (
  <div>
    {errors.name && <span>{t('nameRequired')}</span>}
    {errors.price && <span>{t('pricePositive')}</span>}
  </div>
);
```

### **4. Language Switcher Component**
```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  return (
    <header>
      <nav>...</nav>
      <LanguageSwitcher />
    </header>
  );
}
```

## 🌐 **Language Switching**

### **Automatic Detection**
- **Browser Language**: Detects user's preferred language
- **URL-based**: Always shows locale in URL
- **Fallback**: Redirects to default locale if invalid

### **Manual Switching**
Users can change language using the dropdown in the header:
- **🇺🇸 English** → `/en/...`
- **🇻🇳 Tiếng Việt** → `/vi/...`
- **🇫🇷 Français** → `/fr/...`
- **🇪🇸 Español** → `/es/...`

### **URL Structure**
```
Current: /en/products
Switch to Vietnamese: /vi/products
Switch to French: /fr/products
Switch to Spanish: /es/products
```

## 📱 **Component Integration**

### **Header Component**
The language switcher is automatically included in the header:
```tsx
import LanguageSwitcher from './LanguageSwitcher';

// Automatically shows current language
// Allows switching between supported languages
<LanguageSwitcher />
```

### **Admin Layout**
All admin pages automatically support localization:
```tsx
// /en/admin → English admin
// /vi/admin → Vietnamese admin
// /fr/admin → French admin
// /es/admin → Spanish admin
```

## 🧪 **Testing Localization**

### **Demo Page**
Visit `/demo` to see all translations in action:
- **Common Actions**: Loading, Save, Delete, etc.
- **Navigation**: Home, Products, Admin
- **Product Management**: Add, Edit, Delete products
- **Image Management**: Cleanup, statistics

### **Language Switching Test**
1. Navigate to any page (e.g., `/en/products`)
2. Use language switcher in header
3. Verify URL changes (e.g., `/vi/products`)
4. Check all text is translated

## 🔍 **Debugging & Troubleshooting**

### **Common Issues**

#### **Translation Not Found**
```typescript
// ❌ This will throw an error
const t = useTranslations('nonexistent');

// ✅ Use existing translation keys
const t = useTranslations('common');
```

#### **Locale Not Supported**
```typescript
// ❌ Invalid locale
/en/unsupported-locale

// ✅ Valid locales
/en, /vi, /fr, /es
```

#### **Missing Translation Files**
Ensure all locale files exist:
```
src/messages/
├── en.json  ✅
├── vi.json  ✅
├── fr.json  ✅
└── es.json  ✅
```

### **Debug Mode**
Enable verbose logging:
```bash
DEBUG=next-intl npm run dev
```

## 🚀 **Adding New Languages**

### **1. Add Language to Config**
```typescript
// src/i18n/config.ts
export const locales = ['en', 'vi', 'fr', 'es', 'de'] as const;
```

### **2. Create Translation File**
```json
// src/messages/de.json
{
  "common": {
    "loading": "Laden...",
    "save": "Speichern",
    "delete": "Löschen"
  }
}
```

### **3. Update Middleware**
```typescript
// middleware.ts
export const config = {
  matcher: ['/', '/(vi|en|fr|es|de)/:path*']
};
```

### **4. Add Language Support**
```typescript
// src/components/LanguageSwitcher.tsx
const languageNames = {
  en: 'English',
  vi: 'Tiếng Việt',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch'  // New language
};
```

## 📊 **Performance Considerations**

### **Bundle Optimization**
- **Code Splitting**: Each locale loads only its messages
- **Lazy Loading**: Messages loaded on demand
- **Tree Shaking**: Unused translations removed

### **Caching**
- **Static Generation**: Locale pages pre-built
- **CDN Ready**: Optimized for global distribution
- **Browser Cache**: Translation files cached

## 🔮 **Future Enhancements**

### **Planned Features**
- [ ] **RTL Support**: Right-to-left languages (Arabic, Hebrew)
- [ ] **Number Formatting**: Locale-specific number formats
- [ ] **Date Formatting**: Locale-specific date formats
- [ ] **Currency Support**: Multi-currency display
- [ ] **Pluralization**: Complex plural rules
- [ ] **Gender Support**: Gender-specific translations

### **Advanced Features**
- [ ] **Context-aware**: Dynamic translations based on user context
- [ ] **A/B Testing**: Test different translation versions
- [ ] **Analytics**: Track language usage patterns
- [ ] **Auto-translation**: AI-powered translation suggestions

## 📚 **Best Practices**

### **Translation Management**
1. **Consistent Keys**: Use descriptive, hierarchical keys
2. **Context Comments**: Add comments for translators
3. **Regular Updates**: Keep translations in sync with code
4. **Quality Checks**: Review translations for accuracy

### **Development Workflow**
1. **Start with English**: Develop with English as base
2. **Add Keys**: Add translation keys as you develop
3. **Translate Later**: Focus on functionality first
4. **Test All Languages**: Verify all locales work

### **Maintenance**
1. **Regular Audits**: Check for missing translations
2. **Update Dependencies**: Keep next-intl updated
3. **Monitor Performance**: Watch for bundle size increases
4. **User Feedback**: Collect feedback on translations

## 🎯 **Summary**

The localization system provides:

1. **🌍 Multi-language Support**: English, Vietnamese, French, Spanish
2. **🔧 Easy Configuration**: Simple setup with next-intl
3. **📱 User-friendly**: Language switcher in header
4. **⚡ Performance**: Optimized for speed and efficiency
5. **🔒 Type Safety**: Full TypeScript support
6. **📝 Maintainable**: JSON-based translation files
7. **🚀 Scalable**: Easy to add new languages

This comprehensive solution ensures your application can reach global audiences while maintaining excellent user experience and developer productivity!
