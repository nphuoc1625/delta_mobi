#!/usr/bin/env node

/**
 * Image Cleanup Script
 * 
 * This script cleans up orphaned images in the public/uploads directory.
 * It can be run manually or scheduled as a cron job.
 * 
 * Usage:
 *   node scripts/cleanup-images.js [--dry-run] [--force]
 * 
 * Options:
 *   --dry-run    Show what would be deleted without actually deleting
 *   --force      Skip confirmation prompt
 */

const fs = require('fs').promises;
const path = require('path');
const { MongoClient } = require('mongodb');

// Configuration
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/delta_mobi';
const DB_NAME = 'delta_mobi';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force');

console.log('🗑️  Image Cleanup Script');
console.log('========================');
console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}`);
console.log(`Force: ${isForce ? 'Yes' : 'No'}`);
console.log('');

async function getAllUploadedImages() {
    try {
        if (!fs.existsSync(UPLOADS_DIR)) {
            console.log('📁 Uploads directory does not exist');
            return [];
        }

        const files = await fs.readdir(UPLOADS_DIR);
        const imageFiles = files.filter(file => {
            const ext = file.toLowerCase().split('.').pop();
            return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
        });

        return imageFiles;
    } catch (error) {
        console.error('❌ Failed to read uploads directory:', error.message);
        return [];
    }
}

async function getUsedImageUrls() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();

        const db = client.db(DB_NAME);
        const products = await db.collection('products').find({}, { projection: { image: 1 } }).toArray();

        await client.close();

        const usedUrls = products
            .map(product => product.image)
            .filter(image => image && image.startsWith('/uploads/'))
            .map(image => image.split('/').pop());

        return usedUrls;
    } catch (error) {
        console.error('❌ Failed to get used image URLs:', error.message);
        return [];
    }
}

async function getImageSize(filename) {
    try {
        const imagePath = path.join(UPLOADS_DIR, filename);
        const stats = await fs.stat(imagePath);
        return stats.size;
    } catch (error) {
        return 0;
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function cleanupImages() {
    try {
        console.log('🔍 Scanning for images...');

        const allImages = await getAllUploadedImages();
        const usedImages = await getUsedImageUrls();

        const orphanedImages = allImages.filter(image => !usedImages.includes(image));

        console.log(`📊 Found ${allImages.length} total images`);
        console.log(`✅ ${usedImages.length} images are in use`);
        console.log(`🗑️  ${orphanedImages.length} images are orphaned`);

        if (orphanedImages.length === 0) {
            console.log('\n🎉 No orphaned images found!');
            return;
        }

        // Calculate total size of orphaned images
        let totalSize = 0;
        const imageDetails = [];

        for (const image of orphanedImages) {
            const size = await getImageSize(image);
            totalSize += size;
            imageDetails.push({ name: image, size });
        }

        console.log(`💾 Total wasted space: ${formatBytes(totalSize)}`);

        // Show orphaned images
        console.log('\n📋 Orphaned images:');
        imageDetails.forEach(({ name, size }) => {
            console.log(`   ${name} (${formatBytes(size)})`);
        });

        if (isDryRun) {
            console.log('\n🔍 DRY RUN: No files were deleted');
            return;
        }

        // Confirm deletion
        if (!isForce) {
            console.log('\n⚠️  WARNING: This will permanently delete the orphaned images!');
            const readline = require('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const answer = await new Promise(resolve => {
                rl.question('Are you sure you want to continue? (yes/no): ', resolve);
            });
            rl.close();

            if (answer.toLowerCase() !== 'yes') {
                console.log('❌ Operation cancelled');
                return;
            }
        }

        // Delete orphaned images
        console.log('\n🗑️  Deleting orphaned images...');
        let deletedCount = 0;
        let failedCount = 0;

        for (const image of orphanedImages) {
            try {
                const imagePath = path.join(UPLOADS_DIR, image);
                await fs.unlink(imagePath);
                console.log(`   ✅ Deleted: ${image}`);
                deletedCount++;
            } catch (error) {
                console.log(`   ❌ Failed to delete ${image}: ${error.message}`);
                failedCount++;
            }
        }

        console.log('\n🎯 Cleanup completed!');
        console.log(`   ✅ Successfully deleted: ${deletedCount} images`);
        if (failedCount > 0) {
            console.log(`   ❌ Failed to delete: ${failedCount} images`);
        }
        console.log(`   💾 Freed space: ${formatBytes(totalSize)}`);

    } catch (error) {
        console.error('❌ Cleanup failed:', error.message);
        process.exit(1);
    }
}

// Run the cleanup
cleanupImages().then(() => {
    console.log('\n✨ Script completed successfully');
    process.exit(0);
}).catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
});
