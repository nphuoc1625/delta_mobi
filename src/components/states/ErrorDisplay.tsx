import React from "react";

interface ErrorDisplayProps {
    error: string | null;
    onRetry?: () => void;
    className?: string;
}

export function ErrorDisplay({ error, onRetry, className = "" }: ErrorDisplayProps) {
    if (!error) return null;

    return (
        <div className={`error-display ${className}`}>
            <div className="error-message">{error}</div>
            {onRetry && (
                <button onClick={onRetry} className="retry-button">
                    Try Again
                </button>
            )}
        </div>
    );
} 