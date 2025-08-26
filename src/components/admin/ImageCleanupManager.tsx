import { useState, useEffect } from 'react';
import { useTheme } from '@/core/theme/ThemeContext';

interface CleanupStats {
    total: number;
    used: number;
    orphaned: number;
    size: number;
    sizeFormatted: string;
}

interface CleanupResult {
    deleted: string[];
    failed: string[];
    total: number;
    deletedFormatted: Array<{ name: string; size: string }>;
}

export default function ImageCleanupManager() {
    const { colors } = useTheme();
    const [stats, setStats] = useState<CleanupStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Load cleanup statistics
    const loadStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/upload/cleanup');
            if (!response.ok) {
                throw new Error('Failed to load cleanup statistics');
            }

            const data = await response.json();
            setStats(data.stats);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load stats';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Perform dry run
    const performDryRun = async () => {
        try {
            setLoading(true);
            setError(null);
            setCleanupResult(null);

            const response = await fetch('/api/upload/cleanup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dryRun: true }),
            });

            if (!response.ok) {
                throw new Error('Failed to perform dry run');
            }

            const data = await response.json();
            setSuccess(data.message);
            setStats(data.stats);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to perform dry run';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Perform actual cleanup
    const performCleanup = async () => {
        if (!stats || stats.orphaned === 0) return;

        if (!confirm(`Are you sure you want to delete ${stats.orphaned} orphaned images? This action cannot be undone.`)) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await fetch('/api/upload/cleanup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dryRun: false }),
            });

            if (!response.ok) {
                throw new Error('Failed to perform cleanup');
            }

            const data = await response.json();
            setSuccess(data.message);
            setCleanupResult(data.result);

            // Refresh stats after cleanup
            await loadStats();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to perform cleanup';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Load stats on component mount
    useEffect(() => {
        loadStats();
    }, []);

    // Clear success message after 5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    return (
        <div style={{
            background: colors.background,
            color: colors.foreground,
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: `1px solid ${colors.border}`
        }}>
            <h3 style={{
                color: colors.primary,
                fontWeight: 600,
                fontSize: '1.25rem',
                marginBottom: '1.5rem'
            }}>
                🗑️ Image Cleanup Manager
            </h3>

            {/* Success Message */}
            {success && (
                <div style={{
                    background: '#22c55e',
                    color: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span>✅</span>
                    {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span>❌</span>
                    {error}
                </div>
            )}

            {/* Statistics */}
            {stats && (
                <div style={{
                    background: colors.muted,
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    marginBottom: '1.5rem'
                }}>
                    <h4 style={{
                        fontWeight: 600,
                        marginBottom: '1rem',
                        color: colors.foreground
                    }}>
                        📊 Storage Statistics
                    </h4>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.primary }}>
                                {stats.total}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: colors.secondary }}>
                                Total Images
                            </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>
                                {stats.used}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: colors.secondary }}>
                                Used Images
                            </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stats.orphaned > 0 ? '#f59e0b' : '#22c55e' }}>
                                {stats.orphaned}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: colors.secondary }}>
                                Orphaned Images
                            </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stats.size > 0 ? '#ef4444' : '#22c55e' }}>
                                {stats.sizeFormatted}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: colors.secondary }}>
                                Wasted Space
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                    onClick={loadStats}
                    disabled={loading}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        background: colors.muted,
                        color: colors.foreground,
                        border: `1px solid ${colors.border}`,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 500,
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    🔄 Refresh Stats
                </button>

                <button
                    onClick={performDryRun}
                    disabled={loading || !stats || stats.orphaned === 0}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        cursor: (loading || !stats || stats.orphaned === 0) ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        opacity: (loading || !stats || stats.orphaned === 0) ? 0.6 : 1,
                    }}
                >
                    🔍 Dry Run
                </button>

                <button
                    onClick={performCleanup}
                    disabled={loading || !stats || stats.orphaned === 0}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        cursor: (loading || !stats || stats.orphaned === 0) ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        opacity: (loading || !stats || stats.orphaned === 0) ? 0.6 : 1,
                    }}
                >
                    🗑️ Clean Up
                </button>
            </div>

            {/* Cleanup Results */}
            {cleanupResult && (
                <div style={{
                    marginTop: '1.5rem',
                    background: colors.muted,
                    padding: '1.5rem',
                    borderRadius: '0.75rem'
                }}>
                    <h4 style={{
                        fontWeight: 600,
                        marginBottom: '1rem',
                        color: colors.foreground
                    }}>
                        🎯 Cleanup Results
                    </h4>

                    <div style={{ marginBottom: '1rem' }}>
                        <strong>✅ Successfully deleted:</strong> {cleanupResult.deleted.length} images
                    </div>

                    {cleanupResult.failed.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            <strong>❌ Failed to delete:</strong> {cleanupResult.failed.length} images
                        </div>
                    )}

                    {cleanupResult.deletedFormatted.length > 0 && (
                        <div>
                            <strong>📋 Deleted files:</strong>
                            <ul style={{
                                marginTop: '0.5rem',
                                marginLeft: '1.5rem',
                                fontSize: '0.875rem'
                            }}>
                                {cleanupResult.deletedFormatted.map((file, index) => (
                                    <li key={index}>
                                        {file.name} ({file.size})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: colors.secondary
                }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
                    Processing...
                </div>
            )}

            {/* No Orphaned Images */}
            {stats && stats.orphaned === 0 && !loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: colors.secondary,
                    background: colors.muted,
                    borderRadius: '0.75rem',
                    marginTop: '1rem'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                        No orphaned images found!
                    </div>
                    <div>Your image storage is clean and optimized.</div>
                </div>
            )}
        </div>
    );
}
