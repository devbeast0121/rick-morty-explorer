'use client';

import { ThemeToggle } from './ThemeToggle';

export function AppHeader() {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <a
                            href="/"
                            className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            🛸 Rick & Morty Explorer
                        </a>
                    </div>

                    <nav className="hidden sm:flex items-center space-x-4">
                        <a
                            href="/"
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Characters
                        </a>
                        <a
                            href="/?favorites=true"
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Favorites
                        </a>
                        <ThemeToggle />
                    </nav>

                    {/* Mobile menu - shows theme toggle */}
                    <div className="sm:hidden">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}