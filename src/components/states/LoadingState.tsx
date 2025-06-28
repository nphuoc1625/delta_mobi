interface LoadingStateProps {
    loading: boolean;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function LoadingState({
    loading,
    children,
    fallback = <div>Loading...</div>
}: LoadingStateProps) {
    if (loading) return <>{fallback}</>;
    return <>{children}</>;
} 