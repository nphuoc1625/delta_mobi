# Image Cleanup & Trash Management

## Overview
The image cleanup system automatically manages orphaned images and provides tools to prevent storage waste. It ensures that only images currently used by products remain in storage.

## 🗑️ **Why Image Cleanup is Important**

### **Common Scenarios Creating Orphaned Images:**
1. **Product Deletion**: Images remain when products are deleted
2. **Image Replacement**: Old images aren't removed when new ones are uploaded
3. **Failed Uploads**: Partial uploads that don't get cleaned up
4. **Testing**: Development/testing images that aren't needed in production

### **Benefits:**
- **💾 Storage Optimization**: Free up disk space
- **🚀 Performance**: Faster file system operations
- **💰 Cost Savings**: Reduced backup and hosting costs
- **🧹 Maintenance**: Cleaner, more organized storage

## 🔧 **Automatic Cleanup**

### **Product Deletion Cleanup**
When a product is deleted, its associated image is automatically removed:

```typescript
// In /api/products/route.ts
async function deleteProductImage(imageUrl: string): Promise<void> {
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
        return; // Skip if not a local upload
    }
    
    try {
        const fileName = imageUrl.split('/').pop();
        const imagePath = join(uploadsDir, fileName!);
        
        if (existsSync(imagePath)) {
            await unlink(imagePath);
            console.log(`🗑️ Deleted product image: ${fileName}`);
        }
    } catch (error) {
        console.error(`Failed to delete product image: ${imageUrl}`, error);
        // Don't throw error - image deletion failure shouldn't prevent product deletion
    }
}
```

### **Trigger Points:**
- ✅ **Product Deletion**: Image automatically removed
- ✅ **Product Update**: Old image replaced with new one
- ✅ **Form Validation**: Failed uploads cleaned up immediately

## 🎛️ **Manual Cleanup Tools**

### **1. Admin Interface (`ImageCleanupManager`)**
A React component providing a user-friendly interface for image management:

```tsx
<ImageCleanupManager />
```

**Features:**
- 📊 **Real-time Statistics**: Total, used, and orphaned image counts
- 💾 **Storage Analysis**: Wasted space calculation
- 🔍 **Dry Run**: Preview what would be deleted
- 🗑️ **Safe Cleanup**: Confirmation before deletion
- 📋 **Detailed Results**: List of deleted files with sizes

### **2. API Endpoints**

#### **GET `/api/upload/cleanup`**
Get cleanup statistics:
```json
{
  "success": true,
  "stats": {
    "total": 150,
    "used": 120,
    "orphaned": 30,
    "size": 52428800,
    "sizeFormatted": "50.00 MB"
  }
}
```

#### **POST `/api/upload/cleanup`**
Perform cleanup operations:
```json
// Dry run
{ "dryRun": true }

// Actual cleanup
{ "dryRun": false }
```

**Response:**
```json
{
  "success": true,
  "message": "Cleaned up 30 orphaned images",
  "result": {
    "deleted": ["image1.jpg", "image2.png"],
    "failed": [],
    "total": 150,
    "deletedFormatted": [
      { "name": "image1.jpg", "size": "2.5 MB" },
      { "name": "image2.png", "size": "1.8 MB" }
    ]
  }
}
```

### **3. Command Line Scripts**

#### **Available Commands:**
```bash
# Interactive cleanup (with confirmation)
npm run cleanup:images

# Dry run (show what would be deleted)
npm run cleanup:images:dry

# Force cleanup (skip confirmation)
npm run cleanup:images:force
```

#### **Script Features:**
- 🔍 **Database Integration**: Queries MongoDB for used images
- 📁 **File System Scanning**: Reads uploads directory
- 💾 **Size Calculation**: Shows wasted space
- ⚠️ **Safety Checks**: Confirmation prompts
- 📊 **Detailed Reporting**: Success/failure counts

## 🚀 **Usage Examples**

### **Admin Panel Integration**
Add the cleanup manager to your admin dashboard:

```tsx
// In your admin layout or dashboard
import ImageCleanupManager from '@/components/admin/ImageCleanupManager';

function AdminDashboard() {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <ImageCleanupManager />
        </div>
    );
}
```

### **Scheduled Cleanup**
Set up automated cleanup using cron jobs:

```bash
# Clean up images daily at 2 AM
0 2 * * * cd /path/to/your/app && npm run cleanup:images:force

# Weekly cleanup with dry run first
0 2 * * 0 cd /path/to/your/app && npm run cleanup:images:dry
0 3 * * 0 cd /path/to/your/app && npm run cleanup:images:force
```

