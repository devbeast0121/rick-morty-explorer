interface LoadingSkeletonProps {
    count?: number;
    className?: string;
}

export const LoadingSkeleton = ({ count = 1, className = '' }: LoadingSkeletonProps) => {
    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <div
                    key={i}
                    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}
                />
            ))}
        </>
    );
};

export const CharacterCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
            <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                </div>
                <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export const CharacterGridSkeleton = ({ count = 12 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }, (_, i) => (
                <CharacterCardSkeleton key={i} />
            ))}
        </div>
    );
};