import { NextRequest, NextResponse } from 'next/server';
import { readdir, unlink, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Get all image files in uploads directory
async function getAllUploadedImages(): Promise<string[]> {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');

    if (!existsSync(uploadsDir)) {
        return [];
    }

    try {
        const files = await readdir(uploadsDir);
        const imageFiles = files.filter(file => {
            const ext = file.toLowerCase().split('.').pop();
            return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
        });
        return imageFiles;
    } catch (error) {
        console.error('Failed to read uploads directory:', error);
        return [];
    }
}

// Get all image URLs currently used in products
async function getUsedImageUrls(): Promise<string[]> {
    try {
        // Import the Product model to query the database
        const { default: mongoose } = await import('mongoose');
        const ProductModel = await import('@/infrastructure/mongodb/tables/Product.model');

        // Ensure database connection
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database not connected');
        }

        // Get all products and extract image URLs
        const products = await ProductModel.default.find({}, 'image');
        const usedUrls = products
            .map((product: { image?: string }) => product.image)
            .filter((image): image is string => typeof image === 'string' && image.startsWith('/uploads/'))
            .map((image: string) => image.split('/').pop()) // Extract filename
            .filter((filename): filename is string => filename !== undefined); // Filter out undefined values

        return usedUrls;
    } catch (error) {
        console.error('Failed to get used image URLs:', error);
        return [];
    }
}

// Clean up orphaned images
async function cleanupOrphanedImages(): Promise<{ deleted: string[], failed: string[], total: number }> {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const allImages = await getAllUploadedImages();
    const usedImages = await getUsedImageUrls();

    const orphanedImages = allImages.filter(image => !usedImages.includes(image));
    const deleted: string[] = [];
    const failed: string[] = [];

    console.log(`📊 [CLEANUP] Found ${allImages.length} total images, ${usedImages.length} used, ${orphanedImages.length} orphaned`);

    for (const image of orphanedImages) {
        try {
            const imagePath = join(uploadsDir, image);
            await unlink(imagePath);
            deleted.push(image);
            console.log(`✅ [CLEANUP] Deleted orphaned image: ${image}`);
        } catch (error) {
            console.error(`❌ [CLEANUP] Failed to delete ${image}:`, error);
            failed.push(image);
        }
    }

    return { deleted, failed, total: allImages.length };
}

// Get cleanup statistics
async function getCleanupStats(): Promise<{ total: number, used: number, orphaned: number, size: number }> {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const allImages = await getAllUploadedImages();
    const usedImages = await getUsedImageUrls();
    const orphanedImages = allImages.filter(image => !usedImages.includes(image));

    // Calculate total size of orphaned images
    let totalSize = 0;
    for (const image of orphanedImages) {
        try {
            const imagePath = join(uploadsDir, image);
            const stats = await stat(imagePath);
            totalSize += stats.size;
        } catch (error) {
            console.error(`Failed to get size for ${image}:`, error);
        }
    }

    return {
        total: allImages.length,
        used: usedImages.length,
        orphaned: orphanedImages.length,
        size: totalSize
    };
}

// Helper function to get image size
async function getImageSize(filename: string): Promise<number> {
    try {
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        const imagePath = join(uploadsDir, filename);
        const stats = await stat(imagePath);
        return stats.size;
    } catch {
        return 0;
    }
}

// Helper function to format bytes
function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// GET - Get cleanup statistics
export async function GET() {
    try {
        const stats = await getCleanupStats();

        return NextResponse.json({
            success: true,
            stats: {
                ...stats,
                sizeFormatted: formatBytes(stats.size)
            }
        });
    } catch (error) {
        console.error('❌ [CLEANUP] Failed to get stats:', error);
        return NextResponse.json(
            { error: 'Failed to get cleanup statistics' },
            { status: 500 }
        );
    }
}

// POST - Perform cleanup
export async function POST(request: NextRequest) {
    try {
        const { dryRun = false } = await request.json();

        if (dryRun) {
            // Dry run - just return what would be deleted
            const stats = await getCleanupStats();
            return NextResponse.json({
                success: true,
                dryRun: true,
                message: `Would delete ${stats.orphaned} orphaned images (${formatBytes(stats.size)})`,
                stats
            });
        }

        // Actual cleanup
        const result = await cleanupOrphanedImages();

        // Process deleted images to get their sizes
        const deletedFormatted = await Promise.all(
            result.deleted.map(async (img) => ({
                name: img,
                size: formatBytes(await getImageSize(img))
            }))
        );

        return NextResponse.json({
            success: true,
            message: `Cleaned up ${result.deleted.length} orphaned images`,
            result: {
                ...result,
                deletedFormatted
            }
        });

    } catch (error) {
        console.error('❌ [CLEANUP] Cleanup failed:', error);
        return NextResponse.json(
            { error: 'Failed to perform cleanup' },
            { status: 500 }
        );
    }
}
