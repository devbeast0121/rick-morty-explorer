'use client';

import { useState } from 'react';

interface FavoriteButtonProps {
    isFavorite: boolean;
    onToggle: (e: React.MouseEvent) => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    'aria-label'?: string;
}

export const FavoriteButton = ({
    isFavorite,
    onToggle,
    size = 'md',
    className = '',
    'aria-label': ariaLabel,
}: FavoriteButtonProps) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Trigger animation
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 200);

        onToggle(e);
    };

    return (
        <button
            onClick={handleClick}
            className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        bg-white/90 dark:bg-gray-800/90
        backdrop-blur-sm
        border border-gray-200 dark:border-gray-600
        hover:bg-white dark:hover:bg-gray-800
        hover:scale-110
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        ${isAnimating ? 'scale-125' : ''}
        ${className}
      `}
            aria-label={ariaLabel || `${isFavorite ? 'Remove from' : 'Add to'} favorites`}
            type="button"
        >
            <svg
                className={`${iconSizes[size]} transition-colors duration-200 ${isFavorite
                        ? 'text-red-500 fill-current'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        </button>
    );
};