import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useTheme } from '@/core/theme/ThemeContext';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    onError?: (error: string) => void;
    disabled?: boolean;
}

export default function ImageUpload({ value, onChange, onError, disabled = false }: ImageUploadProps) {
    const { colors } = useTheme();
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [dragError, setDragError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = useCallback(async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            const error = 'Please select an image file';
            setDragError(error);
            onError?.(error);
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            const error = 'File size must be less than 5MB';
            setDragError(error);
            onError?.(error);
            return;
        }

        setIsUploading(true);
        setDragError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const result = await response.json();
            onChange(result.url);
            setDragError(null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            setDragError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsUploading(false);
        }
    }, [onChange, onError]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setDragError(null);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    }, [handleFileUpload]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [handleFileUpload]);

    const handleRemoveImage = useCallback(() => {
        onChange('');
        setDragError(null);
    }, [onChange]);

    const openFileDialog = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <div style={{ width: '100%' }}>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={disabled}
            />

            {/* Image preview */}
            {value && (
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Image
                            src={value}
                            alt="Product preview"
                            width={120}
                            height={120}
                            style={{
                                objectFit: 'cover',
                                borderRadius: '0.5rem',
                                border: `2px solid ${colors.border}`,
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            disabled={disabled || isUploading}
                            style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: disabled || isUploading ? 0.5 : 1,
                            }}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Upload area */}
            {!value && (
                <div
                    style={{
                        border: `2px dashed ${isDragging ? colors.primary : colors.border}`,
                        borderRadius: '0.5rem',
                        padding: '2rem',
                        textAlign: 'center',
                        background: isDragging ? `${colors.primary}10` : colors.muted,
                        cursor: disabled || isUploading ? 'not-allowed' : 'pointer',
                        opacity: disabled || isUploading ? 0.6 : 1,
                        transition: 'all 0.2s ease',
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={!disabled && !isUploading ? openFileDialog : undefined}
                >
                    {isUploading ? (
                        <div style={{ color: colors.secondary }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
                            <div>Uploading...</div>
                        </div>
                    ) : (
                        <div style={{ color: colors.secondary }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <strong>Click to upload</strong> or drag and drop
                            </div>
                            <div style={{ fontSize: '0.85rem' }}>
                                PNG, JPG, GIF up to 5MB
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Error message */}
            {dragError && (
                <div style={{
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    background: '#fef2f2',
                    borderRadius: '0.25rem',
                    border: '1px solid #fecaca'
                }}>
                    {dragError}
                </div>
            )}

            {/* Manual upload button */}
            {value && (
                <button
                    type="button"
                    onClick={openFileDialog}
                    disabled={disabled || isUploading}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        background: colors.muted,
                        color: colors.foreground,
                        border: `1px solid ${colors.border}`,
                        cursor: disabled || isUploading ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                        marginTop: '0.5rem',
                        opacity: disabled || isUploading ? 0.6 : 1,
                    }}
                >
                    Change Image
                </button>
            )}
        </div>
    );
}
