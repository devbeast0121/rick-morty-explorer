'use client';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className = ''
}: PaginationProps) => {
    // Don't render if there's only one page or no pages
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const delta = 2; // Number of pages to show on each side of current page
        const range = [];
        const rangeWithDots = [];

        // Calculate the range of pages to show
        const start = Math.max(1, currentPage - delta);
        const end = Math.min(totalPages, currentPage + delta);

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        // Add first page and dots if needed
        if (start > 1) {
            rangeWithDots.push(1);
            if (start > 2) {
                rangeWithDots.push('...');
            }
        }

        // Add the main range
        rangeWithDots.push(...range);

        // Add last page and dots if needed
        if (end < totalPages) {
            if (end < totalPages - 1) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    const buttonBaseClass = `
    px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

    const pageButtonClass = `
    ${buttonBaseClass}
    border border-gray-300 dark:border-gray-600
    hover:bg-gray-50 dark:hover:bg-gray-700
    text-gray-700 dark:text-gray-300
  `;

    const activePageButtonClass = `
    ${buttonBaseClass}
    bg-blue-600 text-white border-blue-600
    hover:bg-blue-700
  `;

    const navButtonClass = `
    ${buttonBaseClass}
    border border-gray-300 dark:border-gray-600
    hover:bg-gray-50 dark:hover:bg-gray-700
    text-gray-700 dark:text-gray-300
  `;

    return (
        <nav
            role="navigation"
            aria-label="Pagination"
            className={`flex justify-center items-center space-x-1 ${className}`}
        >
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={navButtonClass}
                aria-label="Go to previous page"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            {/* Page Numbers */}
            {visiblePages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span
                            key={`dots-${index}`}
                            className="px-3 py-2 text-gray-500 dark:text-gray-400"
                        >
                            ...
                        </span>
                    );
                }

                const pageNumber = page as number;
                const isActive = pageNumber === currentPage;

                return (
                    <button
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        className={isActive ? activePageButtonClass : pageButtonClass}
                        aria-label={`Go to page ${pageNumber}`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={navButtonClass}
                aria-label="Go to next page"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
        </nav>
    );
};