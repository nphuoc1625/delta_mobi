# Image Upload Feature

## Overview
The image upload feature allows users to upload product images directly to the public folder through a drag-and-drop interface or file selection dialog.

## Features

### 🖼️ **Upload Methods**
- **Drag & Drop**: Users can drag image files directly onto the upload area
- **Click to Upload**: Click the upload area to open the file selection dialog
- **Change Image**: For existing images, users can click "Change Image" to upload a new one

### 📁 **File Validation**
- **File Type**: Only image files (PNG, JPG, GIF, etc.) are accepted
- **File Size**: Maximum file size is 5MB
- **Real-time Validation**: Immediate feedback for invalid files

### 🎯 **User Experience**
- **Visual Preview**: Shows uploaded image with 120x120px preview
- **Loading States**: Displays upload progress and loading indicators
- **Error Handling**: Clear error messages for validation failures
- **Remove Option**: Red "×" button to remove uploaded images

## Technical Implementation

### **API Endpoint**
```
POST /api/upload
```

**Request:**
- `FormData` with `file` field containing the image file

**Response:**
```json
{
  "success": true,
  "url": "/uploads/1234567890_abc123.jpg",
  "fileName": "1234567890_abc123.jpg",
  "fileSize": 1024000,
  "fileType": "image/jpeg"
}
```

### **File Storage**
- **Location**: `public/uploads/` directory
- **Naming**: `{timestamp}_{randomString}.{extension}`
- **Example**: `1703123456789_abc123def456.jpg`

### **Components**

#### **ImageUpload Component**
```tsx
<ImageUpload
    value={form.image}
    onChange={handleImageChange}
    onError={handleImageError}
    disabled={submitting}
/>
```

**Props:**
- `value`: Current image URL string
- `onChange`: Callback when image URL changes
- `onError`: Callback for upload errors
- `disabled`: Whether upload is disabled

#### **ProductFormPopup Integration**
- Replaces the text input for image URL
- Handles image upload before form submission
- Shows preview of uploaded images
- Integrates with existing form validation

### **Next.js Configuration**
```ts
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '3000',
      pathname: '/uploads/**',
    }
  ],
  unoptimized: process.env.NODE_ENV === 'development',
}
```

## Usage Examples

### **Basic Upload**
```tsx
const [imageUrl, setImageUrl] = useState('');

<ImageUpload
    value={imageUrl}
    onChange={setImageUrl}
/>
```

### **With Error Handling**
```tsx
const [imageUrl, setImageUrl] = useState('');
const [imageError, setImageError] = useState('');

<ImageUpload
    value={imageUrl}
    onChange={setImageUrl}
    onError={setImageError}
/>
{imageError && <div className="error">{imageError}</div>}
```

### **In Form Context**
```tsx
const [form, setForm] = useState({ image: '' });

const handleImageChange = (url: string) => {
    setForm(prev => ({ ...prev, image: url }));
};

<ImageUpload
    value={form.image}
    onChange={handleImageChange}
    disabled={submitting}
/>
```

## Security Considerations

### **File Validation**
- ✅ File type validation (images only)
- ✅ File size limits (5MB max)
- ✅ Secure filename generation
- ✅ No path traversal vulnerabilities

### **Storage Security**
- ✅ Files stored in public directory (intended for public access)
- ✅ Unique filenames prevent conflicts
- ✅ No executable files allowed

## Error Handling

### **Common Errors**
1. **Invalid File Type**: "Please select an image file"
2. **File Too Large**: "File size must be less than 5MB"
3. **Upload Failed**: "Upload failed" (network/server errors)

### **Error Display**
- Red error messages below upload area
- Automatic error clearing on successful upload
- User-friendly error descriptions

## Performance Features

### **Image Optimization**
- Uses Next.js `Image` component for optimized rendering
- Automatic lazy loading
- Responsive image handling

### **Upload Efficiency**
- Single file upload (prevents multiple simultaneous uploads)
- Progress indicators for user feedback
- Automatic cleanup of temporary states

## Future Enhancements

### **Potential Improvements**
- [ ] Multiple file upload support
- [ ] Image compression before upload
- [ ] Cloud storage integration (AWS S3, Cloudinary)
- [ ] Image cropping and editing
- [ ] Bulk upload functionality
- [ ] Image optimization on server

### **Scalability Considerations**
- [ ] CDN integration for production
- [ ] Image resizing for different screen sizes
- [ ] Backup and redundancy strategies
- [ ] Monitoring and analytics

## Troubleshooting

### **Common Issues**

#### **Upload Fails**
- Check file size (must be < 5MB)
- Verify file type is an image
- Check network connectivity
- Verify `/public/uploads` directory exists

#### **Image Not Displaying**
- Check Next.js image configuration
- Verify file path is correct
- Check browser console for errors
- Ensure file exists in uploads directory

#### **Permission Errors**
- Ensure `public/uploads` directory is writable
- Check file system permissions
- Verify Node.js process has write access

## Testing

### **Manual Testing**
1. **Valid Upload**: Upload various image types and sizes
2. **Invalid Files**: Try non-image files and oversized files
3. **Drag & Drop**: Test drag and drop functionality
4. **Error Handling**: Verify error messages display correctly
5. **Form Integration**: Test with product creation/editing

### **Automated Testing**
- Unit tests for validation logic
- Integration tests for API endpoints
- E2E tests for complete upload flow
- Performance tests for large files