### **Programmatic Cleanup**
Call the cleanup API from your application:

```typescript
// Perform cleanup programmatically
async function performCleanup() {
    try {
        const response = await fetch('/api/upload/cleanup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dryRun: false })
        });
        
        const result = await response.json();
        console.log(`Cleaned up ${result.result.deleted.length} images`);
    } catch (error) {
        console.error('Cleanup failed:', error);
    }
}
```

## 🔒 **Safety Features**

### **Prevention Measures:**
- ✅ **Dry Run Mode**: Preview changes before execution
- ✅ **Confirmation Prompts**: User must confirm deletions
- ✅ **Database Validation**: Only delete truly orphaned images
- ✅ **Error Handling**: Failed deletions don't stop the process
- ✅ **Logging**: All operations are logged for audit

### **Recovery Options:**
- 📁 **Backup Strategy**: Regular backups of uploads directory
- 🔄 **Version Control**: Git tracking of important images
- 📋 **Operation Logs**: Detailed logs of all cleanup operations

## 📊 **Monitoring & Analytics**

### **Key Metrics:**
- **Total Images**: All images in storage
- **Used Images**: Images currently referenced by products
- **Orphaned Images**: Unused images taking up space
- **Wasted Space**: Total size of orphaned images
- **Cleanup Frequency**: How often cleanup is performed

### **Performance Impact:**
- **Scan Time**: Typically < 1 second for 1000+ images
- **Cleanup Time**: Depends on number of files and sizes
- **Memory Usage**: Minimal - processes files one at a time
- **Database Load**: Single query to get used images

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **Permission Errors**
```bash
# Check directory permissions
ls -la public/uploads/

# Fix permissions if needed
chmod 755 public/uploads/
chown www-data:www-data public/uploads/
```

#### **Database Connection Issues**
```bash
# Verify MongoDB connection
npm run cleanup:images:dry

# Check environment variables
echo $MONGODB_URI
```

#### **Partial Cleanup**
```bash
# Check for failed deletions
npm run cleanup:images:dry

# Retry cleanup
npm run cleanup:images:force
```

### **Debug Mode:**
Enable verbose logging by setting environment variable:
```bash
DEBUG=image-cleanup npm run cleanup:images
```

## 🔮 **Future Enhancements**

### **Planned Features:**
- [ ] **Image Compression**: Reduce file sizes before storage
- [ ] **Cloud Storage**: Integration with AWS S3, Cloudinary
- [ ] **CDN Integration**: Automatic CDN cache invalidation
- [ ] **Batch Operations**: Process multiple images simultaneously
- [ ] **Scheduled Cleanup**: Built-in cron job management
- [ ] **Email Notifications**: Cleanup completion reports

### **Advanced Analytics:**
- [ ] **Storage Trends**: Historical storage usage data
- [ ] **Image Usage Patterns**: Most/least used image types
- [ ] **Cost Analysis**: Storage cost calculations
- [ ] **Performance Metrics**: Upload/cleanup performance data

## 📚 **Best Practices**

### **Recommended Workflows:**
1. **Daily**: Run dry run to monitor orphaned images
2. **Weekly**: Perform actual cleanup during low-traffic periods
3. **Monthly**: Review cleanup statistics and adjust strategies
4. **Before Deployments**: Clean up test/development images

### **Storage Optimization:**
- 🖼️ **Image Formats**: Use WebP for better compression
- 📏 **Dimensions**: Resize images to required sizes
- 🎯 **Quality**: Balance quality vs file size
- 🗂️ **Organization**: Use descriptive filenames

### **Backup Strategy:**
- 💾 **Regular Backups**: Daily backups of uploads directory
- 🔄 **Incremental Backups**: Only backup changed files
- 📍 **Multiple Locations**: Local + cloud backup storage
- 🧪 **Recovery Testing**: Test backup restoration regularly

## 🎯 **Summary**

The image cleanup system provides:

1. **🔄 Automatic Cleanup**: Images removed when products are deleted
2. **🎛️ Manual Management**: Admin interface for manual cleanup
3. **📱 Command Line Tools**: Scripts for automation and scheduling
4. **🔒 Safety Features**: Dry runs, confirmations, and error handling
5. **📊 Monitoring**: Real-time statistics and performance metrics
6. **🚀 Scalability**: Efficient processing of large numbers of images

This comprehensive solution ensures your image storage remains clean, organized, and cost-effective while providing multiple ways to manage and monitor the cleanup process.
