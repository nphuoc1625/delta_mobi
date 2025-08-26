import { FaSpinner } from "react-icons/fa";

interface LoadingStateProps {
    loading: boolean;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function LoadingState({
    loading,
    children,
    fallback = <div className="flex flex-col items-center justify-center min-h-[120px] w-full py-8">
        <FaSpinner className="animate-spin text-blue-500 text-3xl mb-2" />
        <span className="text-gray-400 text-base mt-2">Loading...</span>
    </div>
}: LoadingStateProps) {
    if (loading) return <>{fallback}</>;
    return <>{children}</>;
} 