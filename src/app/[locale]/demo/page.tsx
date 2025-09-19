import { useTranslations } from 'next-intl';

export default function LocalizationDemo() {
    const t = useTranslations();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                    🌍 Localization Demo
                </h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Common Translations */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            Common Actions
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Loading:</span>
                                <span className="font-medium">{t('common.loading')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Save:</span>
                                <span className="font-medium">{t('common.save')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Delete:</span>
                                <span className="font-medium">{t('common.delete')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Cancel:</span>
                                <span className="font-medium">{t('common.cancel')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Translations */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            Navigation
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Home:</span>
                                <span className="font-medium">{t('navigation.home')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Products:</span>
                                <span className="font-medium">{t('navigation.products')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Admin:</span>
                                <span className="font-medium">{t('navigation.admin')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Translations */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            Product Management
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Add Product:</span>
                                <span className="font-medium">{t('products.addProduct')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Product Name:</span>
                                <span className="font-medium">{t('products.productName')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Category:</span>
                                <span className="font-medium">{t('products.productCategory')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Price:</span>
                                <span className="font-medium">{t('products.productPrice')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Management Translations */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            Image Management
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Cleanup Manager:</span>
                                <span className="font-medium">{t('images.cleanupManager')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Total Images:</span>
                                <span className="font-medium">{t('images.totalImages')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Dry Run:</span>
                                <span className="font-medium">{t('images.dryRun')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Clean Up:</span>
                                <span className="font-medium">{t('images.cleanUp')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Use the language switcher in the header to see these translations in different languages!
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg">
                        <span>🌍</span>
                        <span>Switch languages using the dropdown in the header</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
