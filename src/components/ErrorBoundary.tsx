'use client';

import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    reset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback || ErrorFallback;
            return <FallbackComponent error={this.state.error} reset={this.reset} />;
        }

        return this.props.children;
    }
}

interface ErrorFallbackProps {
    error?: Error;
    reset: () => void;
}

export const ErrorFallback = ({ error, reset }: ErrorFallbackProps) => {
    return (
        <div className="min-h-64 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
                <div className="text-6xl mb-4">😵</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Oops! Something went wrong
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {error?.message || 'An unexpected error occurred'}
                </p>
                <button
                    onClick={reset}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
};

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorMessage = ({ message, onRetry, className = '' }: ErrorMessageProps) => {
    return (
        <div className={`text-center py-8 ${className}`}>
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};