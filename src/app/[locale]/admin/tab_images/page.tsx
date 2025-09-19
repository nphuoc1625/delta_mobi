import ImageCleanupManager from '@/components/admin/ImageCleanupManager';

export default function ImagesManagementPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    🖼️ Image Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage product images, clean up orphaned files, and optimize storage usage.
                </p>
            </div>

            <ImageCleanupManager />
        </div>
    );
}
